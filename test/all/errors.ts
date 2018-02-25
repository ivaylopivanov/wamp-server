import { expect } from 'chai';
import errors from '../../src/errors';

describe('errors', () => {
  it('Should have 7 different types of errors', () => {
    expect(Object.keys(errors).length).equal(7);
  });
});
