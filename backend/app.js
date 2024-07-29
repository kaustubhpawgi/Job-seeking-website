const express= require('express');
const app= express();
const cors= require('cors');
const cookieparser= require('cookie-parser');
const fileupload= require('express-fileupload');
const userRouter= require('./routes/userRouter')
const applicationRouter= require('./routes/applicationRouter')
const jobRouter= require('./routes/jobRouter')
const dbConnection= require('./database/dbConnection')
const {errorMiddleware}=require('./middlewares/error')
const bp = require("body-parser");

require('dotenv').config()

app.use(cors({
    origin:[process.env.FRONTEND_URL],
    methods: ['GET','POST','DELETE','PUT'],
    credentials: true
}))
app.use(cookieparser())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(fileupload({
    useTempFiles:true,
    tempFileDir:"/tmp/"
}))

// routes
app.use('/api/v1/user',userRouter)
app.use('/api/v1/application',applicationRouter)  
app.use('/api/v1/job',jobRouter)  
dbConnection()

// app.use(bp.json());
// app.use(bp.urlencoded({ extended: true }));
app.use(errorMiddleware)
module.exports= app;