const express= require('express');
const router= express.Router();
const {employerGetAllApplications,jobseekerGetAllApplications,jobseekerDeleteApplication,postApplication} = require('../controllers/applicationController')
const isAuthorized = require('../middlewares/auth')
router.get('/employer/getall',isAuthorized,employerGetAllApplications).get('/jobseeker/getall',isAuthorized,jobseekerGetAllApplications)
router.delete('/delete/:id',isAuthorized,jobseekerDeleteApplication)
router.post('/post',isAuthorized,postApplication)


module.exports= router; 