import { expect } from 'chai';
import Transactions from '../../src/transactions';

describe('Transaction', () => {

  it('Should add a transaction', () => {
    const id: number = 123456;
    const sessionID: number = 654321;

    expect(Transactions.add(id, sessionID)).to.be.a('undefined');
  });

  it('Should get a transaction', () => {
    const id: number = 123456;
    const sessionID: number = Transactions.get(id);

    expect(sessionID).equal(654321);
  });

  // tslint:disable-next-line:max-line-length
  it('Should get an undefined as a session id for non existing transaction', () => {
    const id: number = 99999999999999;
    const sessionID: number = Transactions.get(id);

    expect(sessionID).equal(undefined);
  });

  it('Should delete an existing transaction', () => {
    const id: number = 123456;

    expect(Transactions.delete(id)).equal(undefined);
    expect(Transactions.get(id)).equal(undefined);
  });

  it('Should not fail when trying to delete a non existing transaction', () => {
    const id: number = 0;

    expect(Transactions.delete(id)).equal(undefined);
    expect(Transactions.get(id)).equal(undefined);
  });

});
