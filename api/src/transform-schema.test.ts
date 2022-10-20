import Ajv from 'ajv';
import { expect } from 'chai';
import { describe } from 'mocha';
import { transformationJSONSchema } from './transform-schema';

describe('transformationJSONSchema', () => {
  const ajv = new Ajv();

  it('is valid json schema', () => {
    expect(ajv.validateSchema(transformationJSONSchema)).to.be.true;
  });
});
