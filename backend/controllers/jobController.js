const catchAsyncError= require('../middlewares/catchAsyncError')
const {ErrorHandler} = require('../middlewares/error')
const Job= require('../models/jobSchema')

const getAllJobs= catchAsyncError(async (req,res,next)=>{
    const jobs = await Job.find({expired:false});
    res.status(200).json({
        success: true,
        jobs
    })
})

const postJob= catchAsyncError(async (req,res,next)=>{
    // const role= req.user.role or below one
    const {role}= req.user                    // we fetch role , this req.user was made in auth file

    if(role==="Job Seeker"){
        return next(new ErrorHandler("Access denied!",400))
    }
    const {title,description,category,country,city,location,fixedSalary,salaryFrom,salaryTo}=req.body;
    if(!title || !description || !category || !country || !city || !location){
        return next(new ErrorHandler("Please provide full job details",400))
    }
    // we must have either fixed sal or ranged sal
    if((!salaryFrom|| !salaryTo) && !fixedSalary){
        return next(new ErrorHandler("Please provide either fixed salary or ranged salary!"))
    }
    // we dont want both, either of them
    if(salaryFrom && salaryTo && fixedSalary){
        return next(new ErrorHandler("Cannot enter fixed salary and ranged salary together!"))
    }
    const postedBy= req.user._id;
    const job= await Job.create({
        title,description,category,country,city,location,fixedSalary,salaryFrom,salaryTo,postedBy
    })
    res.status(200).json({
        success:true,
        message:"Job posted successfully!",
        job
    })
})

const getmyJobs = catchAsyncError(async (req,res,next)=>{
    const {role}= req.user;
    if(role==="Job Seeker"){
        return next(new ErrorHandler("Access denied!",400))
    }
    const myJobs= await Job.find({postedBy: req.user._id})   // using id to uniquely identify jobs posted by some employer
    res.status(200).json({
        success:true,
        myJobs
    })
})

const updateJob = catchAsyncError(async (req,res,next)=>{
    const {role}= req.user;
    if(role==="Job Seeker"){
        return next(new ErrorHandler("Access denied!",400))
    }
    const {id}= req.params
    let job= await Job.findById(id)     // let .. since we might change its values in the future
    if(!job){
        return next(new ErrorHandler("Oops, job not found!",404))
    }
    job = await Job.findByIdAndUpdate(id,req.body,{
        new: true,
        runValidators:true,
        useFindAndModify: false
    })
    res.status(200).json({
        success:true,
        job,
        message:"Job updated successfully!"
    }) 
})

const deleteJob= catchAsyncError(async (req,res,next)=>{
    const {role}= req.user
    if(role==="Job Seeker"){
        return next(new ErrorHandler("Access denied!",400))
    }
    const {id}= req.params
    let job= Job.findById(id)
    if(!job){
        return next(new ErrorHandler("Oops, job not found!",404))
    }
    await job.deleteOne()
    res.status(200).json({
        success: true,
        message: "Job deleted successfully!"
    })
})
module.exports ={getAllJobs,postJob,getmyJobs,updateJob,deleteJob}