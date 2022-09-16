const mongoose=require('mongoose');
const baseModel=require('./base_model');
const md5=require('../util/md5')
const {set} = require("mongoose");
const Schema=mongoose.Schema;
const windowSchema=new mongoose.Schema({
    ...baseModel,
    name:{
        type:String,
        require:true
    },
    dishes:{
        type:[Object],
    },
    classification:{
        type:String,
        require:true
    },
    address:{
        type:[String],
        require:true
    }
})
// const
module.exports=windowSchema