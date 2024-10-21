import Product, { find, findByIdAndUpdate, findByIdAndDelete } from '../models/products.model.js';

const getAllProducts = async (req, res) => {
    try {
        const products = await find();
        res.json({ status: 'success', products });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const createProduct = async (req, res) => {
    try {
        const { title, description, code, price, status, stock, category, thumbnails } = req.body;
        const newProduct = new Product({ title, description, code, price, status, stock, category, thumbnails });
        await newProduct.save();
        res.status(201).json({ status: 'success', message: 'Producto creado satisfactoriamente' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const updateProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = await findByIdAndUpdate(pid, req.body, { new: true });
        res.json({ status: 'success', product: updatedProduct });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    try {
        const { pid } = req.params;
        await findByIdAndDelete(pid);
        res.json({ status: 'success', message: 'Product deleted successfully' });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export default {getAllProducts,createProduct,updateProduct,deleteProduct};