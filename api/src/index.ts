import * as fs from 'fs';
import path from 'path';
import xlsx from 'xlsx';
import { schema } from './schema/moose_srb_schema';
import { XLSXTransform } from './transform-utils';

const TEMPLATE_NAME = 'srb_template.xlsx';
const TEMPLATE_SCHEMA = schema;

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
