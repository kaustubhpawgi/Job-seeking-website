const catchAsyncError= require('./catchAsyncError')
const {ErrorHandler}= require('../middlewares/error')
const jwt= require('jsonwebtoken')
const User = require('../models/userSchema')
const isAuthorized = catchAsyncError(async(req,res,next)=>{
    const {token}= req.cookies;
    if(!token){
        return next(new ErrorHandler("User not authorized!",400))
    }
    const decoded= jwt.verify(token,process.env.JWT_SECRET_KEY)
    req.user = await User.findById(decoded.id);
    next();
})
module.exports= isAuthorized