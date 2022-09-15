const express=require('express');
const router=express.Router();

router.get('/',(req, res) => {
    res.send('get index /')
})

// 用户相关路由
router.use('/user',require('./user'));


router.use('/dish',require('./dish'));

// 上传图片
// router.use('/upload',require('./uploadImg'));




module.exports=router;
