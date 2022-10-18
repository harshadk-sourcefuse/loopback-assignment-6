import {User} from '../../models';
import {givenUserData} from '../database.helper';
import {expect} from '@loopback/testlab';

describe('User (unit)', () => {
  // we recommend to group tests by method names
  describe('getFullName()', () => {
    it('uses all three parts when present', () => {
      const user = givenUser({
        firstName: 'Tony',
        lastName: 'Stark',
        email: 'tony.stark@avenger.com',
      });

      const fullName = user.getFullName();
      expect(fullName).to.equal('Tony Stark');
    });

    it('omits lastname when not present', () => {
      const user = givenUser({
        firstName: 'Tony',
        lastName: '',
        email: 'tony.stark@avenger.com',
      });

      const fullName = user.getFullName();
      expect(fullName).to.equal('Tony');
    });
  });

  function givenUser(data: Partial<User>) {
    return new User(givenUserData(data));
  }
});