const mongoose=require('mongoose');
const baseModel=require('./base_model');
const md5=require('../util/md5')
const {set} = require("mongoose");
const Schema=mongoose.Schema;
const windowSchema=new mongoose.Schema({
    ...baseModel,
    area:{
        type:Schema.Types.ObjectId,
        ref:'Area',
        required:true
    },
    name:{
        type:String,
        require:true
    },
    dish:{
        type:Number
    },
    classification:{
        type:String,
        require:true
    },
    position:{
        type:String,
        require:true
    }
})
// const
module.exports=windowSchema