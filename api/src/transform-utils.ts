import jsonpatch, { Operation } from 'fast-json-patch';
import * as fs from 'fs';
import { JSONPath, JSONPathOptions } from 'jsonpath-plus';
import path from 'path';
import xlsx from 'xlsx';
import SchemaParser, { TemplateSchema, TransformSchema } from './schema-utils';
import { getWorksheetByName, getWorksheetRange, trimWorksheetCells } from './xlsx-utils';

/**
 * Defines a type that indicates a `Partial` value, but with some exceptions.
 *
 * @example
 * type MyType = {
 *   val1: string,  // required
 *   val2: number,  // required
 *   val3: boolean  // required
 * }
 *
 * Partial<MyType> = {
 *   val1?: string,  // optional
 *   val2?: number,  // optional
 *   val3?: noolean, // optional
 * }
 *
 * AtLeast<MyType, 'val1' | 'val2'> = {
 *   val1: string,  // required
 *   val2: number,  // required
 *   val3?: boolean // optional
 * }
 */
type AtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;

export type NonObjectPrimitive = string | number | null | boolean;

export type RowObject = {
  _data: { [key: string]: NonObjectPrimitive };
  _name: string;
  _key: string;
  _parentKey: string | '';
  _type: 'root' | 'leaf' | '';
  _childKeys: string[];
  _children: RowObject[];
};

export class XLSXTransform {
  workbook: xlsx.WorkBook;
  schemaParser: SchemaParser;

  constructor(workbook: xlsx.WorkBook, schema: TransformSchema) {
    this.workbook = workbook;
    this.schemaParser = new SchemaParser(schema);
  }

  /**
   * Run the transformation process.
   *
   * @memberof XLSXTransform
   */
  start() {
    // Prepare the raw data, by adding keys and other dwcMeta to the raw row objects
    const preparedRowObjects = this.prepareRowObjects();
    fs.writeFileSync(path.join(__dirname, 'output', '1.json'), JSON.stringify(preparedRowObjects, null, 2));

    // Recurse through the data, and create a hierarchical structure for each logical record
    const hierarchicalRowObjects = this.buildRowObjectsHierarchy(preparedRowObjects);
    fs.writeFileSync(path.join(__dirname, 'output', '2.json'), JSON.stringify(hierarchicalRowObjects, null, 2));

    // Iterate over the hierarchical row objects, flattening and mapping each one
    const processedHierarchicalRowObjects = this.processHierarchicalRowObjects(hierarchicalRowObjects);
    fs.writeFileSync(path.join(__dirname, 'output', '3.json'), JSON.stringify(processedHierarchicalRowObjects, null, 2));

    // Iterate over the mapped records, group them by dwc sheet name, and remove duplicate records per sheet
    const preparedRowObjectsForJSONToSheet = this.prepareRowObjectsForJSONToSheet(processedHierarchicalRowObjects);
    fs.writeFileSync(path.join(__dirname, 'output', '4.json'), JSON.stringify(preparedRowObjectsForJSONToSheet, null, 2));

    // Process the final objects into the format required to convert them into CSV format
    Object.entries(preparedRowObjectsForJSONToSheet).map(([key, value]) => {
      const worksheet = xlsx.utils.json_to_sheet(value);

      const newWorkbook = xlsx.utils.book_new();

      xlsx.utils.book_append_sheet(newWorkbook, worksheet, 'Sheet1');

      const buffer = xlsx.write(newWorkbook, { type: 'buffer', bookType: 'csv' });

      fs.writeFileSync(path.join(__dirname, 'output', `${key}.json`), buffer);
    });
  }

  /**
   * Modifies the raw row objects returned by xlsx, and adds identifiers used in later steps (keys, etc)
   *
   * @return {*}
   * @memberof XLSXTransform
   */
  prepareRowObjects() {
    const output: Record<string, RowObject[]> = {};

    this.workbook.SheetNames.forEach((sheetName) => {
      const templateSchema = this.schemaParser.getSheetConfigForSheetName(sheetName);

      if (!templateSchema) {
        // Skip worksheet as no transform schema was provided
        return;
      }

      const worksheet = getWorksheetByName(this.workbook, sheetName);

      // trim all whitespace on string values
      trimWorksheetCells(worksheet);

      const range = getWorksheetRange(worksheet);

      if (!range) {
        throw Error('Worksheet range is undefined');
      }

      const worksheetJSON = xlsx.utils.sheet_to_json<Record<string, any>>(worksheet, {
        blankrows: false,
        raw: true,
        rawNumbers: false
      });

      const numberOfRows = range['e']['r'];

      const preparedRowObjects = this._prepareRowObjects(worksheetJSON, templateSchema, numberOfRows);

      output[sheetName] = preparedRowObjects;
    });

    return output;
  }

  _prepareRowObjects(
    worksheetJSON: Record<string, any>[],
    templateSchema: TemplateSchema,
    length: number
  ): RowObject[] {
    const worksheetJSONWithKey: RowObject[] = [];

    for (let i = 0; i < length; i++) {
      const primaryKey = this._getKeyForRowObject(worksheetJSON[i], templateSchema.primaryKey);

      if (!primaryKey) {
        continue;
      }

      const parentKey = this._getKeyForRowObject(worksheetJSON[i], templateSchema.parentKey);

      const childKeys = templateSchema.foreignKeys
        .map((foreignKeys: { name: string; primaryKey: string[] }) => {
          return this._getKeyForRowObject(worksheetJSON[i], foreignKeys.primaryKey);
        })
        .filter((item): item is string => !!item);

      worksheetJSONWithKey.push({
        _data: { ...worksheetJSON[i] },
        _name: templateSchema.name,
        _key: primaryKey,
        _parentKey: parentKey,
        _type: templateSchema.type,
        _childKeys: childKeys || [],
        _children: []
      });
    }

    return worksheetJSONWithKey;
  }

  _getKeyForRowObject(RowObject: Record<string, any>, keyColumnNames: string[]): string {
    if (!keyColumnNames.length) {
      return '';
    }

    if (!RowObject || Object.getPrototypeOf(RowObject) !== Object.prototype || Object.keys(RowObject).length === 0) {
      return '';
    }

    const primaryKey: string = keyColumnNames
      .map((columnName: string) => {
        return RowObject[columnName];
      })
      .join(':');

    return primaryKey;
  }

  buildRowObjectsHierarchy(preparedRowObjects: Record<string, RowObject[]>) {
    const hierarchicalRowObjects: { _children: RowObject[] } = { _children: [] };

    for (let queueIndex = 0; queueIndex < this.schemaParser.transformQueue.length; queueIndex++) {
      const transformQueueItem = this.schemaParser.transformQueue[queueIndex];

      const sheetName = transformQueueItem.name;

      const rowObjects = preparedRowObjects[sheetName];

      const distanceToRoot = transformQueueItem.distanceToRoot;

      if (distanceToRoot === 0) {
        // These are root row objects, and can be added to the `hierarchicalRowObjects` array directly as they have no
        // parent to be nested under
        hierarchicalRowObjects._children = rowObjects;

        continue;
      }

      // Add non-root row objects
      for (let rowIndex = 0; rowIndex < rowObjects.length; rowIndex++) {
        const rowObjectsItem = rowObjects[rowIndex];

        const pathsToPatch: string[] = JSONPath({
          json: hierarchicalRowObjects,
          path: `$${'._children[*]'.repeat(distanceToRoot - 1)}._children[?(@._childKeys.indexOf("${
            rowObjectsItem._parentKey
          }") != -1)]`,
          resultType: 'pointer'
        });

        if (pathsToPatch.length === 0) {
          // Found no parent row object, even though this row object is a non-root row object
          // This could indicate a possible error in the transform schema or the raw data
          continue;
        }

        const patchOperations: Operation[] = pathsToPatch.map((pathToPatch) => {
          return { op: 'add', path: `${pathToPatch}/_children/`, value: rowObjectsItem };
        });

        jsonpatch.applyPatch(hierarchicalRowObjects, patchOperations);
      }
    }

    return hierarchicalRowObjects;
  }

  processHierarchicalRowObjects(hierarchicalRowObjects: { _children: RowObject[] }) {
    const mapRowObjects: Record<string, Record<string, string>[]>[] = [];

    // for each hierarchicalRowObjects
    for (let rowIndex = 0; rowIndex < hierarchicalRowObjects._children.length; rowIndex++) {
      const hierarchicalRowObject = hierarchicalRowObjects._children[rowIndex];

      const flattenedRowObjects = this._flattenHierarchicalRowObject(hierarchicalRowObject);

      for (let flatIndex = 0; flatIndex < flattenedRowObjects.length; flatIndex++) {
        const flattenedRowObject = flattenedRowObjects[flatIndex] as RowObject[];

        const result = this._mapFlattenedRowObject(flattenedRowObject);

        mapRowObjects.push(result);
      }
    }

    return mapRowObjects;
  }

  _flattenHierarchicalRowObject(hierarchicalRowObject: RowObject) {
    const flattenedRowObjects: AtLeast<RowObject, '_children'>[][] = [
      // Wrap the root element in `_children` so that the looping logic doesn't have to distinguish between the root
      // element and subsequent children elements, it can just always grab the `_children`, of which the first one
      // just so happens to only contain the root element.
      [{ _children: [{ ...hierarchicalRowObject }] }]
    ];

    const prepGetCombinations = (source: AtLeast<RowObject, '_children'>[]): Record<string, RowObject[]> => {
      const prepGetCombinations: Record<string, RowObject[]> = {};

      for (let sourceIndex = 0; sourceIndex < source.length; sourceIndex++) {
        if (source[sourceIndex]._type === 'leaf') {
          // This node is marked as a leaf, so do not descend into its children.
          continue;
        }

        const children = source[sourceIndex]._children;

        for (let childrenIndex = 0; childrenIndex < children.length; childrenIndex++) {
          const child = children[childrenIndex];

          if (!prepGetCombinations[child._name]) {
            prepGetCombinations[child._name] = [];
          }

          prepGetCombinations[child._name].push(child);
        }
      }

      return prepGetCombinations;
    };

    const loop = (flatIndex: number, source: AtLeast<RowObject, '_children'>[]) => {
      // Grab all of the children of the current `source` and build an object in the format needed by the `getCombinations`
      // function.
      const preppedForgetCombinations = prepGetCombinations(source);

      // Loop over the prepped records, and build an array of objects which contain all of the possible combinations
      // of the records. See function for more details.
      const getCombinationsd = getCombinations(preppedForgetCombinations);

      if (getCombinationsd.length === 0) {
        // No getCombinationsd elements, which means there were no children to process, indicating we've reached the end of
        // the tree
        return;
      }

      if (getCombinationsd.length > 1) {
        // This for loop is intentionally looping backwards, and stopping 1 element short of the 0'th element.
        // This is because we only want to process the additional elements, pushing them onto the array, and leaving
        // the code further below to handle the 0'th element, which will be set at the current `flatIndex`
        for (let getCombinationsIndex = getCombinationsd.length - 1; getCombinationsIndex > 0; getCombinationsIndex--) {
          let newSource: AtLeast<RowObject, '_children'>[] = [];
          for (let sourceIndex = 0; sourceIndex < source.length; sourceIndex++) {
            if (Object.keys(source[sourceIndex]).length <= 1) {
              continue;
            }
            newSource.push({ ...source[sourceIndex], _children: [] });
          }
          newSource = newSource.concat(Object.values(getCombinationsd[getCombinationsIndex]));
          flattenedRowObjects.push(newSource);
        }
      }

      // Handle the 0'th element of `getCombinationsd`, setting the `newSource` at whatever the current `flatIndex` is
      let newSource: AtLeast<RowObject, '_children'>[] = [];
      for (let sourceIndex = 0; sourceIndex < source.length; sourceIndex++) {
        if (Object.keys(source[sourceIndex]).length <= 1) {
          continue;
        }
        newSource.push({ ...source[sourceIndex], _children: [] });
      }
      newSource = newSource.concat(Object.values(getCombinationsd[0]));
      flattenedRowObjects[flatIndex] = newSource;

      // Recurse into the newSource
      loop(flatIndex, newSource);
    };

    // For each element in `flattenedRowObjects`, recursively descend through its children, flattening them as we
    // go. If 2 children are of the same type, then push a copy of the current `flattenedRowObjects` element onto
    // the `flattenedRowObjects` array, which will be processed on the next iteration of the for loop.
    for (let index = 0; index < flattenedRowObjects.length; index++) {
      loop(index, flattenedRowObjects[index]);
    }

    return flattenedRowObjects;
  }

  _mapFlattenedRowObject(flattenedRow: RowObject[]) {
    const output: Record<string, Record<string, string>[]> = {};

    const indexBySheetName: Record<string, number> = {};

    const mapSchema = [...this.schemaParser.rawSchema.map];

    // For each sheet
    for (let mapIndex = 0; mapIndex < mapSchema.length; mapIndex++) {
      const sheetConditions = mapSchema[mapIndex].condition;

      // Check conditions, if any
      if (sheetConditions && sheetConditions.length) {
        let conditionsMet = true;

        for (let conditionsIndex = 0; conditionsIndex < sheetConditions.length; conditionsIndex++) {
          const condition = sheetConditions[conditionsIndex];

          const ifPathValues = this._processPaths([condition.if], flattenedRow);

          if (!ifPathValues || !ifPathValues.length) {
            // condition check failed, skip
            conditionsMet = false;
            break;
          }
        }

        if (!conditionsMet) {
          continue;
        }
      }

      const sheetName = mapSchema[mapIndex].name;

      if (!output[sheetName]) {
        output[sheetName] = [];
        indexBySheetName[sheetName] = 0;
      } else {
        indexBySheetName[sheetName] = indexBySheetName[sheetName] + 1;
      }

      const fields = mapSchema[mapIndex].fields;

      // For each field in the sheet
      for (let fieldIndex = 0; fieldIndex < fields.length; fieldIndex++) {
        let cellValue = '';

        const columnName = fields[fieldIndex].columnName;
        const columnValue = fields[fieldIndex].columnValue;

        // For each possible column value of the field
        for (let columnValueIndex = 0; columnValueIndex < columnValue.length; columnValueIndex++) {
          const columnValueItem = columnValue[columnValueIndex];

          // Check for conditions
          const columnValueItemCondition = columnValueItem.condition;
          if (columnValueItemCondition && columnValueItemCondition.length) {
            let conditionsMet = true;

            for (let conditionsIndex = 0; conditionsIndex < columnValueItemCondition.length; conditionsIndex++) {
              const condition = columnValueItemCondition[conditionsIndex];

              const ifPathValues = this._processPaths([condition.if], flattenedRow);

              if (!ifPathValues || !ifPathValues.length) {
                // condition check failed, skip
                conditionsMet = false;
                break;
              }
            }

            if (!conditionsMet) {
              continue;
            }
          }

          // Check for static value
          const columnValueItemValue = columnValueItem.value;
          if (columnValueItemValue) {
            // cell value is a static value
            cellValue = columnValueItemValue;
          }

          // Check for path value(s)
          const columnValueItemPaths = columnValueItem.paths;
          if (columnValueItemPaths) {
            const pathValues = this._processPaths(columnValueItemPaths, flattenedRow);

            let pathValue = '';
            if (Array.isArray(pathValues)) {
              // cell value is the concatenation of multiple values
              pathValue = pathValues.join(columnValueItem.join || ':') || '';
            } else {
              // cell value is a single value
              pathValue = pathValues || '';
            }

            // Add the postfix
            if (pathValue && columnValueItem.postfix) {
              pathValue = `${pathValue}${columnValueItem.join || ':'}${columnValueItem.postfix}`;
            }

            cellValue = pathValue;
          }

          // Check for additions at the field level
          const columnValueItemAdd = columnValueItem.add;
          if (columnValueItemAdd && columnValueItemAdd.length) {
            for (let addIndex = 0; addIndex < columnValueItemAdd.length; addIndex++) {
              mapSchema.push(columnValueItemAdd[addIndex]);
            }
          }
        }

        // add the cell key value
        output[sheetName][indexBySheetName[sheetName]] = {
          ...output[sheetName][indexBySheetName[sheetName]],
          [columnName]: cellValue
        };
      }

      // Check for additions at the sheet level
      const sheetAdds = mapSchema[mapIndex].add;
      if (sheetAdds && sheetAdds.length) {
        for (let addIndex = 0; addIndex < sheetAdds.length; addIndex++) {
          mapSchema.push(sheetAdds[addIndex]);
        }
      }
    }

    return output;
  }

  _processPaths(paths: string[], json: JSONPathOptions['json']): string | string[] {
    if (paths.length === 0) {
      return '';
    }

    if (paths.length === 1) {
      return JSONPath({ path: paths[0], json: json });
    }

    for (let pathsIndex = 0; pathsIndex < paths.length; pathsIndex++) {
      const value = JSONPath({ path: paths[pathsIndex], json: json });

      if (value) {
        // Return the first value that is not null or empty
        return value;
      }
    }

    return '';
  }

  prepareRowObjectsForJSONToSheet(mapRowObjects: Record<string, Record<string, string>[]>[]) {
    const groupedByDWCSheetName: Record<string, Record<string, string>[]> = {};
    const uniqueGroupedByDWCSheetName: Record<string, Record<string, string>[]> = {};

    const dwcSheetNames = this.schemaParser.getDWCSheetNames();

    dwcSheetNames.forEach((sheetName) => {
      groupedByDWCSheetName[sheetName] = [];
      uniqueGroupedByDWCSheetName[sheetName] = [];
    });

    mapRowObjects.map((item) => {
      const entries = Object.entries(item);

      for (const [key, value] of entries) {
        groupedByDWCSheetName[key] = groupedByDWCSheetName[key].concat(value);
      }
    });

    Object.entries(groupedByDWCSheetName).forEach(([key, value]) => {
      const keys = this.schemaParser.getDWCSheetKeyBySheetName(key);
      uniqueGroupedByDWCSheetName[key] = filterDuplicateKeys(value, keys) as any;
    });

    return uniqueGroupedByDWCSheetName;
  }
}

/**
 * Iterates over an object and returns an array of all unique combinations of values.
 *
 * @example
 * const obj = {
 *   'type1': [1, 2]
 *   'type2': [A, B]
 * }
 *
 * const result = getCombinations(obj);
 *
 * // result = [
 * //   [ 1,A ],
 * //   [ 1,B ],
 * //   [ 2,A ],
 * //   [ 2,B ]
 * // ]
 *
 * @example
 * const obj = {
 *   'type1': [1, 2]
 *   'type2': [A]
 * }
 *
 * const result = getCombinations(obj);
 *
 * // result = [
 * //   [ 1,A ],
 * //   [ 2,A ],
 * // ]
 *
 * @param {Record<string | number, any[]>>} obj
 * @returns An array of all combinations of the incoming `obj` values.
 */
export function getCombinations<O extends Record<string | number, any[]>>(obj: O) {
  let combos: { [k in keyof O]: O[k][number] }[] = [];
  for (const key in obj) {
    const values = obj[key];
    const all: typeof combos = [];
    for (let i = 0; i < values.length; i++) {
      for (let j = 0; j < (combos.length || 1); j++) {
        const newCombo = { ...combos[j], [key]: values[i] };
        all.push(newCombo);
      }
    }
    combos = all;
  }
  return combos;
}

/**
 * Filters objects from an array based on the keys provided.
 *
 * @example
 * const arrayOfObjects = [
 *   {key: 1, name: 1, value: 1},
 *   {key: 1, name: 2, value: 2},
 *   {key: 1, name: 2, value: 3},
 *   {key: 2, name: 3, value: 4}
 * ]
 *
 * const result = filterDuplicateKeys(arrayOfObjects, ['key']);
 *
 * // result = [
 * //   {key: 1, name: 2, value: 3},
 * //   {key: 2, name: 3, value: 4}
 * // ]
 *
 * const result = filterDuplicateKeys(arrayOfObjects, ['key', 'name']);
 *
 * // result = [
 * //   {key: 1, name: 1, value: 1},
 * //   {key: 1, name: 2, value: 3},
 * //   {key: 2, name: 3, value: 4}
 * // ]
 *
 * @param {Record<string, any>[]} arrayOfObjects
 * @param {string[]} keys
 * @return {*}  {object[]}
 * @memberof XLSXTransform
 */
export function filterDuplicateKeys(arrayOfObjects: Record<string, any>[], keys: string[]): object[] {
  const keyValues: [string, any][] = arrayOfObjects.map((value) => {
    const key = keys.map((k) => value[k]).join('|');
    return [key, value];
  });

  const kvMap = new Map(keyValues);

  return [...kvMap.values()];
}
