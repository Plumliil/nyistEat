const mongoose = require('mongoose');
const baseModel = require('./base_model');
const md5 = require('../util/md5')
const {
    set
} = require("mongoose");
const userSchema = new mongoose.Schema({
    ...baseModel,
    username: {
        type: String,
        required: true
    },
    gender: {
        type: Number,
        default: 0
    },
    signature:{
        type:String,
        default:'说点什么...'
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        set: value => md5(value),
        select: false
    },
    image: {
        type: String,
        default: 'https://s2.loli.net/2022/09/22/6DrCu2JEemBPOak.png'
    },
    collect: {
        type: [Object],
        require: false
    },
    like: {
        type: [Object],
        require: false
    }
})



module.exports = userSchema