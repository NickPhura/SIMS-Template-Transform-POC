export const getValueByName = (sheetName: string, key: string) => getMultipleValuesByName(sheetName, [key]);

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
