import Ajv from 'ajv';
import * as fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { schema } from './schema/moose_transect_schema';
import { transformationJSONSchema } from './transform-schema';
import { XLSXTransform } from './transform-utils';

const TEMPLATE_NAME = 'moose_transect.xlsx';
const TEMPLATE_SCHEMA = schema;

const ajv = new Ajv();

ajv.validate(transformationJSONSchema, schema);

if (ajv.errors) {
  throw new Error(JSON.stringify(ajv.errors, null, 2));
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
