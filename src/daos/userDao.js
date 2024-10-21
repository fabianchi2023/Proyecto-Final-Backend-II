import User from '../models/user.model.js';

export const create = async (userData) => {
    const user = new User(userData);
    return await user.save();
};

export const findByEmail = async (email) => {
    return await User.findOne({ email }).lean();
};

export const findById = async (id) => {
    return await User.findById(id).lean();
};

export const update = async (id, updateData) => {
    return await User.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteUser = async (id) => {
    return await User.findByIdAndDelete(id);
};