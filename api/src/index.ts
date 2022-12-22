import Ajv from 'ajv';
import * as fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { mooseSRBSchema } from './schema/moose_srb_schema';
import { XLSXTransform } from './xlsx-transform';
import { transformationConfigJSONSchema } from './xlsx-transform-schema';

/*
  Transect
    - marked animals need to be added somehow

  NON SRB
    - Snow cover measurements need to be added
    - marked animals need to be added
  
  SRB
    - incidentals need to be added
    - marked animals need to be added
    - measurement and facts need to be added
*/
// const TEMPLATE_NAME = 'Moose_Aerial_StratifiedRandomBlock_Recruit_Comp_Survey_2.0.xlsx';
const TEMPLATE_NAME = 'MU_432_ZoneA_SRB_v2.0_Fixed.xlsx';
const TEMPLATE_SCHEMA = mooseSRBSchema;

fs.writeFileSync(path.join(__dirname, 'output', 'schema.json'), JSON.stringify(TEMPLATE_SCHEMA, null, 2));

const ajv = new Ajv();
ajv.validate(transformationConfigJSONSchema, TEMPLATE_SCHEMA);

if (ajv.errors) {
  throw new Error(JSON.stringify(ajv.errors));
}

const templateBuffer = fs.readFileSync(path.join(__dirname, 'input', TEMPLATE_NAME));

const mediaFile = {
  fileName: 'template.xlsx',
  mimeType: 'xlsx',
  buffer: templateBuffer
};

const workbook = xlsx.read(mediaFile.buffer, { cellFormula: false, cellHTML: false });

const xlsxTransform = new XLSXTransform(workbook, TEMPLATE_SCHEMA);

const preparedRowObjectsForJSONToSheet = xlsxTransform.start();

// Process the final objects into the format required to convert them into CSV format
const dwcWorkbook = xlsx.utils.book_new();
Object.entries(preparedRowObjectsForJSONToSheet).map(([key, value]) => {
  const worksheet = xlsx.utils.json_to_sheet(value);

  const newWorkbook = xlsx.utils.book_new();

  xlsx.utils.book_append_sheet(newWorkbook, worksheet, 'Sheet1');
  xlsx.utils.book_append_sheet(dwcWorkbook, worksheet, key);

  const buffer = xlsx.write(newWorkbook, { type: 'buffer', bookType: 'csv' });

  fs.writeFileSync(path.join(__dirname, 'output', `${key}.json`), buffer);
});

const buffer = xlsx.write(dwcWorkbook, { type: 'buffer', bookType: 'xlsx' });
fs.writeFileSync(path.join(__dirname, 'output', 'dwcWorkbook_fixed_with_mark_2.xlsx'), buffer);

export {};
