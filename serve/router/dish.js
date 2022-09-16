const express=require('express');
const dishCtrl=require('../controller/dish');
const router=express.Router();

router.post('/add',dishCtrl.add)
router.get('/get',dishCtrl.get)
router.put('/update',dishCtrl.update)
router.post('/delete',dishCtrl.delete)



module.exports=router;