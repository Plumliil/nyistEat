const mongoose=require('mongoose');
const {createdAt}=require('./base_model');
const Schema=mongoose.Schema;
const imgSchema=new mongoose.Schema({
    data:{
        type:[Object],
        required:true
    },
    urls:{
        type:[String],
        required:true
    },
    createdAt
})
// const
module.exports=imgSchema
