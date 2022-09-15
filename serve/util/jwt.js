const jwt = require('jsonwebtoken')
const {promisify} = require('util')
const {sign} = require("jsonwebtoken");

// 生成token
exports.sign=promisify(jwt.sign)
// 需要密钥解析token
exports.verify=promisify(jwt.verify)
// 不需要密钥解析
exports.decode=promisify(jwt.decode)







// 生成token
// const token=jwt.sign({
//     foo:'bar'
// },'asasasasa',(err,token)=>{
//     if(err){
//         return console.log('生成token失败')
//     }
//     console.log(token)
// })
// 验证token
// const result=jwt.verify(
//     'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
//     'eyJmb28iOiJiYXIiLCJpYXQiOjE2MzA1NTE4MTh9.' +
//     'LhbPM4fIdrUFjLqNh0uh2gUFrK3Nh66pFVkpr1VUuiE',
//     'asasasasa',(err,ret)=>{
//         if(err){
//             return console.log('token 认证失败')
//         }
//         console.log(ret)
//     })