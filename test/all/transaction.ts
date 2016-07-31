import Transactions from '../../src/transactions';
import { expect } from 'chai';

describe('Transaction', () => {

  it('Should add a transaction', () => {
    let id: number = 123456;
    let sessionID: number = 654321;

    expect(Transactions.add(id, sessionID)).to.be.a('undefined');
  });

  it('Should get a transaction', () => {
    let id: number = 123456;
    let sessionID: number = Transactions.get(id);

    expect(sessionID).equal(654321);
  });

  it('Should get an undefined as a session id for non existing transaction', () => {
    let id: number = 99999999999999;
    let sessionID: number = Transactions.get(id);

    expect(sessionID).equal(undefined);
  });

  it('Should delete an existing transaction', () => {
    let id: number = 123456;

    expect(Transactions.delete(id)).equal(undefined);
    expect(Transactions.get(id)).equal(undefined);
  });

  it('Should not fail when trying to delete a non existing transaction', () => {
    let id: number = 0;

    expect(Transactions.delete(id)).equal(undefined);
    expect(Transactions.get(id)).equal(undefined);
  });

});
