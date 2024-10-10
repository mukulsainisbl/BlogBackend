const mongoose =  require('mongoose')
const ROLES = require('../constant/role')
const UserSchema = mongoose.Schema({
    username : {type:String ,  unique:true, required:true},
    password:{type:String, required: true, unique :true},
    role : {type:String,  enum  : [ROLES.ADMIN , ROLES.AUTHOR, ROLES.READER] , default : ROLES.READER }
} , {
    versionKey: false,
    timestamps:true
})

const userModel = mongoose.model('User' , UserSchema)
module.exports = userModel