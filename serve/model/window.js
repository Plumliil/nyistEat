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
        type:[String],
        require:true
    },
    address:{
        type:[String],
        require:true
    },
    image:{
        type:String,
        require:false,
        default:'https://s2.loli.net/2022/09/16/pjZ5atWzcGyPlYq.jpg'
    }
})
// const
module.exports=windowSchema