import { Filter } from '@loopback/repository';
import { expect } from '@loopback/testlab';
import { UserController } from '../../controllers';
import { User } from '../../models';
import { UserRepository } from '../../repositories';
import { createDbFile, deleteDbFile, givenEmptyDatabase, givenUser, testdb } from '../database.helper';

describe('UserController (integration)', () => {
    before(createDbFile);

    after(deleteDbFile);

    beforeEach(givenEmptyDatabase);

    describe('findById()', () => {
        it('retrieves details of the user by id', async () => {
            const user = await givenUser({ firstName: 'Harshad', lastName: 'Kadam', email: 'harshad.kadam@sourcefuse.com' });
            const controller = new UserController(new UserRepository(testdb));
            if (!user.id) {
                return expect(user.id).to.Null();
            }
            const details = await controller.findById(user.id);
            expect(details).to.containEql(user);
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