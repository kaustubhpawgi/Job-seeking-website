const catchAsyncError= require('../middlewares/catchAsyncError')
const {ErrorHandler} = require('../middlewares/error')
const User= require('../models/userSchema')
const sendToken= require('../utils/jwtToken')
const register = catchAsyncError(async (req,res,next)=>{
    const {name,email,phone,role,password}= req.body;
    if(!name || !email || !phone || !role || !password){
        return next(new ErrorHandler("Please fill all the required details!"));
    }
    const isEmail= await User.findOne({email});
    if(isEmail){
        return next(new ErrorHandler("Email already exists, choose another email!"))
    }
    const user = await User.create({
        name,email,phone,role,password
    })
    sendToken(user,200,res,"User registered successfully!")
})

const login = catchAsyncError(async(req,res,next)=>{
    const{email,password,role}= req.body;
    if(!email || !password || !role){
        return next(new ErrorHandler("Please enter the necessary credentials!",400))
    }
    const user= await User.findOne({email}).select("+password");
    if(!user){
        return next(new ErrorHandler("Invalide email or password!",400))    // SECURITY PURPOSE we dont mention that email or pass which is wrong
    }
    const isPasswordMatched= await user.comparePassword(password);
    if(!isPasswordMatched){
        return next(new ErrorHandler("Invalide email or password!",400))
    }
    if(user.role!==role){
        return next(new ErrorHandler("User with this role not found!",400))
    }
    sendToken(user,200,res,"User logged in successfully!")
})

const logout = catchAsyncError(async(req,res,next)=>{
    res.status(201).cookie("token","",{
        httpOnly: true,
        expires: new Date(Date.now())
    }).json({
        success:true,
        message: "User logged out successfully!"
    })
})

const getUser = catchAsyncError((req,res,next)=>{
    const user= req.user
    res.status(200).json({
        success:true,
        user
    })
})
module.exports= {register,login,logout,getUser}