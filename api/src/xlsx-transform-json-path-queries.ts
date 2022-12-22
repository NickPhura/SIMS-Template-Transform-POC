import { JSONPath, MapFieldSchema } from './xlsx-transform-schema-parser';

/**
 * Get a json path query string that fetches one or more values within an element where `_name=<sheetName>`.
 *
 * @param {string} templateSheetName
 * @param {string[]} templateColumnNames
 */
export const getValuesByName = (templateSheetName: string, templateColumnNames: string[]): JSONPath =>
  `$..[?(@._name === '${templateSheetName}')]..['${templateColumnNames.join(',')}']`;

/**
 * Create a DWC map `MapFieldSchema` object from a static value.
 *
 * @param {string} dwcColumnName
 * @param {string} defaultValue
 * @return {*}  {MapFieldSchema}
 */
export const createValueField = (dwcColumnName: string, staticValue: string): MapFieldSchema => {
  return {
    columnName: dwcColumnName,
    columnValue: [
      {
        static: staticValue
      }
    ]
  };
};

/**
 * Create a DWC map `MapFieldSchema` object from a single JSONPath.
 *
 * @param {string} dwcColumnName
 * @param {string} templateSheetName
 * @param {string[]} templateSheetColumns
 * @return {*}  {MapFieldSchema}
 */
export const createPathField = (
  dwcColumnName: string,
  templateSheetName: string,
  templateSheetColumns: string[]
): MapFieldSchema => {
  return {
    columnName: dwcColumnName,
    columnValue: [
      {
        paths: templateSheetColumns.map((item) => getValuesByName(templateSheetName, [item]))
      }
    ]
  };
};
