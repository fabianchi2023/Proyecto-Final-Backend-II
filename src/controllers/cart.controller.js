import Cart, { findById } from '../models/carts.model.js';

const createCart = async (req, res) => {
    try {
        const newCart = new Cart();
        await newCart.save();
        res.status(201).json({ status: 'success', cart: newCart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const getCartProducts = async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await findById(cid).populate('products.product');
        res.json({ status: 'success', products: cart.products });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

const addProductToCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const cart = await findById(cid);

        const existingProduct = cart.products.find(item => item.product.toString() === pid);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        res.json({ status: 'success', cart });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

export default {createCart,getCartProducts,addProductToCart};