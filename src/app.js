import express, { json, urlencoded } from 'express' 
import handlebars from 'express-handlebars'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import viewsRouter from './routes/views.router.js'
import sessionsRouter from './routes/api/sessions.js'
import __dirname from './utils.js'
import { Server } from 'socket.io'
import productsModel from './models/products.model.js'
import session from 'express-session';
import cookieParser from 'cookie-parser';
import MongoStore from 'connect-mongo'
import mongoose from './config/database.js';
import passport from 'passport'
import initializePassport from './config/passport.config.js'

const app = express()
const PORT = 8080

//MIDDLEWARES

app.use(express.static("public"))
app.use(json())
app.use(urlencoded({extended: true}))
initializePassport()
app.use(passport.initialize())
// app.use(passport.session())
app.use(cookieParser()) 
app.use(session({
    store:MongoStore.create({
        mongoUrl: "MONGO_URL",
        mongoOptions:{},
        ttl:1000
    }),
    secret:"abc123",
    resave:false,
    saveUninitialized:false
}))

//ROUTES
app.use('/api/products', productsRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)
app.use('/api/sessions', sessionsRouter)

//CONFIGURACION HANDLEBARS
app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'))


//CONEXION AL SERVER (SOCKET)
const httpServer = app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
    
})

const socketServer = new Server(httpServer)

let products = []

const loadProducts = async () => {
    try {
        products = await productsModel.find().lean()
    } catch (error) {
        console.error('Error al cargar los productos:', error)
    }
}

await loadProducts()

const saveProducts = async () => {
    try {
        await productsModel.deleteMany({})
        await productsModel.insertMany(products)
        console.log('Productos guardados en MongoDB')
    } catch (error) {
        console.error('Error guardando productos en MongoDB:', error)
    }
}

socketServer.on('connection', socket =>{
    console.log('Nuevo cliente conectado')

    socket.on('getProducts', () => {
        socket.emit('updateProducts', products)
    });

    socket.on('newProduct', async (productData) => {
        try {
            const product = new productsModel(productData)
            products.push(product)
            await saveProducts()
            socketServer.emit('updateProducts', products)
        } catch (error) {
            console.error('No se pudo guardar el producto:', error)
        }
    })
    

    socket.on('deleteProduct', async (productId) => {
        const productIndex = products.findIndex(product => product._id == productId);
        console.log(productIndex);
        
        if (productIndex !== -1) {
            products.splice(productIndex, 1)
            await saveProducts()
            socketServer.emit('updateProducts', products)
            socketServer.emit('productDeleted', productId)
        }
    });

    socket.on('disconnect', () => {
        console.log('Cliente desconectado')
    })
})
