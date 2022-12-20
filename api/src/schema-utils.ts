import jsonpatch, { Operation } from 'fast-json-patch';
import { JSONPath } from 'jsonpath-plus';

export type JSONPath = string;

export type TemplateSchema = {
  /**
   * The name of the sheet.
   *
   * @type {string}
   */
  sheetName: string;
  /**
   * An array of json path query strings.
   *
   * @type {string[]}
   */
  primaryKey: string[];
  parentKey: string[];
  type: 'root' | 'leaf' | '';
  foreignKeys: ForeignKeySchema[];
};

export type SchemaCondition = {
  type: 'and' | 'or';
  checks: IfNotEmptyCheck[];
};

export type IfNotEmptyCheck = {
  ifNotEmpty: JSONPath;
};

export type ForeignKeySchema = {
  sheetName: string;
  primaryKey: string[];
};

export type MapColumnValueSchema = {
  /**
   * An array of json path query strings.
   *
   * If multiple query strings are provided, they will be fetched in order, and the first one that returns a non-empty
   * value will be used.
   *
   * A single query string may return one value, or an array of values.
   *
   * If an array of values is returned, they will be joined using the specified `join` string.
   * If `join` string is not specified, a colon `:` will be used as the default `join` string.
   *
   * @type {JSONPath[]}
   */
  paths?: JSONPath[];
  /**
   * A static value to be used, in place of any `paths`.
   *
   * If `value` is set in addition to `paths`, the `paths` will be ignored.
   *
   * @type {string}
   */
  value?: string;
  /**
   * A string used to join multiple path values (if the `paths` query string returns multiple values that need joining).\
   *
   * Defaults to a colon `:` if not provided.
   *
   * @type {string}
   */
  join?: string;
  /**
   * A value to append to the end of the final `paths` value.
   *
   * Will be joined using the `join` value.
   *
   * @type {MapColumnValuePostfixSchema}
   */
  postfix?: MapColumnValuePostfixSchema;
  /**
   * A condition, which contains one or more checks that must be met in order to proceed processing the schema element.
   *
   * @type {SchemaCondition}
   */
  condition?: SchemaCondition;
  /**
   * An array of additional Schemas to add to process. Used to create additional records.
   *
   * @type {MapSchema[]}
   */
  add?: MapSchema[];
};

export type MapColumnValuePostfixSchema = {
  /**
   * An array of json path query strings.
   *
   * If multiple query strings are provided, they will be fetched in order, and the first one that returns a non-empty
   * value will be used.
   *
   * A single query string may return one value, or an array of values.
   *
   * @type {JSONPath[]}
   */
  paths?: JSONPath[];
  /**
   * A static value to append to the end of the final `paths` value.
   *
   * Note:
   * - `auto` - Will be replaced with a generated number at template preparation time. This number will be unique within
   *   the transformation schema, but not unique within the transformed data.
   * - `unique` - Will be replaced with a unique number at transformation time. This number will be unique within the
   *   transformed data.
   *
   * If `value` is set in addition to `paths`, the `paths` will be ignored.
   *
   * @type {(string | 'auto' | 'unique')}
   */
  value?: string | 'auto' | 'unique';
};

export type MapFieldSchema = {
  /**
   * The name of the column.
   *
   * @type {string}
   */
  columnName: string;
  /**
   * The schema that defines how the value of the column is produced.
   *
   * If multiple values are provided, the first one that passes all conditions (if any) and returns a non-empty path
   * result will be used. and the remaining values will be skipped.
   *
   * @type {MapColumnValueSchema[]}
   */
  columnValue: MapColumnValueSchema[];
};

export type MapSchema = {
  /**
   * The name of the sheet.
   *
   * @type {string}
   */
  sheetName: string;
  /**
   * A condition, which contains one or more checks that must be met in order to proceed processing the schema element.
   *
   * @type {SchemaCondition}
   */
  condition?: SchemaCondition;
  /**
   * An array of additional Schemas to add to process. Used to create additional records.
   *
   * @type {MapSchema[]}
   */
  add?: MapSchema[];
  /**
   * The schema tht defines all of the columns the be produced under this sheet.
   *
   * @type {MapFieldSchema[]}
   */
  fields: MapFieldSchema[];
};

export type DwcSchema = {
  sheetName: string;
  primaryKey: string[];
};

export type TransformSchema = {
  /**
   * Defines the structure of the template, and any other relevant meta.
   *
   * The template, and the corresponding templateMeta definition, must correspond to a valid tree structure, with no loops.
   *
   * @type {TemplateSchema[]}
   */
  templateMeta: TemplateSchema[];
  /**
   * Defines the mapping from parsed raw template data to DarwinCore (DWC) templateMeta.
   *
   * @type {MapSchema[]}
   */
  map: MapSchema[];
  /**
   * Defines dwc specific meta needed by various steps of the transformation.
   *
   * @type {DwcSchema[]}
   */
  dwcMeta: DwcSchema[];
};

export type PreparedTransformSchema = TransformSchema & {
  templateMeta: (TemplateSchema & { distanceToRoot: number })[];
};

/**
 * Provides helper functions for fetching data from a raw transform schema
 *
 * @class SchemaParser
 */
class SchemaParser {
  preparedTransformSchema: PreparedTransformSchema = {
    templateMeta: [],
    map: [],
    dwcMeta: []
  };

  constructor(transformSchema: TransformSchema) {
    this._processRawTransformSchema(transformSchema);
  }

  /**
   * Process the original transform schema, building a modified version that contains additional generated data used by
   * the transform process.
   *
   * @param {TransformSchema} transformSchema
   * @memberof SchemaParser
   */
  _processRawTransformSchema(transformSchema: TransformSchema) {
    // prepare the `templateMeta` portion of the original transform schema
    this.preparedTransformSchema.templateMeta = this._processTemplateMeta(transformSchema.templateMeta);
    // prepare the `map` portion of the original transform schema
    this.preparedTransformSchema.map = this._processMap(transformSchema.map);
    // // prepare the `dwcMeta` portion of the original transform schema
    this.preparedTransformSchema.dwcMeta = this._processDWCMeta(transformSchema.dwcMeta);
  }

  /**
   * Prepare the `templateMeta` portion of the transform schema.
   *
   * Recurse through the 'templateMeta' portion of the transform schema and build a modified version which has all items
   * arranged in processing order (example: the root element is at index=0 in the array, etc) and where each item
   * includes a new value `distanceToRoot` which indicates which tier of the tree that item is at (example: the root
   * element is at `distanceToRoot=0`, its direct children are at `distanceToRoot=1`, etc)
   *
   * Note: This step could in be removed if the order of the transform schema was assumed to be correct by default and
   * the `distanceToRoot` field was added to the type as a required field, and assumed to be set correctly.
   *
   * @param {TransformSchema['templateMeta']} templateMeta
   * @return {*}  {PreparedTransformSchema['templateMeta']}
   * @memberof SchemaParser
   */
  _processTemplateMeta(templateMeta: TransformSchema['templateMeta']): PreparedTransformSchema['templateMeta'] {
    const preparedTemplateMeta = [];

    const rootSheetSchema = Object.values(templateMeta).find((sheet) => sheet.type === 'root');

    if (!rootSheetSchema) {
      throw Error('No root template meta schema was defined');
    }

    preparedTemplateMeta.push({ ...rootSheetSchema, distanceToRoot: 0 });

    const loop = (sheetNames: string[], distanceToRoot: number) => {
      let nextSheetNames: string[] = [];

      sheetNames.forEach((sheetName) => {
        const sheetSchema = Object.values(templateMeta).find((sheet) => sheet.sheetName === sheetName);

        if (!sheetSchema) {
          return;
        }

        preparedTemplateMeta.push({ ...sheetSchema, distanceToRoot: distanceToRoot });

        nextSheetNames = nextSheetNames.concat(sheetSchema.foreignKeys.map((item) => item.sheetName));
      });

      if (!nextSheetNames.length) {
        return;
      }

      loop(nextSheetNames, distanceToRoot + 1);
    };

    loop(
      rootSheetSchema.foreignKeys.map((item) => item.sheetName),
      1
    );

    return preparedTemplateMeta;
  }

  /**
   * Prepare the `map` portion of the transform schema.
   *
   * @param {TransformSchema['map']} map
   * @return {*}  {PreparedTransformSchema['map']}
   * @memberof SchemaParser
   */
  _processMap(map: TransformSchema['map']): PreparedTransformSchema['map'] {
    const preparedMap = map;

    // Replace `postfix: 'auto'` with an incrementing number.
    let postfixAutoIncrement = 0;

    const pathsToPatch = JSONPath<string[]>({
      json: map,
      path: `$..postfix^[?(@.value === 'auto')]`,
      resultType: 'pointer'
    });

    const patchOperations: Operation[] = pathsToPatch.map((pathToPatch) => {
      return { op: 'replace', path: `${pathToPatch}/value`, value: String(postfixAutoIncrement++) };
    });

    jsonpatch.applyPatch(preparedMap, patchOperations);

    return preparedMap;
  }

  /**
   * Prepare the `dwcMeta` portion of the transform schema.
   *
   * @param {TransformSchema['dwcMeta']} dwcMeta
   * @return {*}  {PreparedTransformSchema['dwcMeta']}
   * @memberof SchemaParser
   */
  _processDWCMeta(dwcMeta: TransformSchema['dwcMeta']): PreparedTransformSchema['dwcMeta'] {
    return dwcMeta;
  }

  /**
   * Find and return the template element that has `sheetName=<sheetName>`
   *
   * @param {string} sheetName
   * @return {*}  {(TemplateSchema | undefined)}
   * @memberof SchemaParser
   */
  getSheetConfigForSheetName(sheetName: string): TemplateSchema | undefined {
    return Object.values(this.preparedTransformSchema.templateMeta).find((sheet) => sheet.sheetName === sheetName);
  }

  /**
   * Get a list of all unique DWC sheet names.
   *
   * @return {*}  {string[]}
   * @memberof SchemaParser
   */
  getDWCSheetNames(): string[] {
    const names = JSONPath<string[]>({ path: '$.[sheetName]', json: this.preparedTransformSchema.map });

    return Array.from(new Set(names));
  }

  /**
   * Find and return a DWC sheet key where `sheetName=<sheetName>`.
   *
   * @param {string} sheetName
   * @return {*}  {string[]}
   * @memberof SchemaParser
   */
  getDWCSheetKeyBySheetName(sheetName: string): string[] {
    const result = JSONPath<string[][]>({
      path: `$..[?(@.sheetName === '${sheetName}' )][primaryKey]`,
      json: this.preparedTransformSchema.dwcMeta
    });

    return result[0];
  }
}

export default SchemaParser;
