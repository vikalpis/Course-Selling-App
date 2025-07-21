const {Router} = require('express');
const adminRouter = Router();
const { adminModel, courseModel} = require('../db/db');
const { default: mongoose } = require('mongoose');
const jwt = require('jsonwebtoken');
const express = require('express');
// const user = require('./user');
const app = express();
const bcrypt = require('bcrypt');
const z = require('zod')
app.use(express.json())
const {JWT_SECRET} = require('../config')
const {adminMiddleware} = require('../middleware/admin')


adminRouter.post("/signUp", async function(req,res){
    //INput validation
    const verifiedInputs = z.object({
        email : z.string().email(),
        password : z.string().min(6).max(20)
        .refine((val)=> /[A-Z]/.test(val),{
            message: "password must include capital letters"
        })
        .refine((val)=> /[a-z]/.test(val),{
            message: "password must contain small letters"
        }),
        firstName : z.string().min(2).max(13),
        lastName : z.string().min(2).max(10)
    }).strict()
// parsing 
    const parsedbody = verifiedInputs.safeParse(req.body)
    if(!parsedbody.success){
        res.json({
            message : "your credential are in incorrect format",
            error : parsedbody.error.format()
        })
    }
    // taking inputs
    const { email, password, firstName, lastName} = req.body;

    // password hashing 
    const hashedpass = await bcrypt.hash(password , 4);
    let errorThrown = false;
    try {
         await adminModel.create({
        email : email,
        password : hashedpass,
        firstName : firstName,
        lastName : lastName
    })
   
    } catch (error) {
        res.status(403).json({
            message : "Sign Up failed!",
            error : error
        })
        errorThrown = true
    }
    if(!errorThrown){
        res.json({
            message : "You are Signed Up!"
        })
    }

});
// admin login route
adminRouter.post("/logIn", async function(req,res){
    const {email, password} = req.body;

    const user = await adminModel.findOne({email});

    if(!user){
        res.status(403).json({
            message : "User does not exist!"
        })
        return
    }

    const isCorrectPass = await bcrypt.compare(password, user.password)

    if(isCorrectPass){
        const token = jwt.sign({
            id : user._id
        },JWT_SECRET);
        res.json({
            message : "user is logged in!",
            token : token
        })
    }else{
        res.status(403).send({
            message : "Incorrect credentials!"
        })
    }
});


adminRouter.post("/course",adminMiddleware , async function(req,res){
    const adminId = req.userId; // from middleware

    const {title, description, price, courseId} = req.body;

    const course = await courseModel.create({
        title, description, price , 
        creatorId : adminId,
        courseId : courseId
    })
    res.json({
        message: "course created!",
        courseId : course._id
    })
});
adminRouter.put("/course", adminMiddleware, async function(req,res){
    const adminId = req.userId ;
    const {title, description, price , courseId} = req.body;
    const correctCourseId = await courseModel.findOne({
        _id : courseId,
        creatorId : adminId
    });
    if(!correctCourseId){
        res.json({
            message: "This course is not in your Account!"
        })
    }
    
    const updatedCourse = await courseModel.updateOne({
            _id : courseId,
            creatorId : adminId
        },
    {
        title: title,
        descrption : description,
        price : price
    })
    res.json({
        message : "course updated",
        courseId  : updatedCourse._id
    })
   
        res.status(403).json({
            message : "course is not found!"
        })
    
     
});

adminRouter.get("/course/bulk", adminMiddleware, async function(req, res){
   const adminId = req.userId;
    const courses =  await courseModel.find({
        creatorId  : adminId
    })
   
  
    res.json({
        courses : courses
    })
})

module.exports = {
    adminRouter : adminRouter
}
