import Cart, { findById, findByIdAndUpdate, findByIdAndDelete } from '../models/carts.model.js';

class CartDAO {
    async create(cartData) {
        const cart = new Cart(cartData);
        return await cart.save();
    }

    async getById(id) {
        return await findById(id).populate('products.product').lean();
    }

    async update(id, updateData) {
        return await findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await findByIdAndDelete(id);
    }
}

export default new CartDAO();