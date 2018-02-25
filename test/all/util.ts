import { expect } from 'chai';
import {
  isValidRealm,
  makeID,
} from '../../src/util';

describe('util makeID', () => {
  it('Should get ID', () => {
    const id = makeID();
    expect(id).to.be.a('number');
  });
  it('Should have length of 15 or 16', () => {
    const id = makeID();
    expect(String(id)).to.have.length.within(10, 16);
  });
});

describe('util isValidRealm', () => {
  it('Should return true for "com.example.inge" ', () => {
    // tslint:disable-next-line:no-unused-expression
    expect(isValidRealm('com.example.inge')).to.be.true;
  });
  it('Should return true for "com.example.inge123" ', () => {
    // tslint:disable-next-line:no-unused-expression
    expect(isValidRealm('com.example.inge123')).to.be.true;
  });
  it('Should return false for "com.example. inge" ', () => {
    // tslint:disable-next-line:no-unused-expression
    expect(isValidRealm('com.example. ing')).to.be.false;
  });
  it('Should return false for "com.#example.inge" ', () => {
    // tslint:disable-next-line:no-unused-expression
    expect(isValidRealm('com.#example.inge')).to.be.false;
  });
  it('Should return false for "wamp.example.inge" ', () => {
    // tslint:disable-next-line:no-unused-expression
    expect(isValidRealm('wamp.example.inge')).to.be.false;
  });
  it('Should return false for " " ', () => {
    // tslint:disable-next-line:no-unused-expression
    expect(isValidRealm(' ')).to.be.false;
  });
});
