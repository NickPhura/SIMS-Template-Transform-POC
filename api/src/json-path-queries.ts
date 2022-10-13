export const getValueByName = (sheetName: string, key: string) => getMultipleValuesByName(sheetName, [key]);

export const getMultipleValuesByName = (sheetName: string, keys: string[]) =>
  `$..[?(@._name === '${sheetName}')]..['${keys.join(',')}']`;
