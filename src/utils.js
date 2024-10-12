import bcrypt from 'bcrypt'
import passport from 'passport'

//Hasheo de contraseña con 'bcrypt'

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10))

//Validacion contraseña con 'bcryp'

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password)

export const generateToken = (user) =>{
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn:"24h"})
    return(token)
}

export const authToken = (req, res, next)=>{
    const authHeader = req.headers.authorization
    if(!authHeader) return res.status(401).send({error: "No autenticado"})
    const token = authHeader.split(" ")[1]

    jwt.verify(token, PRIVATE_KEY, (error, credentials)=>{
        if (error) return res.status(403).send ({error: "No estas autorizado"})
        req.user  = credentials.user
        next()
    })
}

const PRIVATE_KEY = "mefaltaeldotenv"

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
