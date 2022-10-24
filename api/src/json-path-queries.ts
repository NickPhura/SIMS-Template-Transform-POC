/**
 * Get a json path query string that fetches a single value within an element where `_name=<sheetName>`.
 *
 * @param {string} sheetName
 * @param {string} key
 */
export const getValueByName = (sheetName: string, key: string) => getMultipleValuesByName(sheetName, [key]);

/**
 * Get a json path query string that fetches one or more values within an element where `_name=<sheetName>`.
 *
 * @param {string} sheetName
 * @param {string[]} keys
 */
export const getMultipleValuesByName = (sheetName: string, keys: string[]) =>
  `$..[?(@._name === '${sheetName}')]..['${keys.join(',')}']`;


export const createValueField = (dwcName: string, defaultValue: string) => {
  return {
    columnName: dwcName,
    columnValue: [
      {
        value: defaultValue
      }
    ]
  }
}
  
export const createPathField = (dwcName: string, sheet: string, sheetColumns: string[]) => {
  return {
    columnName: dwcName,
    columnValue: [
      {
        paths: sheetColumns.map(item => getValueByName(sheet, item))
      }
    ]
  }
}
