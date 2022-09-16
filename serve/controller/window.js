const {
    Window
} = require('../model')
// const jwt=require('../util/jwt')
// const {jwtSecret}=require('../config/config.default')


exports.add = async (req, res, next) => {
    try {
        const window = new Window(req.body)
        await window.save()
        res.status(201).json({
            window,
            state: 'success'
        })
    } catch {

    }
}

exports.get = async (req, res, next) => {
    try {
        const {
            limit = 20, offset = 0
        } = req.query
        const windowList = await Window.find()
            .limit(parseInt(limit)) // 选中多少条
            .skip(parseInt(offset)) // 跳过多少条
        const windowCount = await Window.countDocuments()
        res.status(200).json({
            windowList,
            windowCount
        })

    } catch {

    }
}

exports.update = async (req, res, next) => {
    try {
        let windowName = req.body.name;
        let newDishes = req.body.dishes;
        const window = await Window.find({
            windowName
        });
        console.log('window',window);
        console.log('window.length',window.length);
        console.log('window.length',window===[]);
        // newDishes = window.dishes.push(...newDishes);
        if (window.length===0) {
            console.log('创建');
            const newWindow = new Window(req.body)
            await newWindow.save()
            console.log('newWindow',newWindow);
        } else {
            console.log('更新');
            // console.log(window[0].dishes);
            newDishes.push(...window[0].dishes)
            Window.updateOne({
                '_id':window[0]._id
            }, {
                $set:{'dishes': newDishes}
            })
            .then(res=>{
                console.log(res);
            });
        }
        res.status(200).json({
            window,
        })

    } catch {

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
// exports.updateCurrentUser = async (req, res, next) => {
//     try {
//         res.send('updateCurrentUser')
//     } catch (err) {
//         next(err)
//     }
// }

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