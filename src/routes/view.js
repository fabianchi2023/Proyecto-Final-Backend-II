import { Router } from 'express'
import {isNotAuthenticated } from '../middleware/auth.js';

const router = Router()

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