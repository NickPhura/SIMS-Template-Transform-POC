import { JSONPath } from 'jsonpath-plus';

export type SheetSchema = {
  /**
   * The name of the sheet.
   *
   * @type {string}
   */
  name: string;
  /**
   * An array of json path query strings.
   *
   * @type {string[]}
   */
  primaryKey: string[];
  parentKey: string[];
  type: 'root' | 'leaf' | '';
  foreignKeys: { name: string; primaryKey: string[] }[];
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
   * @type {string[]}
   */
  paths?: string[];
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
   * A static value to append to the end of the final `paths` value.
   *
   * Will be joined using the `join` value.
   *
   * @type {string}
   */
  postfix?: string;
  /**
   * An array of conditions that must be met to proceed processing the schema element.
   *
   * If multiple conditions are specified, all conditions must be met.
   *
   * @type {{ if: string }[]}
   */
  condition?: { if: string }[];
  /**
   * An array of additional Schemas to add to process. Used to create additional records.
   *
   * @type {MapSchema[]}
   */
  add?: MapSchema[];
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
  name: string;
  /**
   * An array of conditions that must be met to proceed processing the schema element.
   *
   * If multiple conditions are specified, all conditions must be met.
   *
   * @type {{ if: string }[]}
   */
  condition?: { if: string }[];
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

export type MetaSchema = {
  name: string;
  key: string[];
};

export type TransformSchema = {
  /**
   * Defines the structure of the template.
   *
   * The template, and the corresponding sheets definition, must correspond to a valid tree structure, with no loops.
   *
   * @type {SheetSchema[]}
   */
  sheets: SheetSchema[];
  /**
   * Defines the mapping from parsed raw template data to DarwinCore (DWC) sheets.
   *
   * @type {MapSchema[]}
   */
  map: MapSchema[];
  /**
   * Additional meta needed by various steps of the transformation.
   *
   * @type {MetaSchema[]}
   */
  meta: MetaSchema[];
};

class SchemaParser {
  rawSchema: TransformSchema;

  transformQueue: (SheetSchema & { distanceToRoot: number })[] = [];

  constructor(schemaJSON: TransformSchema) {
    this.rawSchema = schemaJSON;

    this.buildTransformQueue();
  }

  buildTransformQueue() {
    const rootSheetSchema = this.getRootSheetConfig();

    if (!rootSheetSchema) {
      throw Error('No root schema was defined');
    }

    this.transformQueue.push({ ...rootSheetSchema, distanceToRoot: 0 });

    const buildTransformQueue = (sheetNames: string[], distanceToRoot: number) => {
      let nextSheetNames: string[] = [];

      sheetNames.forEach((sheetName) => {
        const sheetSchema = this.getSheetConfigForSheetName(sheetName);

        if (!sheetSchema) {
          return;
        }

        this.transformQueue.push({ ...sheetSchema, distanceToRoot: distanceToRoot });

        nextSheetNames = nextSheetNames.concat(sheetSchema.foreignKeys.map((item) => item.name));
      });

      if (!nextSheetNames.length) {
        return;
      }

      buildTransformQueue(nextSheetNames, distanceToRoot + 1);
    };

    buildTransformQueue(
      rootSheetSchema.foreignKeys.map((item) => item.name),
      1
    );
  }

  getRootSheetConfig(): SheetSchema | undefined {
    return Object.values(this.rawSchema.sheets).find((sheet) => sheet.type === 'root');
  }

  getSheetConfigForSheetName(sheetName: string): SheetSchema | undefined {
    return Object.values(this.rawSchema.sheets).find((sheet) => sheet.name === sheetName);
  }

  getDWCSheetNames(): string[] {
    const names: string[] = JSONPath({ path: '$.[name]', json: this.rawSchema.map });

    return Array.from(new Set(names));
  }

  getDWCSheetKeyBySheetName(sheetName: string): string[] {
    const result = JSONPath({ path: `$..[?(@.name === '${sheetName}' )][key]`, json: this.rawSchema.meta });

    return result[0];
  }
}

export default SchemaParser;
