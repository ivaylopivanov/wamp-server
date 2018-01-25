import roles from '../../src/roles';
import { expect } from 'chai';

describe('roles', () => {
  it('Should match', () => {
    const ROLES = {
      roles: {
        broker: {},
        dealer: {},
      }
    };
    expect(ROLES).deep.equal(roles);
  });
});
