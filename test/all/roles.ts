import { expect } from 'chai';
import roles from '../../src/roles';

describe('roles', () => {
  it('Should match', () => {
    const ROLES = {
      roles: {
        broker: {},
        dealer: {},
      },
    };
    expect(ROLES).deep.equal(roles);
  });
});
