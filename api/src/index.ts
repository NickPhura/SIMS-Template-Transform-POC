import Ajv from 'ajv';
import * as fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { schema } from './schema/moose_srb_schema';
import { transformationJSONSchema } from './transform-schema';
import { XLSXTransform } from './transform-utils';

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
const TEMPLATE_NAME = 'MU_432_ZoneA_SRB_v2.0.xlsx';
const TEMPLATE_SCHEMA = schema;

const ajv = new Ajv();

ajv.validate(transformationJSONSchema, TEMPLATE_SCHEMA);

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

xlsxTransform.start();

export {};
