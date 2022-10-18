import { juggler } from '@loopback/repository';
import * as fs from 'fs';
import { User } from '../models';
import { UserRepository } from '../repositories';

export const testdb: juggler.DataSource = new juggler.DataSource({
    name: 'memoryDB',
    connector: 'memory',
    localStorage: '',
    file: './data/test.json'
});

export const createDbFile = () => {
    fs.appendFile('./data/test.json', '{}', (err: Error | null) => {
        if (err) throw err;
        console.log('File Saved Successfully!');
    });
}

export const deleteDbFile = () => {
    fs.unlink('./data/test.json', (err: Error | null) => {
        if (err) throw err;
        console.log('File Deleted Successfully!');
    });
}

export function givenUserData(data?: Partial<User>) {
    return Object.assign(
        {
            firstName: 'firstName',
            lastName: 'lastName',
            email: 'firstname.lastname@domain'
        },
        data,
    );
}

export async function givenUser(data?: Partial<User>) {
    return new UserRepository(testdb).create(givenUserData(data));
}

export async function givenEmptyDatabase() {
    console.log("deleting all data for test case");
    await new UserRepository(testdb).deleteAll();
}