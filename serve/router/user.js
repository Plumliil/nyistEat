const express=require('express');
const userCtrl=require('../controller/user');
// const userValidator = require("../validator/user");
// const auth=require('../middleware/auth')
const router=express.Router();

// 用户注册
// router.post('/users',userValidator.register,userCtrl.register)
router.post('/users',userCtrl.login)
// 用户登录
// router.post('/users/login',userValidator.login,userCtrl.login)
router.post('/users/login',userCtrl.signin)
// // 获取当前用户
// router.get('/user',auth,userCtrl.getCurrentUser)
// // 更新当前登录用户
// router.put('/user',auth,userCtrl.updateCurrentUser)
// // 更新当前登录用户
// router.get('/usersList',auth,userCtrl.getUsersList)
// // // 获取单个用户信息
// router.get('/user/:userId',userCtrl.getUser)
router.get('/',(req,res)=>{
    res.send('user')
})
module.exports=router;