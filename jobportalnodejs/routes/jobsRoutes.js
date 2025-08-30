import express from 'express'
import userAuth from '../middlewares/authMiddleware.js'
import { createJobController, deleteJobController, getAllJobsController, jobStatsController, updateJobController } from '../controllers/jobsController.js'

const router = express.Router()

//route
router.post('/create-job', userAuth, createJobController)
router.get('/get-job', userAuth, getAllJobsController)

//Update Jobs || Put || Patch
router.patch('/update-job/:id', userAuth, updateJobController)

//Delete Jobs || Delete
router.delete('/delete-job/:id', userAuth, deleteJobController)

//Jobs STATS FILTER || GET
router.get('/job-stats', userAuth, jobStatsController)


export default router
