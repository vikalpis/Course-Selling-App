const {Router} = require('express');
const { userMiddleware } = require('../middleware/user');
const { courseModel, purchaseModel } = require('../db/db');
const CourseRouter = Router();

CourseRouter.post("/purchase", userMiddleware, async function(req,res){
    const userId = req.userId;
    const courseId = req.body.courseId;

    await purchaseModel.create({
        userId,
        courseId
    })

    res.json({
        message : " you have successfully bought the course "
    })
})

CourseRouter.get("/preview", async function(req,res){
    const courses = await courseModel.find({})
    res.json({
        courses
    })
})

module.exports = {
    CourseRouter : CourseRouter
}