const fs = require('fs');
const express = require('express');
const multer = require('multer')
const uploadImg=require('../controller/uploadImg')
const router=express.Router()
// const upload = uploadImg({ dest: 'upload/' });

const createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        fs.mkdirSync(folder);
    }
};

const uploadFolder = './uploads/';

createFolder(uploadFolder);

// 通过 filename 属性定制
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null,Date.now() + '-' +  file.originalname);
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
const upload = multer({ storage: storage })

// 单图上传

// router.post('/dish', upload.single('dish'),uploadImg.dish);
router.post('/dish', upload.any(),uploadImg.dish);

router.post('/many',upload.any(),uploadImg.uploadMany);

module.exports=router
