import userDao from '../daos/userDao.js';
import userDTO from '../dtos/userDTO.js'


class UserController {
    async register(req, res) {
        const userData = req.body;
        const newUser = await userDao.create(userData);
        res.status(201).json(new userDTO(newUser));
    }

    async getUser(req, res) {
        const userId = req.params.id;
        const user = await userDao.getById(userId);
        if (user) {
            res.json(new userDTO(user));
        } else {
            res.status(404).send('User not found');
        }
    }
}
export default UserController