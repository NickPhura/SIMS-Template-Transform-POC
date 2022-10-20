import Ajv from 'ajv';
import { expect } from 'chai';
import { describe } from 'mocha';
import { schema } from './schema/moose_srb_schema';
import { transformationJSONSchema } from './transform-schema';

describe('transformationJSONSchema', () => {
  const ajv = new Ajv();

  it('is valid json schema', () => {
    expect(ajv.validateSchema(transformationJSONSchema)).to.be.true;
  });

  it('is valid moose schema', () => {
    expect(ajv.validate(transformationJSONSchema, schema), JSON.stringify(ajv.errors)).to.be.true;
  });
});
