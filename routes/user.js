const {Router} = require('express');
const UserRouter = Router();
const { UserModel, courseModel, purchaseModel} = require('../db/db')
const {z} = require ( 'zod');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {JWT_USER_PASSWORD }= require('../config');
const {userMiddleware} = require('../middleware/user')


UserRouter.post("/signUp", async function(req,res){
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
         await UserModel.create({
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

UserRouter.post("/logIn", async function(req,res){
    const {email, password} = req.body;

    const user = await UserModel.findOne({email});

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
        },JWT_USER_PASSWORD);
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



UserRouter.get("/purchases", userMiddleware ,async function(req,res){
    const userId = req.userId;
    const courses = await purchaseModel.find({
        userId,
    })

    const courseData = await purchaseModel.find({
        _id : {$in: courses.map(x=>x.courseId)}
    })
    res.json({
        courses, courseData
    }) 
});


module.exports = {
    UserRouter  :UserRouter
}