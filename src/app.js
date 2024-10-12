import express, { json, urlencoded } from 'express'
import cookieParser from 'cookie-parser'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import handlebars from 'express-handlebars'
import sessionsRouter from './routes/api/sessions.js'
import viewsRouter from './routes/view.js'
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
        mongoUrl: "mongodb+srv://fabiobianchi:Ocasa2009@cluster0.dx5auig.mongodb.net/BackendII?retryWrites=true&w=majority&appName=Cluster0",
        mongoOptions:{},
        ttl:1000
    }),
    secret:"abc123",
    resave:false,
    saveUninitialized:true
}))

app.engine("handlebars", handlebars.engine())
app.set("view engine", "handlebars")
app.set("views", "./src/views")


app.use("/api/sessions", sessionsRouter)
app.use("/", viewsRouter)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})




