const catchAsyncError= require('../middlewares/catchAsyncError')
const {ErrorHandler}= require('../middlewares/error')
const Application= require('../models/applicationSchema')
const cloudinary = require('cloudinary')
const Job= require('../models/jobSchema')

const employerGetAllApplications = catchAsyncError(async (req,res,next)=>{
    const {role}= req.user
    if(role==="Job Seeker"){
        return next(new ErrorHandler("Access denied!",400))
    }
    const {_id}= req.user;
    const applications = await Application.find({'employerId.user':_id})
    res.status(200).json({
        success:true,
        applications
    })
})

const jobseekerGetAllApplications = catchAsyncError(async (req,res,next)=>{
    const {role}= req.user
    if(role==="Employer"){
        return next(new ErrorHandler("Access denied!",400))
    }
    const {_id}= req.user;
    const applications = await Application.find({'applicantId.user':_id})
    res.status(200).json({
        success:true,
        applications
    })
})

const jobseekerDeleteApplication = catchAsyncError(async (req,res,next)=>{
    const {role}= req.user
    if(role==="Employer"){
        return next(new ErrorHandler("Access denied!",400))
    }
    const {id}= req.params;
    const application = await Application.findById(id)
    if(!application){
        return next(new ErrorHandler("Oops, application not found!",404))
    }
    await application.deleteOne()
    res.status(200).json({
        success:true,
        message: "Application deleted successfully!"
    })
})

const postApplication = catchAsyncError(async (req,res,next)=>{
    const {role}= req.user
    if(role==="Employer"){
        return next(new ErrorHandler("Access denied!",400))
    }
    if(!req.files || Object.keys(req.files).length === 0){
        return next(new ErrorHandler("Resume file required!"))
    }
    const {resume}= req.files
    const allowedFormats = ['image/png','image/jpg','image/webp']
    if(!allowedFormats.includes(resume.mimetype)){
        return next(new ErrorHandler("Invalid file type! Please upload a png, jpg or webp format.",400))
    }
    const cloudinaryResponse = await cloudinary.uploader.upload(
        resume.tempFilePath
    )
    if(!cloudinaryResponse || cloudinaryResponse.error){
        console.error("Cloudinary Error: ",cloudinaryResponse.error || "Unknown cloudinary error!")
        return next(new ErrorHandler("Failed to upload resume!",500))
    }
    const {name,email,coverLetter,phone, address, jobId} = req.body
    const applicantId = {
        user : req.user._id,
        role: "Job Seeker"
    }
    if(!jobId){
        return next(new ErrorHandler("Job not found!",404))
    }
    const jobDetails = await Job.findById(jobId)
    if(!jobDetails){
        return next(new ErrorHandler("Job not found!",404))
    }
    const employerId ={
        user:jobDetails.postedBy,
        role:"Employer"
    }
    if(!name || !email || !coverLetter || !phone || !address || !applicantId || !employerId || !resume){
        return next(new ErrorHandler("Please fill all fields!",400))
    }
    const application = await Application.create({
        name, email, coverLetter, phone, address, applicantId, employerId,
        resume:{
            public_id: cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url
        }
    })
    res.status(200).json({
        success:true,
        message: "Application submitted successfully!",
        application
    })
})

module.exports = {employerGetAllApplications,jobseekerGetAllApplications,jobseekerDeleteApplication,postApplication}