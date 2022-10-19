import { Filter, Where } from '@loopback/repository';
import { expect } from '@loopback/testlab';
import { UserController } from '../../controllers';
import { User } from '../../models';
import { UserRepository } from '../../repositories';
import { createDbFile, deleteDbFile, givenEmptyDatabase, givenUser, givenUserData, testdb } from '../database.helper';

describe('UserController - (integration)', () => {
    before(createDbFile);

    after(deleteDbFile);

    beforeEach(givenEmptyDatabase);

    describe('create()', () => {

        it('should create the user', async () => {
            const user = new User(givenUserData({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' }));
            const controller = new UserController(new UserRepository(testdb));
            const savedDetails = await controller.create(user);
            expect(savedDetails.id).not.null();
            expect(savedDetails).to.containEql(user);
        });

        it('should failed to create the user due to first name field is empty', async () => {
            const user = new User(givenUserData({ firstName: '', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' }));
            const controller = new UserController(new UserRepository(testdb));
            try {
                await controller.create(user);
            } catch (error) {
                expect(error.message).to.containEql("The `User` instance is not valid. Details: `firstName` can't be blank (value: \"\")");
                expect(error.statusCode).to.equal(422);
            }
        });

        it('should failed to create the user due to email field is empty', async () => {
            const user = new User(givenUserData({ firstName: 'Harshad', lastName: 'Kadam', email: '' }));
            const controller = new UserController(new UserRepository(testdb));
            try {
                await controller.create(user);
            } catch (error) {
                expect(error.message).to.containEql("The `User` instance is not valid. Details: `email` can't be blank (value: \"\")");
                expect(error.statusCode).to.equal(422);
            }
        });
    });

    describe('updateById()', () => {

        it('should update the user', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "Tony", lastName: "Stark", email: "tony.stark@avengers.com" }));
            const controller = new UserController(new UserRepository(testdb));
            await controller.updateById(user.id, userToUpdate);
            const updatedDetails = await controller.findById(user.id);
            expect(updatedDetails).to.containEql(userToUpdate);
        });

        it('should update the user, even if first name field is empty', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "", lastName: "Stark", email: "tony.stark@avengers.com" }));
            const controller = new UserController(new UserRepository(testdb));
            await controller.updateById(user.id, userToUpdate);
            const updatedDetails = await controller.findById(user.id);
            expect(updatedDetails).to.containEql(userToUpdate);
        });

        it('should update the user, even if email field is empty', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "Tony", lastName: "Stark", email: "" }));
            const controller = new UserController(new UserRepository(testdb));
            await controller.updateById(user.id, userToUpdate);
            const updatedDetails = await controller.findById(user.id);
            expect(updatedDetails).to.containEql(userToUpdate);
        });
    });

    describe('replaceById()', () => {

        it('should replace the user', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "Tony", lastName: "Stark", email: "tony.stark@avengers.com" }));
            const controller = new UserController(new UserRepository(testdb));
            await controller.replaceById(user.id, userToUpdate);
            const updatedDetails = await controller.findById(user.id);
            expect(updatedDetails).to.containEql(userToUpdate);
        });

        it('should failed to replace the user due to first name field is empty', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "", lastName: "Stark", email: "tony.stark@avengers.com" }));
            const controller = new UserController(new UserRepository(testdb));
            try {
                await controller.replaceById(user.id, userToUpdate);
            } catch (error) {
                expect(error.message).to.containEql("The `User` instance is not valid. Details: `firstName` can't be blank (value: \"\")");
                expect(error.statusCode).to.equal(422);
            }
        });

        it('should failed to replace the user due to email field is empty', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "Tony", lastName: "Stark", email: "" }));
            const controller = new UserController(new UserRepository(testdb));
            try {
                await controller.replaceById(user.id, userToUpdate);
            } catch (error) {
                expect(error.message).to.containEql("The `User` instance is not valid. Details: `email` can't be blank (value: \"\")");
                expect(error.statusCode).to.equal(422);
            }
        });
    });

    describe('findById()', () => {

        it('retrieves details of the user by id', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            const controller = new UserController(new UserRepository(testdb));
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const response = await controller.findById(user.id);
            expect(response).to.containEql(user);
        });

        it('fails to retrieves details of the user by id', async () => {
            const controller = new UserController(new UserRepository(testdb));
            try {
                await controller.findById(9999999);
            } catch (error) {
                expect(error).to.containEql({
                    code: 'ENTITY_NOT_FOUND',
                    entityName: 'User',
                    entityId: 9999999
                });
            }
        });

        it('shoudl to retrieves mentioedn details of the user by id', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });

            const filter: Filter<User> = { fields: { firstName: true } };
            const controller = new UserController(new UserRepository(testdb));
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userDetails = await controller.findById(user.id, filter);
            expect(userDetails).to.containDeep({ firstName: "Harshad" });

        });
    });

    describe('count()', () => {

        it('should get total count of users from test db - single user in DB', async () => {
            await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            const controller = new UserController(new UserRepository(testdb));
            const countObj = await controller.count();
            expect(countObj.count).to.equal(1);
        });

        it('should get total count of users from test db - multiple user in DB', async () => {
            await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@sourcefuse.com' });
            await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@sourcefuse.com' });
            const controller = new UserController(new UserRepository(testdb));
            const countObj = await controller.count();
            expect(countObj.count).to.equal(3);
        });


        it('should get total count of users from test db as per conditions', async () => {
            await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });
            const controller = new UserController(new UserRepository(testdb));
            const where: Where<User> = { or: [{ firstName: "Tony" }, { firstName: "Harshad" }] };
            const countObj = await controller.count(where);
            expect(countObj.count).to.equal(2);
        });

        it('should get total count of users as 0 from test db as user with name \'Ash\' is not exists', async () => {
            await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });
            const controller = new UserController(new UserRepository(testdb));
            const where: Where<User> = { firstName: "Ash" };
            const countObj = await controller.count(where);
            expect(countObj.count).to.equal(0);
        });
    });

    describe('deleteById()', () => {

        it('delete the user by id', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            const controller = new UserController(new UserRepository(testdb));
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            await controller.deleteById(user.id);
            try {
                await controller.findById(user.id);
            } catch (error) {
                expect(error).to.containEql({
                    code: 'ENTITY_NOT_FOUND',
                    entityName: 'User',
                    entityId: user.id
                });
            }
        });

        it('fails to delete details of the user by id', async () => {
            const controller = new UserController(new UserRepository(testdb));
            try {
                await controller.deleteById(9999999);
            } catch (error) {
                expect(error).to.containEql({
                    code: 'ENTITY_NOT_FOUND',
                    entityName: 'User',
                    entityId: 9999999
                });
            }
        });
    });

    describe('find()', () => {

        it('should get all users from test db', async () => {
            const user1 = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            const user2 = await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            const user3 = await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });
            const controller = new UserController(new UserRepository(testdb));
            const users = await controller.find();

            expect(users).to.containDeep([user1, user2, user3]);
        });


        it('should get all users from test db which matches the filter', async () => {
            const user1 = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            const user2 = await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });
            const controller = new UserController(new UserRepository(testdb));
            const filter: Filter<User> = { where: { or: [{ firstName: 'Harshad' }, { firstName: 'Captain' }] } };
            const users = await controller.find(filter);

            expect(users).to.containDeep([user1, user2]);
            expect(users).to.length(2);
        });

        it('should get all users in descending order of their first name from test db', async () => {
            const user1 = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            const user2 = await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            const user3 = await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });
            const controller = new UserController(new UserRepository(testdb));
            const filter: Filter<User> = { order: ['firstName DESC'] };
            const users = await controller.find(filter);

            expect(users).to.containDeep([user3, user1, user2]);
        });


        it('should get empty list of users since filter condition first name not matching with any user', async () => {
            await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });
            const controller = new UserController(new UserRepository(testdb));
            const filter: Filter<User> = { where: { firstName: 'Ash' } };
            const users = await controller.find(filter);

            expect(users).to.containDeep([]);
            expect(users).to.length(0);
        });

        it('shoudl to retrieves mentioedn details of the users', async () => {
            await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });

            const filter: Filter<User> = { fields: { firstName: true } };
            const controller = new UserController(new UserRepository(testdb));

            const userDetails = await controller.find(filter);
            expect(userDetails).to
                .containDeep([{ firstName: "Harshad" }, { firstName: "Captain" }, { firstName: "Tony" }]);
        });
    });
});