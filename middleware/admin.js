const jwt = require('jsonwebtoken')
const { JWT_SECRET} = require('../config');

function adminMiddleware(req, res,next){
    const token = req.headers.token;
    const decoded = jwt.verify(token,JWT_SECRET)

    if(decoded){
        req.userId = decoded.id;
        next();
    }else{
        res.status(403).json({
            userId : req.userId,
            message : "You are not logged in!"
        })
    }
}
module.exports=  {
    adminMiddleware
}