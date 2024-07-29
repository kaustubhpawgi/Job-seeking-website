const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcrypt')
const jwt= require('jsonwebtoken')


const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Please provide your name!"],
        minLength:[3,"Name must contain atleast 3 characters!"],
        maxLength:[30,"Name must contain atmost 30 characters!"]
    },
    email:{
        type: String,
        requried:[true,"Please provide your email!"],
        validate:[validator.isEmail,"Please provide a valid email!"]
    },
    phone:{
        type:Number,
        required: [true,"Please provide your phone number!"]
    },
    password:{
        type: String,
        required:[true,"Please enter your password!"],
        minLength:[8,"Password must contain atleast 8 characters!"],
        maxLength:[32,"Name must contain atmost 32 characters!"],
        select: false   // now pass wont show in when getting user from email
    },
    role:{
        type: String,
        required: [true,"Please provide your role!"],
        enum: ["Job Seeker","Employer"]
    },
    createdAt:{
        type: Date,
        default: Date.now
    }
})
// encryption hashing the password
userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next()
    }
    this.password= await bcrypt.hash(this.password,10);
})
// comparing password
userSchema.methods.comparePassword= async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password)
}
// generate jwt token for authorization
userSchema.methods.getJWTToken= function (){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET_KEY,{
        expiresIn: process.env.JWT_EXPIRE
    })
}

module.exports= mongoose.model("User",userSchema)