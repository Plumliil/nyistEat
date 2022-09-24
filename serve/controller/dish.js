const {
    Dish,
    Window
} = require('../model')

// const jwt=require('../util/jwt')
// const {jwtSecret}=require('../config/config.default')



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
            limit = 10, offset = 0, type = '', value = ''
        } = req.query;
        let count = 0;
        let list = [];
        if (value !== '') {
            list = await Dish
                .find({
                    [type]: value
                })
                .limit(parseInt(limit)) // 选中多少条
                .skip(parseInt(offset)) // 跳过多少条
            count = list.length;
        } else {
            list = await Dish
                .find()
                .limit(parseInt(limit)) // 选中多少条
                .skip(parseInt(offset)) // 跳过多少条
            count = await Dish.countDocuments();
        }
        console.log(list);
        res.status(200).json({
            list,
            count
        })

    } catch {

    }
}

exports.campusGet = async (req, res, next) => {
    try {
        const {
            limit=10,
            offset=0,
            type,
            value
        } = req.query;
        let count = 0;
        let list = [];
        if (value) {
            list = await Dish
                .find({
                    [type]: value,
                })
                .limit(parseInt(limit)) // 选中多少条
                .skip(parseInt(offset)) // 跳过多少条
            count = list.length;
            // console.log(list);
        } else {
            list = await Dish
                .find()
                .limit(parseInt(limit)) // 选中多少条
                .skip(parseInt(offset)) // 跳过多少条
            count = await Dish.countDocuments();
            // console.log(list);
        }
        list = list.filter(item => {
            // console.log(item.address[0]);
            return item.address[0] === req.params.campus;
        })
        // console.log(list);
        res.status(200).json({
            list,
            count
        })

    } catch {

    }
}

exports.update = async (req, res, next) => {
    try {
        let dishUpdate = await Dish.findOne({
            '_id': req.body._id
        })
        if (req.body.window !== dishUpdate.window) {
            // 删除旧窗口中菜品
            let windowOld = await Window.findOne({
                'name': dishUpdate.window
            });
            windowOld.dishes.forEach((item, index) => {
                if (item._id === req.body._id) {
                    windowOld.dishes.splice(index, 1)
                }
            })
            windowOld.dishes = windowOld.dishes.filter(dish => dish !== null)
            await windowOld.save();
            // 向新窗口中添加
            let windowNew = await Window.findOne({
                'name': req.body.window
            })
            if (windowNew) {
                windowNew.dishes.push(req.body);
                windowNew.dishes.filter(dish => dish !== null);
                await windowNew.save()
            } else {
                const windowDate = {
                    name: req.body.window,
                    dishes: [req.body],
                    classification: req.classification,
                    address: req.address,
                };
                const newWindow = new Window(windowDate);
                await newWindow.save();
            }
        }
        dishUpdate = Object.assign(dishUpdate, req.body);
        await dishUpdate.save()
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
        const windowFindOne = await Window.findOne({
            name: windowName
        });
        let newWindowDishes = windowFindOne.dishes;
        newWindowDishes.forEach((item, index) => {
            if (item._id === req.body._id) {
                newWindowDishes.splice(index, 1);
            }
        })
        const windowDeleteDish = await Window.updateOne({
            'name': windowName
        }, {
            $set: {
                'dishes': newWindowDishes
            }
        })
        const dishDelete = await Dish.deleteOne({
            '_id': req.body._id
        })
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