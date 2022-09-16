const {
    Dish,
    Window
} = require('../model')

// const jwt=require('../util/jwt')
// const {jwtSecret}=require('../config/config.default')

// 用户注册


exports.add = async (req, res, next) => {
    try {
        const dish = new Dish(req.body)
        await dish.save()
        res.status(201).json({
            dish,
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
        const dishList = await Dish.find()
            .limit(parseInt(limit)) // 选中多少条
            .skip(parseInt(offset)) // 跳过多少条
        const dishCount = await Dish.countDocuments()
        res.status(200).json({
            dishList,
            dishCount
        })

    } catch {

    }
}

exports.update = async (req, res, next) => {
    try {
        const dishUpdate = await Dish.updateOne({
            name: req.body.name,
            window: req.body.window
        }, {
            $set: req.body
        });
        res.status(201).json({
            dishUpdate,
            state: 'success'
        })
    } catch {

    }
}

exports.delete = async (req, res, next) => {
    try {
        let windowName = req.body.window;
        const windowFindOne = await Window.findOne({name:windowName});
        let newWindowDishes=windowFindOne.dishes;
        newWindowDishes.forEach((item,index)=>{
            if(item._id===req.body._id){
                newWindowDishes.splice(index,1);
            }
        })
        const windowDeleteDish = await Window.updateOne({
            'name':windowName 
        }, {
            $set: {
                'dishes': newWindowDishes
            }
        })
        const dishDelete = await Dish.deleteOne({'_id':req.body._id})
        res.status(201).json({
            dishDelete,
            state: 'success'
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