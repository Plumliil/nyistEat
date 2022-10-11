const mongoose=require('mongoose');
const {createdAt}=require('./base_model');
const Schema=mongoose.Schema;
const imgSchema=new mongoose.Schema({
    data:{
        type:Object,
        required:true
    },
    url:{
        type:String,
        default:'https://s2.loli.net/2022/09/16/pjZ5atWzcGyPlYq.jpg',
        required:true
    },
    createdAt
})
// const
module.exports=imgSchema
