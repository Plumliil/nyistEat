const express = require('express')
const path = require('path')
// const cors = require('cors')
// const morgan =require('morgan')
const bodyParser = require('body-parser')
const Router = require('./router')
const app = express();

app.all('*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With,Content-Type");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", ' Express 4.17.1');
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use(morgan('dev'));
// app.use(cors());

// app.use(bodyParser.urlencoded({
//   extended: false
// }))
// app.use(bodyParser.json())


app.use('/api', Router);





// 配置静态资源目录 整一个文件夹 通过域名能访问
app.use('/public',express.static(path.join(__dirname, './static')))

// 挂载路由


const PORT = 3366;
app.listen(PORT)