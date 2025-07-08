const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.ObjectId;
require('dotenv').config();
 async function dbCall(){
    await mongoose.connect(process.env.MONGODB_URL)
    console.log("databse is connected!!");
 }
 dbCall();



const User = new Schema({
    email : {type :String, unique : true},
    password: String,
    firstName : String,
    lastName  : String
});

const Course = new Schema({
    title : {type : String, unique:true},
    dscription : String,
    price : Number,
    creatorId : ObjectId,
    courseId : ObjectId
    // name : {type : String, unique : true},

})

const Admin = new Schema({
    email : String,
    password: String,
    firstName : String,
    lastName  : String
})

const Purchase = new Schema({
    courseId : ObjectId,
    userId : ObjectId
});

const UserModel = mongoose.model("users", User)
const courseModel = mongoose.model("courses", Course)
const adminModel = mongoose.model("admin", Admin)
const purchaseModel = mongoose.model("purchase", Purchase)

module.exports = {
    UserModel,courseModel,adminModel,purchaseModel
}