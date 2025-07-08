const express = require('express');
const {UserRouter} = require('./routes/user');
const {CourseRouter} = require('./routes/course')
const {adminRouter} = require('./routes/admin') 
const mongoose = require('mongoose');
 require('dotenv').config()
const app = express();
app.use(express.json())

 
app.use("/user", UserRouter);
app.use("/admin", adminRouter)
app.use("/course", CourseRouter);


async function main(){
    await mongoose.connect(process.env.MONGODB_URL)
    app.listen(3000);
    console.log("app is listening");
    
}
main();