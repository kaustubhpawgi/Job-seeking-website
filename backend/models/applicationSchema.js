const mongoose = require('mongoose')
const validator= require('validator')

const applicationSchema= new mongoose.Schema({
    name:{
        type:String,
        required: [true,"Please provide your name!"],
        minLength:[3,"Name must contain atleast 3 characters!"],
        maxLength:[30,"Name cannot exceed 30 characters!"]
    },
    email:{
        type: String,
        validator:[validator.isEmail,"Please provide a valid email!"],
        required:[true, "Please provide your email!"]
    },
    coverLetter:{
        type: String,
        required: [true,"Please provide your cover letter!"]
    },
    phone:{
        type: Number,
        required: [true,"Please provide your phone number!"]
    },
    address:{
        type:String,
        requried: [true,"Please provide your address!"]
    },
    resume:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type: String,
            required: true
        }
    },
    applicantId:{
        user:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        role:{
            type:String,
            enum:["Job Seeker"],
            required:true
        }
    },
    employerId:{
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        role:{
            type: String,
            enum:["Employer"],
            required:true
        }
    }
})
module.exports= mongoose.model("Application",applicationSchema)
