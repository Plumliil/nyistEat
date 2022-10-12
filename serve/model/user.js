const mongoose = require('mongoose');
const baseModel = require('./base_model');
// const md5 = require('../util/md5')
// const {
//     set
// } = require("mongoose");
const userSchema = new mongoose.Schema({
    ...baseModel,
    name: {
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
        // set: value => md5(value),
        // select: false
    },
    image: {
        type: String,
        default:'http://180.76.195.252:3366/public/userImgs/default.png',
        required:false
    },
    collect: {
        type: [Object],
        default:[],
        require: false
    },
    like: {
        type: [Object],
        default:[],
        require: false
    },
    rdmHistory:{
        type: [Object],
        default:[],
        require: false
    }
})



module.exports = userSchema