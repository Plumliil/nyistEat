const mongoose=require('mongoose');
const {dbUri}=require('../config/config.default');
// const tagSchema = require('./tag');

mongoose.connect(dbUri,{
    useNewUrlParser:true,
    useUnifiedTopology:true
},(err)=>{
    if(err){
        console.log('MongoDB 数据库连接失败',err)
    }else{
        console.log('MongoDB 数据库连接成功')
    }
})

// 组织导出类型类
module.exports={
    User:mongoose.model('User',require('./user')),
    Dish:mongoose.model('Dish',require('./dish')),
    Window:mongoose.model('Window',require('./window')),
}
