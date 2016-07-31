import { ProcedureInterface } from '../../src/interfaces';
import Procedures from '../../src/procedures';
import { expect } from 'chai';

describe('Procedures', () => {

  it('Should register realm', () => {
    let realm = 'test';
    expect(Procedures.registerRealm(realm)).to.be.undefined;
  });

  it('Should get true on canAdd for non existing procedure', () => {
    let realm = 'test';
    let uri = 'com.uri.non-test';
    expect(Procedures.canAdd(realm, uri)).to.be.true;
  });

  it('Should add procedure', () => {
    let realm = 'test';
    let uri = 'com.uri.test';
    let sessionID = 999999999999998;
    let procedureID = 999999999999999;
    expect(Procedures.add(realm, uri, sessionID, procedureID))
      .to.be.a('undefined');
  });

  it('Should get by URI', () => {
    let realm = 'test';
    let uri = 'com.uri.test';
    let expected: ProcedureInterface = {
      procedureID: 999999999999999,
      sessionID: 999999999999998,
      uri: uri
    };
    expect(Procedures.get(realm, uri)).deep.equal(expected);
  });

  it('Should get undefined for a non existing URI', () => {
    let realm = 'test';
    let uri = 'com.uri.not-existing';
    expect(Procedures.get(realm, uri)).to.be.undefined;
  });

  it('Should get false on canAdd for an existing procedure', () => {
    let realm = 'test';
    let uri = 'com.uri.test';
    expect(Procedures.canAdd(realm, uri)).to.be.false;
  });

  it('Should get by ID', () => {
    let realm = 'test';
    let id = 999999999999999;
    let expected: ProcedureInterface = {
      procedureID: id,
      sessionID: id - 1,
      uri: 'com.uri.test'
    };
    expect(Procedures.getByID(realm, id)).deep.equal(expected);
  });

  it('Should not fail when trying to get for non existing ID', () => {
    let realm = 'test';
    let id = 32131231231;
    expect(Procedures.getByID(realm, id)).to.be.undefined;
  });

  it('Should delete procedure', () => {
    let realm = 'test';
    let uri = 'com.uri.test';
    expect(Procedures.remove(realm, uri)).to.be.undefined;
    expect(Procedures.canAdd(realm, uri)).to.be.true;
  });
});
