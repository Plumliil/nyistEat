const express=require('express');
const windowCtrl=require('../controller/window');
// const userValidator = require("../validator/user");
// const auth=require('../middleware/auth')
const router=express.Router();

router.post('/add',windowCtrl.add)
router.get('/get',windowCtrl.get)
router.put('/update',windowCtrl.update)

module.exports=router;