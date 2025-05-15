import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getAllPlayListDetails, removeProblemFromPlaylist } from '../controllers/playlist.controller.js'

const playListRoutes = express.Router()

playListRoutes.get("/",authMiddleware, getAllListDetails)
playListRoutes.get("/:playlistId",authMiddleware, getAllPlayListDetails)
playListRoutes.post("/create-playlist", authMiddleware, createPlaylist)
playListRoutes.post("/:playlistId/add-problem", authMiddleware, addProblemToPlaylist)
playListRoutes.delete("/:playlistId", authMiddleware, deletePlaylist)
playListRoutes.delete("/:playlistId/remove-problem", authMiddleware, removeProblemFromPlaylist)

export default playListRoutes