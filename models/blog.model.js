const mongoose = require('mongoose')
const ROLES = require('../constant/role')
const BlogSchema = mongoose.Schema({
    title: { type: String, unique: true, required: true },
    description: { type: String, required: true, unique: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
},{
    versionKey : false,
    timestamps:true
})

const blogModel = mongoose.model('Blog', BlogSchema)
module.exports = blogModel