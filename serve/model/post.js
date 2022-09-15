const mongoose=require('mongoose');
const baseModel=require('./base_model');
const md5=require('../util/md5')
const {set} = require("mongoose");
const postSchema=new mongoose.Schema({
    ...baseModel,
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    content:{
        type:String
    },
    like:{
        type:Number
    }
})
// const
module.exports=postSchema