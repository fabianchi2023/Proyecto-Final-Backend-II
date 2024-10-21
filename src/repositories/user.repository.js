import { create as _create, findByEmail as _findByEmail, findById as _findById, update as _update, deleteUser as _delete } from '../daos/userDao.js';

class UserRepository {
    async addUser(userData) {
        return await _create(userData);
    }

    async getUserByEmail(email) {
        return await _findByEmail(email);
    }

    async getUserById(id) {
        return await _findById(id);
    }

    async updateUser(id, updateData) {
        return await _update(id, updateData);
    }

    async removeUser(id) {
        return await _delete(id);
    }
}

export default new UserRepository();