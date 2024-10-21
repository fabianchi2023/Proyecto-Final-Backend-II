import {fileURLToPath} from 'url'
import {dirname} from 'path'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import passport from 'passport'
import nodemailer from 'nodemailer'
import config from './config/config.js'


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default __dirname

//Hasheo de contraseña

export const createHash = password =>bcrypt.hashSync(password, bcrypt.genSaltSync(10))

// Validacion contraseña

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)


//Generacion token

const PRIVATE_KEY = "coderSecret"
const generateToken = (user) =>{
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn: "24h"})
    return token
}

//Autenticacion token
const authToken = (req, res, next) =>{
    const authHeader= req.headers.authorization
    if(!authHeader) return res.status(401).send({error:"No autenticado"})
    const token = authHeader.split(" ")[1]

    jwt.verify(token, PRIVATE_KEY, (error, credentials)=>{
        if(error) return res.status(403).send({error: "No estas autorizado"})
        req.user = credentials.user
        next()
    })
}

export const passportCall = (strategy) => {
    return async (req, res, next) =>{
        passport.authenticate(strategy, function(error, user, info){
            if(error){
                console.log(error);
                
                return next(error)
            }
            if(!user){
                return res.status(401).send({error:info.messages? info.messages : info.toString()})
            }
            req.user = user
            next()
        })
        (req, res, next)
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "No estas autorizado" })
        if (req.user.role !== role) return res.status(403).send({ error: "No tienes los permisos necesarios para este role" })
        next()
    }
}

const transporter = nodemailer.createTransport({
    service: config.emailService,
    auth: {
        user: config.emailUser,
        pass: config.emailPass,
    },
});

const sendResetLink = (email, link) => {
    const mailOptions = {
        from: config.emailUser,
        to: email,
        subject: 'Password Reset',
        text: `Click aqui para recuperar tu contraseña: ${link}`,
    };
    return transporter.sendMail(mailOptions);
};


export {generateToken, authToken, sendResetLink} 