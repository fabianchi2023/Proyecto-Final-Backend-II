import { Router } from 'express';
import productsModel from '../models/products.model.js';

const router = Router();

// Obtener los productos de la DB con la opcion de filtrado, orden y paginado.

router.get('/', async (req, res) => {

    const {limit = 10, page = 1, sort, query} = req.query

    const optionsFilter = {
        limit: parseInt(limit, 10),
        page: parseInt(page, 10),
        sort: sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : undefined
    };

    const optionsQuery = query ? { $or: [{ category: query }, { status: query }] } : {};

    try {
        const result = await productsModel.paginate(optionsQuery, optionsFilter);
        res.json({
            status: 'success',
            payload: result.docs,
            totalPages: result.totalPages,
            prevPage: result.prevPage,
            nextPage: result.nextPage,
            page: result.page,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? `/api/products?limit=${limit}&page=${result.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: result.hasNextPage ? `/api/products?limit=${limit}&page=${result.nextPage}&sort=${sort}&query=${query}` : null
        });
    } catch (error) {
        res.json({ status: 'error', message: error.message });
    }
});

// Obtener un producto por su ID

router.get('/:pid', async (req, res) => {

    try {
        const wantedProduct = await productsModel.findById(req.params.pid);
        if (wantedProduct) {
            res.status(200).json(wantedProduct);
            
        } else {
            res.status(404).json({ message: "Producto inexistente" });
        }
    } catch (error) {
        res.status(500).json({ message: "Producto inexistente" });
    }
}) 

// Crear un producto con los atributos indicados

router.post('/', async (req, res) => {
    

    const { title, description, code, price, status, stock, category } = req.body
    
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' })
    }
    let newProduct = await productsModel.create({title, description, code, price, status, stock,category})
    res.send ({result:"producto creado", payload: newProduct})
    console.log(newProduct);
})

// Actualizar un producto
router.put('/:pid', async (req, res) => {

    try {
        let pid = req.params.pid        
        const productUpdate = await productsModel.findById(pid)

        if(!productUpdate){
            res.status(404).json({message: "Producto inexistente"})
        }

        const {title, description, code, price, status, stock, category} =req.body

        productUpdate.title = title ?? productUpdate.title
        productUpdate.description = description ?? productUpdate.description
        productUpdate.code = code ?? productUpdate.code
        productUpdate.price = price ?? productUpdate.price
        productUpdate.status = status ?? productUpdate.status
        productUpdate.stock = stock ?? productUpdate.stock
        productUpdate.category = category ?? productUpdate.category

        let result = await productsModel.updateOne({_id:pid}, productUpdate)
        res.send({result: "success", payload: result} )

    } catch (error) {
        res.status(500).json({ message: "Producto inexistente" });
    }
})

router.delete('/:pid', async (req, res) => {
    
    try {
        let deletedProduct  = req.params.pid      
        let result = await productsModel.deleteOne({ _id: deletedProduct })
        res.send({result: "succes", payload:result})
    } catch (error) {   
        res.status(500).json({ message: "Producto inexistente" })
    }
})

export default router