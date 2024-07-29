const mongoose= require('mongoose');
const dbConnection = ()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:"JOB_SEEKING_WEBSITE"
    }).then(()=>{
        console.log('Connected to db')
    }).catch((err)=>{
        console.log(`Some error occured while connecting to database: ${err}`)
    })
}
module.exports= dbConnection;