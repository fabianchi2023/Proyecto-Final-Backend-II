import { Router } from 'express'
import fs from 'fs'
import cartModel from '../models/carts.model.js'
import productsModel from '../models/products.model.js'

const router = Router()

// Crear un carrito

router.post('/', async (req, res) => {

        try {
                const newCart = new cartModel();
                await newCart.save();
                res.status(201).json({ status: 'success', payload: newCart });
        } catch (error) {
                res.status(500).json({ status: 'error', message: error.message });
        }
        
})

// Obtener un carrito por su ID

router.get('/:cid', async (req, res) => {

    try {
        const cart = await cartModel.findById(req.params.cid).populate('products.product');
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }

})

// Agregar un producto (por su ID) a un carrito indicando su ID. Ambos ID por req.params

router.post('/:cid/product/:pid', async (req, res) => {

    try {
        const cart = await cartModel.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
    
        const product = await productsModel.findById(req.params.pid);
        if (!product) return res.status(404).json({ status: 'error', message: 'Producto no encontrado' });
    
        const existingProduct = cart.products.find(prod => prod.product && prod.product.equals(product._id));
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.products.push({ product: product._id, quantity: 1 });
        }
    
        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    
    
    }
})

router.put('/:cid', async (req, res) => {
    const { cid } = req.params;
    const { products } = req.body; 
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = products;
        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const cart = await cartModel.findById(cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        const productInCart = cart.products.find(p => p.product.toString() === pid);
        if (!productInCart) return res.status(404).json({ status: 'error', message: 'Producto no encontrado en el carrito' });

        productInCart.quantity = quantity;
        await cart.save();
        res.json({ status: 'success', payload: cart });
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    
    const { cid, pid } = req.params;
    try {
        const cart = await cartModel.findById(cid);
        if (cart) {
            cart.products = cart.products.filter(p => p.product && p.product.toString() !== pid);
            await cart.save();
            res.json({ status: 'success', message: 'Producto eliminado del carrito' });
        } else {
            res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });
        }
    } catch (err) {
        res.status(500).json({ status: 'error', message: err.message });
    
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const cart = await cartModel.findById(req.params.cid);
        if (!cart) return res.status(404).json({ status: 'error', message: 'Carrito no encontrado' });

        cart.products = [];
        await cart.save();
        res.json({ status: 'success', message: 'Carrito vaciado' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
});

export default router