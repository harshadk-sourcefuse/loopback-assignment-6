import { Client, expect } from '@loopback/testlab';
import { LoopbackAssignment6Application } from '../..';
import { User } from '../../models';
import { UserRepository } from '../../repositories';
import { createDbFile, deleteDbFile } from '../database.helper';
import { setupApplication } from './test-helper';

describe('UserController - (Acceptance)', () => {
    let app: LoopbackAssignment6Application;
    let client: Client;
    let userRepo: UserRepository;

    const urlPrefix = "/users";

    const countUrl = urlPrefix + '/count';
    const createUrl = urlPrefix;
    const updateUrl = urlPrefix + '/{id}';
    const getUrl = urlPrefix;
    const replaceUrl = urlPrefix + '/{id}';
    const getByIdUrl = urlPrefix + '/{id}';
    const deleteByIdUrl = urlPrefix + '/{id}';

    before('setupApplication', async () => {
        ({ app, client } = await setupApplication());
        userRepo = await app.getRepository(UserRepository);
        createDbFile();
    });
    after(async () => {
        deleteDbFile();
        await app.stop();
    });

    beforeEach(async () => {
        await userRepo.deleteAll();
    });

    describe('invoke GET ' + countUrl, () => {
        it('should get count of total users - single user', async () => {
            await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });

            const response = await client
                .get(countUrl)
                .expect(200);

            expect(response.body.count).to.equal(3);
        });

        it('should get count of total users - multiple user', async () => {
            await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });

            const response = await client
                .get(countUrl)
                .expect(200);

            expect(response.body.count).to.equal(1);
        });

        it('should get total count of users as per conditions', async () => {
            await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });

            const response = await client
                .get(countUrl)
                .query('where=' + encodeURIComponent('{ "or" : [{ "firstName" : "Tony" }, { "firstName" : "Harshad" }] }'))
                .expect(200);

            expect(response.body.count).to.equal(2);
        });

        it('should get total count of users as 0 as user with name \'Ash\' is not exists', async () => {
            await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });

            const response = await client
                .get(countUrl)
                .query('where=' + encodeURIComponent('{ "firstName" : "Ash" }'))
                .expect(200);

            expect(response.body.count).to.equal(0);
        });
    });

    describe('invoke POST ' + createUrl, () => {

        it('should create the user', async () => {
            const user = new User(givenUserData({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' }));

            const response = await client
                .post(createUrl)
                .send(user)
                .expect(200);

            expect(response.body.id).not.null();
            expect(response.body).to.containEql(user);
        });

        it('should failed to create the user due to first name field is empty', async () => {
            const user = new User(givenUserData({ firstName: '', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' }));

            const response = await client
                .post(createUrl)
                .send(user)
                .expect(422);

            expect(response.body.error.message).to.containEql("The `User` instance is not valid. Details: `firstName` can't be blank (value: \"\")");
        });

        it('should failed to create the user due to email field is empty', async () => {
            const user = new User(givenUserData({ firstName: '', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' }));

            const response = await client
                .post(createUrl)
                .send(user)
                .expect(422);

            expect(response.body.error.message).to.containEql("The `User` instance is not valid. Details: `firstName` can't be blank (value: \"\")");

        });
    });

    describe('invoke PATCH' + updateUrl, () => {

        it('should update the user', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "Tony", lastName: "Stark", email: "tony.stark@avengers.com" }));

            await client
                .patch(updateUrl.replace('{id}', user.id.toString()))
                .send(userToUpdate)
                .expect(204);
            const updatedUser = await client
                .get(getByIdUrl.replace('{id}', user.id.toString()))
                .expect(200);

            expect(updatedUser.body).to.containEql(userToUpdate);
        });

        it('should update the user, even if first name field is empty', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "", lastName: "Stark", email: "tony.stark@avengers.com" }));

            await client
                .patch(updateUrl.replace('{id}', user.id.toString()))
                .send(userToUpdate)
                .expect(204);
            const updatedUser = await client
                .get(getByIdUrl.replace('{id}', user.id.toString()))
                .expect(200);

            expect(updatedUser.body).to.containEql(userToUpdate);
        });

        it('should update the user, even if email field is empty', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "Tony", lastName: "Stark", email: "" }));

            await client
                .patch(updateUrl.replace('{id}', user.id.toString()))
                .send(userToUpdate)
                .expect(204);
            const updatedUser = await client
                .get(getByIdUrl.replace('{id}', user.id.toString()))
                .expect(200);

            expect(updatedUser.body).to.containEql(userToUpdate);
        });

        it('should failed to update details of the user by id, since user with id \' 9999999\' does not exists ', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "Tony", lastName: "Stark", email: "tony.stark@avengers.com" }));

            await client
                .patch(getByIdUrl.replace('{id}', ' 9999999'))
                .send(userToUpdate)
                .expect(404);
        });
    });

    describe('invoke PUT ' + replaceUrl, () => {

        it('should replacce the user', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "Tony", lastName: "Stark", email: "tony.stark@avengers.com" }));

            await client
                .put(replaceUrl.replace('{id}', user.id.toString()))
                .send(userToUpdate)
                .expect(204);
            const updatedUser = await client
                .get(getByIdUrl.replace('{id}', user.id.toString()))
                .expect(200);

            expect(updatedUser.body).to.containEql(userToUpdate);
        });

        it('should failed to replace the user due to first name field is empty', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "", lastName: "Stark", email: "tony.stark@avengers.com" }));

            const response = await client
                .put(replaceUrl.replace('{id}', user.id.toString()))
                .send(userToUpdate)
                .expect(422);
            expect(response.body.error.message).to.containEql("The `User` instance is not valid. Details: `firstName` can't be blank (value: \"\")");
        });

        it('should failed to replace the user due to email field is empty', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            const userToUpdate = new User(givenUserData({ firstName: "", lastName: "Stark", email: "tony.stark@avengers.com" }));

            const response = await client
                .put(replaceUrl.replace('{id}', user.id.toString()))
                .send(userToUpdate)
                .expect(422);

            expect(response.body.error.message).to.containEql("The `User` instance is not valid. Details: `firstName` can't be blank (value: \"\")");
        });

        it('should failed to replace details of the user by id, since user with id \' 9999999\' does not exists ', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }

            const userToUpdate = new User(givenUserData({ firstName: "Tony", lastName: "Stark", email: "tony.stark@avengers.com" }));

            await client
                .put(getByIdUrl.replace('{id}', ' 9999999'))
                .send(userToUpdate)
                .expect(404);
        });
    });

    describe('invoke GET ' + getByIdUrl, () => {

        it('retrieves details of the user by id', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }

            const response = await client
                .get(getByIdUrl.replace('{id}', user.id.toString()))
                .expect(200);

            expect(response.body).to.containEql(user);
        });

        it('should failed to retrieves details of the user by id, since user with id \' 9999999\' does not exists', async () => {
            await client
                .get(getByIdUrl.replace('{id}', ' 9999999'))
                .expect(404);
        });

        it('should failed to retrieves details of the user by id and filter contains where clause which is excluded from filer in API', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }
            await client
                .get(getByIdUrl.replace('{id}', user.id.toString()))
                .query('filter=' + encodeURIComponent('{ "where": { "firstName": "Tony" } }'))
                .expect(400);
        });

        it('shoudl to retrieves mentioedn details of the user by id', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }

            const response = await client
                .get(getByIdUrl.replace('{id}', user.id.toString()))
                .query('filter=' + encodeURIComponent('{ "fields": { "firstName": true } }'))
                .expect(200);


            expect(response.body).to
                .containDeep({ firstName: "Harshad" });
        });
    });

    describe('invoke DELETE ' + deleteByIdUrl, () => {

        it('delete the user by id', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            if (!user.id) {
                console.log("failed to store user in test db");
                return expect(user.id).to.Null();
            }

            await client
                .delete(deleteByIdUrl.replace('{id}', user.id.toString()))
                .expect(204);
            await client
                .delete(getByIdUrl.replace('{id}', user.id.toString()))
                .expect(404);
        });

        it('should failed to delete details of the user by id, since user with id \' 9999999\' does not exists', async () => {
            await client
                .delete(deleteByIdUrl.replace('{id}', ' 9999999'))
                .expect(404);
        });
    });

    describe('invoke GET ' + getUrl, () => {

        it('should get all users ', async () => {
            const user1 = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            const user2 = await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            const user3 = await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });

            const response = await client
                .get(getUrl)
                .expect(200);

            expect(response.body).to.containDeep([user1, user2, user3]);
        });


        it('should get all users which matches the filter', async () => {
            const user1 = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            const user2 = await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });

            const response = await client
                .get(getUrl)
                .query('filter=' + encodeURIComponent('{ "where": { "or": [{ "firstName": "Harshad" }, { "firstName": "Captain" }] } }'))
                .expect(200);

            expect(response.body).to.containDeep([user1, user2]);
            expect(response.body).to.length(2);
        });

        it('should get all users in descending order of their first name ', async () => {
            const user1 = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            const user2 = await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            const user3 = await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });

            const response = await client
                .get(getUrl)
                .query('filter=' + encodeURIComponent('{ "order": ["firstName DESC"] }'))
                .expect(200);

            expect(response.body).to.containDeep([user3, user1, user2]);
        });


        it('should get empty list of users, since filter condition first name not matching with any user', async () => {
            await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });

            const response = await client
                .get(getUrl)
                .query('filter=' + encodeURIComponent('{ "where": { "firstName": "Ash" } }'))
                .expect(200);

            expect(response.body).to.containDeep([]);
            expect(response.body).to.length(0);
        });

        it('shoudl to retrieves mentioedn details of the users', async () => {
            await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            await givenUser({ firstName: 'Captain', lastName: 'America', email: 'captain.america@avengers.com' });
            await givenUser({ firstName: 'Tony', lastName: 'Stark', email: 'tony.stark@avengers.com' });

            const response = await client
                .get(getUrl)
                .query('filter=' + encodeURIComponent('{ "fields": { "firstName": true } }'))
                .expect(200);


            expect(response.body).to
                .containDeep([{ firstName: "Harshad" }, { firstName: "Captain" }, { firstName: "Tony" }]);
        });
    });

    function givenUserData(data?: Partial<User>) {
        return Object.assign(
            {
                firstName: 'firstName',
                lastName: 'lastName',
                email: 'firstname.lastname@domain'
            },
            data,
        );
    }

    async function givenUser(data?: Partial<User>) {
        return userRepo.create(givenUserData(data));
    }

});
