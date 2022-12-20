import { MapFieldSchema } from './schema-utils';

/**
 * Get a json path query string that fetches one or more values within an element where `_name=<sheetName>`.
 *
 * @param {string} sheetName
 * @param {string[]} keys
 */
export const getValuesByName = (sheetName: string, keys: string[]) =>
  `$..[?(@._name === '${sheetName}')]..['${keys.join(',')}']`;

/**
 * Create a dwc map `MapFieldSchema` object from a static value.
 *
 * @param {string} dwcName
 * @param {string} defaultValue
 * @return {*}  {MapFieldSchema}
 */
export const createValueField = (dwcName: string, defaultValue: string): MapFieldSchema => {
  return {
    columnName: dwcName,
    columnValue: [
      {
        value: defaultValue
      }
    ]
  };
};

/**
 * Create a dwc map `MapFieldSchema` object from a single JSONPath.
 *
 * @param {string} dwcName
 * @param {string} sheet
 * @param {string[]} sheetColumns
 * @return {*}  {MapFieldSchema}
 */
export const createPathField = (dwcName: string, sheet: string, sheetColumns: string[]): MapFieldSchema => {
  return {
    columnName: dwcName,
    columnValue: [
      {
        paths: sheetColumns.map((item) => getValuesByName(sheet, [item]))
      }
    ]
  };
};
