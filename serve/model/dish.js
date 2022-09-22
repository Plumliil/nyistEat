const mongoose=require('mongoose');
const baseModel=require('./base_model');
const md5=require('../util/md5')
const Schema=mongoose.Schema;
const {set} = require("mongoose");
const dishSchema=new mongoose.Schema({
    ...baseModel,
    name:{
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
        default:'https://s2.loli.net/2022/09/16/pjZ5atWzcGyPlYq.jpg'
    },
    score:{
        type:[Object],
        require:false
    },
    like:{
        type:[Object],
        require:false
    },
    window:{
        type:String,
        require:true
    },
    address:{
        type:[String],
        require:true
    }

})


module.exports=dishSchema