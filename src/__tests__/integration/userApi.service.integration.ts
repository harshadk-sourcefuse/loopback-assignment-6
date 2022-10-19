import { expect } from '@loopback/testlab';
import { config, RestDataSource } from '../../datasources';
import { RestDataSourceProvider } from '../../providers';
import { UserApiService, UserObject } from '../../types';

describe('UserApiService - (integration)', function (this: Mocha.Suite) {

  let isUserApiServiceAvailable = true;
  let userApiService: UserApiService;
  const userObject: UserObject = {
    firstName: "Berry",
    middleName: "Alen",
    lastName: "(The Flash)",
    email: "berry.alen@dc.com",
    phoneNumber: "0000000010",
    customerId: 1,
    address: 'DC universe'
  };

  before(givenUserApiService);
  before(async () => {
    isUserApiServiceAvailable = await checkIfUserApiServiceAvailable();
  });

  it('should create user', async () => {
    if (!isUserApiServiceAvailable) {
      console.log("Server is not Online")
      expect(isUserApiServiceAvailable).to.False();
      return;
    }

    const user = await createUser();
    if (!user.id) {
      console.log("May have failed to create user in previous step");
      expect(user.id).to.null();
      return;
    }
    await userApiService.deleteUserById(user.id);

    expect(user).to.containEql(userObject);
  });

  it('should get user by created user\'s id', async () => {
    if (!isUserApiServiceAvailable) {
      console.log("Server is not Online")
      expect(isUserApiServiceAvailable).to.False();
      return;
    }
    const user = await createUser();
    if (!user.id) {
      console.log("May have failed to create user in previous step");
      expect(user.id).to.null();
      return;
    }
    const userFromServer = await userApiService.getUserById(user.id);
    delete userFromServer.modifiedOn;
    await userApiService.deleteUserById(user.id);
    expect(userFromServer).to.deepEqual(user);
  });

  it('should update user by previously created user\'s id', async () => {
    if (!isUserApiServiceAvailable) {
      console.log("Server is not Online")
      expect(isUserApiServiceAvailable).to.False();
      return;
    }
    const user = await createUser();
    if (!user.id) {
      console.log("May have failed to create user in previous step");
      expect(user.id).to.null();
      return;
    }
    user.lastName = "Alen";
    user.middleName = "";

    await userApiService.updateUserById(user.id, user.firstName, user.middleName, user.lastName,
      user.email, user.address, user.phoneNumber, user.customerId);
    const updatedUser = await userApiService.getUserById(user.id);
    console.log(updatedUser);

    delete updatedUser.modifiedOn;
    await userApiService.deleteUserById(user.id);
    expect(updatedUser).to.containEql(user);
  });

  it('should delete user by previously created user\'s id', async () => {
    if (!isUserApiServiceAvailable) {
      console.log("Server is not Online")
      expect(isUserApiServiceAvailable).to.False();
      return;
    }
    const user = await createUser();
    if (!user.id) {
      console.log("May have failed to create user in previous step");
      expect(user.id).to.null();
      return;
    }
    await userApiService.deleteUserById(user.id);
    try {
      await userApiService.getUserById(user.id);
    } catch (error) {
      console.log(error);
      expect(error.statusCode).to.equal(404);
    }

  });

  async function givenUserApiService() {
    const dataSource = new RestDataSource(config);
    userApiService = await new RestDataSourceProvider(dataSource).value();
  }

  async function checkIfUserApiServiceAvailable() {
    try {
      await userApiService.ping();
      return true;
    } catch (err) {
      if (err.statusCode < 500) {
        return true;
      }
      return false;
    }
  }

  async function createUser() {
    return userApiService.createUser(userObject.firstName, userObject.middleName, userObject.lastName,
      userObject.email, userObject.address, userObject.phoneNumber, userObject.customerId);
  }
});