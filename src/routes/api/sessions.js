import { Router } from "express";
import {createHash, isValidPassword, authToken, generateToken, passportCall, authorization } from "../../utils.js";
import userModel from "../../models/user.model.js"
import passport from "passport";
import jwt from 'jsonwebtoken'
import UserDTO from '../../dtos/userDTO.js';
import userRepository from "../../repositories/user.repository.js";
import { extractToken } from "../../middleware/auth.js";

const router = Router()

router.post("/register", async (req, res) => {

    const { first_name, last_name, email, age, password } = req.body
    try {
        const exists = await userModel.findOne({email})
          if (exists) {
              return res.status(400).json({ message: 'Email ya registrado' })
          }
        
        const newUser = new userModel({
              first_name,
              last_name,
              email,
              age,
              password: createHash(password),  
        })
        await newUser.save()

        const acces_token = generateToken(newUser)
        console.log(acces_token);
          
        res.cookie("jwt", acces_token, {httpOnly: true})
        

        res.redirect('/login')
    }
    catch(error){
            res.status(500).send(error)
    }

 })


router.post("/login", async (req, res) => {
    const { email, password } = req.body
    try {
      const user = await userModel.findOne({email})
      if (!user || !isValidPassword(user, password)) {
        return res.status(401).json({ message:"Credenciales invalidas" })
      }
      
      res.send({message:"Ingreso exitoso!"})

    } catch (error) {
      res.status(500).json({ errorMessage: "Server error" });
    }
  });

router.get('/current', extractToken, async (req, res) => {
    jwt.verify(req.token, config.jwtSecret, async (err, decoded) => {
        if (err) return res.status(401).json({ status: 'error', message: 'Unauthorized' });
        const user = await userRepository.findById(decoded.id);
        const userDTO = new UserDTO(user);
        res.json({ status: 'success', user: userDTO });
    });
});

router.post('/logout', (req, res) => {
    res.clearCookie('connect.sid')
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

export default router