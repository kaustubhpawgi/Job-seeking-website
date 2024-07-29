const express= require('express');
const router= express.Router();
const {getAllJobs, postJob, getmyJobs,updateJob,deleteJob}= require('../controllers/jobController')
const isAuthorized = require('../middlewares/auth')

router.get('/getall',getAllJobs)
router.post('/post',isAuthorized,postJob)   // we can access req.user in postJob from isAuthorized 
router.get('/getmyjobs',isAuthorized,getmyJobs)
router.put('/update/:id',isAuthorized,updateJob)
router.delete('/delete/:id',isAuthorized,deleteJob)

module.exports= router; 