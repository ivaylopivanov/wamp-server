import {
  isValidRealm,
  makeID,
} from '../../src/util';
import { expect } from 'chai';

describe('util makeID', () => {
  it('Should get ID', () => {
    let id = makeID();
    expect(id).to.be.a('number');
  });
  it('Should have length of 15 or 16', () => {
    let id = makeID();
    expect(String(id)).to.have.length.within(10, 16);
  });
});

describe('util isValidRealm', () => {
  it('Should return true for "com.example.inge" ', () => {
    expect(isValidRealm('com.example.inge')).to.be.true;
  });
  it('Should return true for "com.example.inge123" ', () => {
    expect(isValidRealm('com.example.inge123')).to.be.true;
  });
  it('Should return false for "com.example. inge" ', () => {
    expect(isValidRealm('com.example. ing')).to.be.false;
  });
  it('Should return false for "com.#example.inge" ', () => {
    expect(isValidRealm('com.#example.inge')).to.be.false;
  });
  it('Should return false for "wamp.example.inge" ', () => {
    expect(isValidRealm('wamp.example.inge')).to.be.false;
  });
  it('Should return false for " " ', () => {
    expect(isValidRealm(' ')).to.be.false;
  });
});
