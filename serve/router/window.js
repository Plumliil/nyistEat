const express=require('express');
const windowCtrl=require('../controller/window');
// const userValidator = require("../validator/user");
// const auth=require('../middleware/auth')
const router=express.Router();

router.post('/add',windowCtrl.add)
router.get('/get',windowCtrl.get)
router.post('/update',windowCtrl.update)
router.post('/delete',windowCtrl.delete)
router.post('/dishDelete',windowCtrl.dishDelete)

module.exports=router;