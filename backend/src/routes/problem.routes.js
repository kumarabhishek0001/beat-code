import express from 'express'
import { authMiddleware, checkAdmin } from '../middleware/auth.middleware.js'
import { createProblem, getAllProblems, getAllProblemById, updateProblemById, deleteProblem, getAllProblemSolvedByUser } from '../controllers/problem.controller.js'


const problemRoutes = express.Router()

problemRoutes.post("/create-problem",authMiddleware, checkAdmin, createProblem)

problemRoutes.get("/get-all-problems", authMiddleware, getAllProblems)

problemRoutes.get("/get-problems/:id", authMiddleware, getAllProblemById)

problemRoutes.put("/update-problem/:id", authMiddleware, updateProblemById)

problemRoutes.delete("/delete-problem/:id",authMiddleware, checkAdmin, deleteProblem)

problemRoutes.get("/get-solved-problems", authMiddleware, getAllProblemSolvedByUser)
export default problemRoutes