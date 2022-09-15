const mongoose=require('mongoose');
const baseModel=require('./base_model');
const md5=require('../util/md5')
const Schema=mongoose.Schema;
const {set} = require("mongoose");
const dishSchema=new mongoose.Schema({
    ...baseModel,
    dishname:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    classification: {
        type: String,
        required: true,
    },
    image:{
        type:String,
        default:null
    },
    score:{
        type:Number,
        require:false
    },
    like:{
        type:Number,
        require:false
    },
    windowId:{
        type:Schema.Types.ObjectId,
        ref:'window',
        required:false
    },
})


module.exports=dishSchema