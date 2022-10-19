import { GenericService } from "@loopback/service-proxy";

export interface UserApiService extends GenericService {
    createUser(firstName: string, middleName: string, lastName: string, email: string,
        address: string, phoneNumber: string, customerId: number): Promise<UserObject>;
    getUsers(): Promise<UserObject[]>;
    getUsersCount(): Promise<UserObject>;
    getUserById(id: number): Promise<UserObject>;
    updateUserById(id: number, firstName: string, middleName: string, lastName: string, email: string,
        address: string, phoneNumber: string, customerId: number): Promise<UserObject>;
    deleteUserById(id: number): Promise<UserObject>;
    ping(): Promise<Object>;
}

export interface UserObject {
    id?: number;
    firstName: string;
    middleName: string;
    lastName: string;
    email: string;
    address: string;
    phoneNumber: string;
    customerId: number;
    createdOn?: string | null;
    modifiedOn?: string | null;
}