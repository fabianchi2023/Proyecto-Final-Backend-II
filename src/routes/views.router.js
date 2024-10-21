import express from 'express'
import productsModel from '../models/products.model.js'
import {isNotAuthenticated } from '../middleware/auth.js';


const router = express.Router()

router.get('/products', async (req, res) => {
    let page = parseInt(req.query.page)
    let limit = parseInt(req.query.limit)
    if (!page) page = 1;
    if (!limit) limit = 9
    let products = await productsModel.paginate({}, { page, limit, lean: true })
    products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}` : '';
    products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}` : '';
    products.isValid = !(page <= 0 || page > products.totalPages)
    res.render('home', products)
    console.log(products);
    
    })

router.get('/realtimeproducts', async(req, res) => {
    let products = await productsModel.find()
    res.render('realTimeProducts', products)
})

router.get('/api/sessions/register', isNotAuthenticated,  (req, res) => {
    res.render('register');
});

router.get('/api/sessions/login', async(req, res)=>{
    res.render('login')
})

router.get('/current', async(req, res)=>{
    res.render('profile', {user})
})


export default router