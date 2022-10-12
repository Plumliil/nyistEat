const {
    User
} = require('../model')
const {
    emailSend
} = require('../middleware/sendEmail')
const {
    encryption
} = require('../util/md5')
const jwt = require('../util/jwt')
const {
    jwtSecret
} = require('../config/config.default')
const {
    count
} = require('console')


// 用户注册

// ![userW.png](https://s2.loli.net/2022/09/22/GXxZVfeYSLBUH6d.png)
// ![userM.png](https://s2.loli.net/2022/09/22/6DrCu2JEemBPOak.png)


// name
// email
// password

exports.jsp = async (req, res, next) => {
    try {
        const email = req.params.email;
        let rdmValue = Math.floor(Math.random() * (9999 - 1000) + 1000);
        emailSend(email, rdmValue);
        res.status(201).json({
            email,
            rdmValue
        })
    } catch {

    }
}


exports.register = async (req, res, next) => {
    try {
        const email = req.body.email;
        const password = encryption(req.body.password);
        const name = req.body.name;
        console.log(111);
        console.log({
            email: email,
            name: name,
            password: password
        });
        if (!email || !password || !name) {
            res.status(400).json({
                state: 'error'
            })
        }
        const usernameFind = await User.find({
            username: name
        })
        const emailFind = await User.find({
            email: email
        })
        console.log(usernameFind, emailFind)
        if (usernameFind.length !== 0) return res.json({
            error: '用户名重复'
        })
        if (emailFind.length !== 0) return res.json({
            error: '邮箱重复'
        })

        // 3.验证通过，将数据保存到数据库
        console.log('3.验证通过，将数据保存到数据库');
        let user = new User({
            email: email,
            name: name,
            password: password
        })
        // 保存到数据库
        await user.save()
        // user = user.toJSON()
        console.log(user)
        // delete user.password
        // 4.发送成功响应
        res.status(201).json({
            user,
            state: 'success'
        })

    } catch {

    }
}

exports.signin = async (req, res, next) => {
    try {
        const user = await User.findOne({
            email: req.body.email
        })
        if (user.password !== encryption(req.body.password)) {
            res.status(400).json({
                state: 'error',
            })
        } else {
            const token = await jwt.sign({
                userId: user._id,
                userName: user.username
            }, jwtSecret)
            res.status(200).json({
                state: 'success',
                data: user,
                token
            })
        }

    } catch {

    }
}


exports.update = async (req, res, next) => {
    try {
        console.log(req.body._id);
        let userUpdate = await User.findOne({
            '_id': req.body._id
        })
        userUpdate = Object.assign(userUpdate, req.body);
        console.log(userUpdate);
        await userUpdate.save()
        console.log('has save');
        res.status(201).json({
            userUpdate,
            state: 'success'
        })
    } catch (error) {

    }
}

exports.get = async (req, res, next) => {
    try {
        console.log(req.body._id);
        let user = await User.find({
            _id: req.body._id
        })
        res.status(201).json({
            user,
            state: 'success'
        })
    } catch (error) {

    }
}
exports.adminGet = async (req, res, next) => {
    try {
        const {
            limit = 10, offset = 0, type = '', value = ''
        } = req.query;
        let list = [];
        let count;
        if (type === '' || value === '') {
            list = await User.find()
                .limit(parseInt(limit)) // 选中多少条
                .skip(parseInt(offset)) // 跳过多少条
            count = list.length

        } else {
            list = await User.find({
                    [type]: value
                })
                .limit(parseInt(limit)) // 选中多少条
                .skip(parseInt(offset)) // 跳过多少条
            count = list.length
        }

        res.status(201).json({
            list,
            count,
            state: 'success'
        })
    } catch (error) {

    }
}

// exports.register = async (req, res, next) => {
//     try {
//         // 1.获取请求体数据
//         // 2.数据验证
//         if(req.body.user.username===''&&req.body.user.email===''&&req.body.user.password===''){
//             return res.json({
//                 error:'null'
//             })
//         }
//         const usernameFind=await User.find({username:req.body.user.username})
//         const emailFind=await User.find({email:req.body.user.email})
//         console.log(usernameFind,emailFind)
//         if(usernameFind.length!==0) return res.json({error:'用户名重复'})
//         if(emailFind.length!==0) return res.json({error:'邮箱重复'})
//         // 3.验证通过，将数据保存到数据库
//         let user = new User(req.body.user)

//         // 保存到数据库
//         await user.save()

//         user=user.toJSON()

//         console.log(user)

//         delete user.password
//         // 4.发送成功响应
//         console.log(req.body.user)
//         res.status(201).json({
//             user,
//             state:'success'
//         })
//     } catch (err) {
//         next(err)
//     }
// }
// // 用户登录
// exports.login = async (req, res, next) => {
//     try {
//         // 1.获取请求体数据
//         // 2.数据验证
//         // 3.生成token
//         // req.user为验证时挂载的user
//         const user=req.user.toJSON()
//         const token=await jwt.sign({
//             userId:user._id,
//             userName:user.username
//         },jwtSecret)
//         // 4.验证通过，将数据保存到数据库
//         // 5 .发送成功响应
//         delete user.password

//         res.status(200).json({
//             state:'success',
//             ...user,
//             token
//         })
//         // res.send('login')
//     } catch (err) {
//         next(err)
//     }
// }
// // 获取当前用户
// exports.getCurrentUser = async (req, res, next) => {
//     try {
//         console.log(req.headers)
//         // res.send('getCurrentUser')
//         res.status(200).json({
//             user:req.user
//         })

//     } catch (err) {
//         next(err)
//     }
// }
// // 更新当前用户
exports.updateCurrentUser = async (req, res, next) => {
    try {
        res.send('updateCurrentUser')
    } catch (err) {
        next(err)
    }
}

// // 获取用户列表
// exports.getUsersList = async (req, res, next) => {
//     try {
//         const {limit=20,offset=0}=req.query
//         const usersList=await User.find()
//         .limit(parseInt(limit)) // 选中多少条
//         .skip(parseInt(offset)) // 跳过多少条
//         const usersCount=await User.countDocuments()
//         // usersList.password
//         res.status(200).json({
//             usersList,
//             usersCount
//         })
//         // console.log(usersList)
//     } catch (err) {
//         next(err)
//     }
// }
// // // 获取用户列表
// // exports.getUsersList = async (req, res, next) => {
// //     try {
// //         res.send('updateCurrentUser')
// //     } catch (err) {
// //         next(err)
// //     }
// // }
// // 获取单个用户信息
// exports.getUser = async (req, res, next) => {
//     try {
//         // console.log(111);
//         console.log(req.params.userId);
//         const user=await User.findOne({_id:req.params.userId})
//         // res.end(11)
//         res.json({
//             author:user.username
//         })
//         // const usersList=await User.find()
//         // .limit(parseInt(limit)) // 选中多少条
//         // .skip(parseInt(offset)) // 跳过多少条
//         // const usersCount=usersList.length
//         // usersList.password
//         // res.status(200).json({
//         //     usersList,
//         //     usersCount
//         // })
//         // console.log(usersList)
//     } catch (err) {
//         next(err)
//     }
// }