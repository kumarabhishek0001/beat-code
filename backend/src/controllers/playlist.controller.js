import { db } from "../libs/db.js";

export const createPlaylist = async(req, res) => {
    try {
        const {name , description} = req.body

        const userId = req.user.id;

        const playlist = await db.playlist.create({
            data: {
                name,
                description,
                userId
            }
        })

        res.status(200).json({
            success : true,
            message : "Playlist created successfully"
        })
    } catch (error) {
        console.error('error creating playlist: ', error)
        res.status(500).json({error: 'Failed to create playlist'})

    }
}
export const getAllListDetails = async(req, res) => {
    try {
        const playlists = await db.playlist.findMany({
            where : {
                userId : req.user.id
            },
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        })

        res.status(200).json({
            success : true,
            message: 'playlist fetched successfully',
            playlists
        })
    } catch (error) {
        console.error('error fetching playlist: ', error)
        res.status(500).json({error: 'Failed to fetch playlist'})
    }
}

export const getAllPlayListDetails = async(req, res) => {
    const {playlistId} = req.params

    try {

         const playlist = await db.playlist.findUnique({
            where : {
                id:playlistId,
                userId : req.user.id
            },
            include:{
                problems:{
                    include:{
                        problem:true
                    }
                }
            }
        })

        if(!playlist){
            return res.status(404).json({
                error: 'playlist not found'
            })
        }

        res.status(200).json({
            success : true,
            message: 'playlist fetched successfully',
            playlist
        })
    } catch (error) {
        console.error('error fetching playlist: ', error)
        res.status(500).json({error: 'Failed to fetch playlist'})
    }
}
export const addProblemToPlaylist = async(req, res) => {
    const {playlistId} = req.params
    const {problemIds} = req.body

    try {
        
        if(!Array.isArray(problemIds) || problemIds.length === 0){
            return res.status(400).json({error: "Invalid or missing problemId"})

        }
        //create records for each problem
        const problemsInPlaylist = await db.ProblemInPlaylist.createMany({
            data: problemIds.map((problemId) => ({
                playlistId,
                problemId
            }))
        })

        res.status(201).json({
            success: true,
            message: 'Problem added in playlist successfully',
            problemsInPlaylist
        })
    } catch (error) {
        console.error('error adding problem', error)

        res.status(500).json({
            message: 'error adding problem',
            success: false
        })
    }
}
export const deletePlaylist = async(req, res) => {
    const {playlistId} = req.params

    try {
        const deletedPlaylist = await db.playlist.delete({
            where : {
                id : playlistId
            }
        })

        res.status(200).json({
            success: true,
            message: 'Playlist Deleted Successfully',
            deletedPlaylist
        })
    } catch (error) {
        console.error('error deleting playlist', error)
        res.status(500).json({error: 'Failed to delete playlist'})
    }
}
export const removeProblemFromPlaylist = async(req, res) => {
    const { playlistId} = req.params
    const {problemIds} = req.body

    try {
        if(!Array.isArray(problemIds) || problemIds.length === 0){
            return res.status(400).json({error: "Invalid or missing problemId"})
        }

        const deletedProblem = await db.ProblemInPlaylist.deleteMany({
            where: {
                playlistId,
                problemId:{
                    in: problemIds
                }
            }
        })

        res.status(200).json({
            success : true,
            message : 'Problem removed from playlist successfully',
            deletedProblem
        })
    } catch (error) {
        console.log("Error removing problem from playlist: ", error)
        res.status(500).json({error: 'Failed to remove problem from playlist'})
    }
}


