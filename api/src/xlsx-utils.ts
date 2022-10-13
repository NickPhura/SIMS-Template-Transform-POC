import xlsx from 'xlsx';

export function getWorksheetByName(workbook: xlsx.WorkBook, sheetName: string): xlsx.WorkSheet {
  return workbook.Sheets[sheetName];
}

export function getWorksheetRange(worksheet: xlsx.WorkSheet): xlsx.Range | undefined {
  const ref = worksheet['!ref'];

  if (!ref) {
    return undefined;
  }

  return xlsx.utils.decode_range(ref);
}
