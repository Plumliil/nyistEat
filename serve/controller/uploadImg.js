const fs = require("fs");
const path = require('path')
const {
    Images
} = require('../model/index')
exports.dish = async (req, res, next) => {
    try {
        console.log(req.files);
        fs.readFile(req.files[0].path, async (err, data) => {
            if (err) {
                return res.send('上传失败')
            }
            let imgUrl = Date.now() + '-' + req.files[0].originalname;
            fs.writeFile(`./public/dishImgs/${imgUrl}`, data, err => {
                console.log(err)
                if (err) return err;
            })
            const imgData = {
                data: req.files[0],
                url: `http://localhost:3366/public/dishImgs/${imgUrl}`
                // url: `http://180.76.195.252:3366/public/dishImgs/${imgUrl}`
            }
            const img = new Images(imgData)
            await img.save()
            res.status(201).json({
                img
            })
        })
    } catch (err) {
        next(err)
    }
}
exports.uploadOne = async (req, res, next) => {
    try {
        console.log(req.file);
        // var imgUrl = 'imgUrl'
        fs.readFile(req.file.path, async (err, data) => {
            if (err) {
                return res.send('上传失败')
            }
            fs.writeFile(`./static/img/${req.file.originalname}`, data, err => {
                console.log('写入成功')
            })
            const imgData = {
                data: [req.file],
                url: [`http://http://124.70.8.61:3366/public/img/${req.file.originalname}`]
            }
            const img = new Images(imgData)
            await img.save()
            res.status(201).json({
                img
            })
        })
    } catch (err) {
        next(err)
    }
}
exports.uploadMany = async (req, res, next) => {
    try {
        const files = req.files
        let imgsData = {
            data: [],
            urls: [],
            // article:''
        }
        files.forEach(item => {
            fs.readFile(item.path, async (err, data) => {
                if (err) {
                    return res.send('上传失败')
                }
                fs.writeFile(`./static/img/${item.originalname}`, data, err => {
                    console.log('写入成功')
                })
            })
            imgsData.data.push(item)
            imgsData.urls.push(`http://124.70.8.61:3366/public/img/${item.originalname}`)
        })
        // imgsData.article=req.params.articleId
        const imgs = new Images(imgsData)
        await imgs.save()
        res.status(201).json({
            imgs,
            status: 'success'
        })
    } catch (err) {
        next(err)
    }
}