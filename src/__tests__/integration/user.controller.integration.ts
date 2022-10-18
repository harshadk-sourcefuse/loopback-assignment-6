import { Filter } from '@loopback/repository';
import { expect } from '@loopback/testlab';
import { UserController } from '../../controllers';
import { User } from '../../models';
import { UserRepository } from '../../repositories';
import { createDbFile, deleteDbFile, givenEmptyDatabase, givenUser, givenUserData, testdb } from '../database.helper';

describe('UserController (integration)', () => {
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
                console.log(JSON.stringify(error));
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
                console.log(JSON.stringify(error));
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
            const savedDetails = await controller.updateById(user.id, userToUpdate);
            console.log("savedDetails", savedDetails);
            const updatedDetails = await controller.findById(user.id);
            expect(updatedDetails).to.containEql(userToUpdate);
        });

        it('should failed to update the user due to first name field is empty', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "", lastName: "Stark", email: "tony.stark@avengers.com" }));
            const controller = new UserController(new UserRepository(testdb));
            try {
                await controller.updateById(user.id, userToUpdate);
            } catch (error) {
                console.log(JSON.stringify(error));
                expect(error.message).to.containEql("The `User` instance is not valid. Details: `firstName` can't be blank (value: \"\")");
                expect(error.statusCode).to.equal(422);
            }
        });

        it('should failed to update the user due to email field is empty', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "Tony", lastName: "Stark", email: "" }));
            const controller = new UserController(new UserRepository(testdb));
            try {
                await controller.updateById(user.id, userToUpdate);
            } catch (error) {
                console.log(JSON.stringify(error));
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
                await controller.findById(100000);
            } catch (error) {
                console.log(error.message);
                expect(error).to.containEql({
                    code: 'ENTITY_NOT_FOUND',
                    entityName: 'User',
                    entityId: 100000
                });
            }
        });

        it('fails to retrieves details of the user by id and filter details - where firstName is equal to \'Tony\'', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });

            const filter: Filter<User> = { where: { firstName: "Tony" } };
            const controller = new UserController(new UserRepository(testdb));
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            try {
                await controller.findById(user.id, filter);
            } catch (error) {
                console.log(error.message);
                expect(error).to.containEql({
                    code: 'ENTITY_NOT_FOUND',
                    entityName: 'User',
                    entityId: 100000
                });
            }
        });
    });
});