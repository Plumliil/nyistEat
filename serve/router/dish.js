const express=require('express');
const dishCtrl=require('../controller/dish');
// const dishValidator = require("../validator/dish");
// const auth=require('../middleware/auth')
const router=express.Router();

// 用户注册
// router.post('/dishs',dishValidator.register,dishCtrl.register)
router.post('/set',dishCtrl.set)
// 用户登录
// router.post('/dishs/login',dishValidator.login,dishCtrl.login)
router.get('/get',dishCtrl.get)

module.exports=router;