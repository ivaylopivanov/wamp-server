import { expect } from 'chai';
import { ProcedureInterface } from '../../src/interfaces';
import Procedures from '../../src/procedures';

describe('Procedures', () => {

  it('Should register realm', () => {
    const realm = 'test';
    expect(Procedures.registerRealm(realm)).to.be.a('undefined');
  });

  it('Should get true on canAdd for non existing procedure', () => {
    const realm = 'test';
    const uri = 'com.uri.non-test';
    // tslint:disable-next-line:no-unused-expression
    expect(Procedures.canAdd(realm, uri)).to.be.true;
  });

  it('Should add procedure', () => {
    const realm = 'test';
    const uri = 'com.uri.test';
    const sessionID = 999999999999998;
    const procedureID = 999999999999999;
    expect(Procedures.add(realm, uri, sessionID, procedureID))
      .to.be.a('undefined');
  });

  it('Should get by URI', () => {
    const realm = 'test';
    const uri = 'com.uri.test';
    const expected: ProcedureInterface = {
      procedureID: 999999999999999,
      sessionID: 999999999999998,
      uri,
    };
    expect(Procedures.get(realm, uri)).deep.equal(expected);
  });

  it('Should get undefined for a non existing URI', () => {
    const realm = 'test';
    const uri = 'com.uri.not-existing';
    expect(Procedures.get(realm, uri)).to.be.a('undefined');
  });

  it('Should get false on canAdd for an existing procedure', () => {
    const realm = 'test';
    const uri = 'com.uri.test';
    // tslint:disable-next-line:no-unused-expression
    expect(Procedures.canAdd(realm, uri)).to.be.false;
  });

  it('Should get by ID', () => {
    const realm = 'test';
    const id = 999999999999999;
    const expected: ProcedureInterface = {
      procedureID: id,
      sessionID: id - 1,
      uri: 'com.uri.test',
    };
    expect(Procedures.getByID(realm, id)).deep.equal(expected);
  });

  it('Should not fail when trying to get for non existing ID', () => {
    const realm = 'test';
    const id = 32131231231;
    expect(Procedures.getByID(realm, id)).to.be.a('undefined');
  });

  it('Should delete procedure', () => {
    const realm = 'test';
    const uri = 'com.uri.test';
    expect(Procedures.remove(realm, uri)).to.be.a('undefined');
        // tslint:disable-next-line:no-unused-expression
    expect(Procedures.canAdd(realm, uri)).to.be.true;
  });
});
