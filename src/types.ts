import { GenericService } from "@loopback/service-proxy";

export interface UserApiService extends GenericService {
    createUser(firstName: String, middleName: String, lastName: String, email: String,
        address: String, phoneNumber: String, customerId: String): Promise<Object>;
    getUsers(): Promise<Object[]>;
    getUsersCount(): Promise<Object>;
    getUserById(id: number): Promise<Object>;
    updateUserById(id: number, firstName: String, middleName: String, lastName: String, email: String,
        address: String, phoneNumber: String, customerId: String): Promise<Object>;
    deleteUserById(id: number): Promise<Object>;
} 