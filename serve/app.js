const express = require('express')
const path = require('path')
const Router = require('./router')
const app = express();
// app.use(cors());


app.use('/api', Router);


// app.use('/', router);


app.get('/', (req, res) => {
    res.send('111')
})


// 配置静态资源目录 整一个文件夹 通过域名能访问
// app.use('/public',express.static(path.join(__dirname, './static')))

// 挂载路由


const PORT = 3366;
app.listen(PORT)