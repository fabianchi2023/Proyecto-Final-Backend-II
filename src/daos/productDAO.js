import Product, { find, findById, findByIdAndUpdate, findByIdAndDelete } from '../models/products.model.js';

class ProductDAO {
    async create(productData) {
        const product = new Product(productData);
        return await product.save();
    }

    async getAll() {
        return await find().lean();
    }

    async getById(id) {
        return await findById(id).lean();
    }

    async update(id, updateData) {
        return await findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await findByIdAndDelete(id);
    }
}

export default new ProductDAO();