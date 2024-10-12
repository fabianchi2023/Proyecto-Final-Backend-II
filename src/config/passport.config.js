import passport from "passport";
import userModel from '../models/user.js'
import jwt from 'passport-jwt'

const JWTStrategy = jwt.Strategy
const ExtractJWT = jwt.ExtractJwt

const cookieExtractor = (req)=>{
    let token = null
    console.log(req.headers.cookie);
    if(req && req.headers){
        token = req.headers.cookie
    }
    return token
}

const initializePassport = () =>{

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: 'mefaltaeldotenv'
    }, async(jwt_payload, done)=>{
        try {
            const user = await userModel.findById(jwt_payload.id)
            if(user){
                return done(null, user)
            }
            
        } catch (error) {
            return done(error)
        }
    }))

    passport.serializeUser((user, done)=>{
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done)=>{
        let user = await userModel.findById(id)
        done(null, user)
    })

}


export default initializePassport