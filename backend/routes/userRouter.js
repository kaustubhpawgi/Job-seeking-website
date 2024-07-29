const express= require('express');
const router= express.Router();
const {register,login,logout,getUser}= require('../controllers/userController')
const isAuthorized = require('../middlewares/auth')

router.post('/register',register)
router.post('/login',login)
router.get('/logout',isAuthorized,logout).get('/getuser',isAuthorized,getUser)
module.exports= router; 