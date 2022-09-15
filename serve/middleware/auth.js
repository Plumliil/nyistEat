const {verify} = require('../util/jwt')
const {jwtSecret} = require('../config/config.default')
const {User}=require('../model')

module.exports = async (req, res, next) => {
    // 从请求头获取 token 数据
    let token = req.headers['authorization']
    // 验证token是否存在
    token = token
        ? token
        : null
    if (!token) {
        return res.status(401).end()
    }
    try {
        // 验证token是否有效
        const decodedToken=await verify(token, jwtSecret,{
            expiresIn:'5h'
        });
        // console.log(decodedToken)
        // 将信息挂载到请求对象
        req.user=await User.findById(decodedToken.userId)
        next()
    } catch (err) {
        return res.status(401).end()
    }
    // 验证token是否有效
    // 无效 响应401 状态码
    // 有效 读取用户信息挂载到 req 请求对象上
    // 继续执行
}
