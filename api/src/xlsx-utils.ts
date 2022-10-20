import xlsx from 'xlsx';

/**
 * Get a worksheet by name.
 *
 * @export
 * @param {xlsx.WorkBook} workbook
 * @param {string} sheetName
 * @return {*}  {xlsx.WorkSheet}
 */
export function getWorksheetByName(workbook: xlsx.WorkBook, sheetName: string): xlsx.WorkSheet {
  return workbook.Sheets[sheetName];
}

/**
 * Get a worksheets decoded range object, or return undefined if the worksheet is missing range information.
 *
 * @export
 * @param {xlsx.WorkSheet} worksheet
 * @return {*}  {(xlsx.Range | undefined)}
 */
export function getWorksheetRange(worksheet: xlsx.WorkSheet): xlsx.Range | undefined {
  const ref = worksheet['!ref'];

  if (!ref) {
    return undefined;
  }

  return xlsx.utils.decode_range(ref);
}
