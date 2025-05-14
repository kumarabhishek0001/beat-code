import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { getAllSubmission, getAllTheSubmissonForProblem, getSubmissionForProblem } from '../controllers/submission.controller.js'

const submissionRoutes = express.Router()

submissionRoutes.get("/get-all-submissions", authMiddleware, getAllSubmission)
submissionRoutes.get("/get-submissions/:problemId", authMiddleware, getSubmissionForProblem)

submissionRoutes.get("/get-submission-count/:problemId",authMiddleware, getAllTheSubmissonForProblem)


export default submissionRoutes