import jwt from 'jsonwebtoken'
import {db} from '../libs/db.js'

export const authMiddleware = async(req, res, next)=>{
    try {
        const token = req.cookies.jwt

        if(!token){
            console.log('here1')
            return res.status(401).json({
                message: "Unauthorized - No token provided",
                success: false
            })
        }
        // console.log('here2')
        let decoded;
        try {
            // console.log('here3')
            decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log(decoded)
        } catch (err) {
            // console.log('here4')
            return res.status(401).json({
                message: "Unauthorized - Invallid token, error in verifying"
            })
        }
        // console.log('here5')
        const user = await db.user.findUnique({
            where: {
                id: decoded.id
            },
            select:{
                id: true,
                image: true,
                name: true,
                email: true,
                role: true
            }
        })
        // console.log('here6')
        if(!user){
            // console.log('here7')
            return res.status(401).json({
                success: false,
                message: "error in authMiddleware, user not found",
            })
        }

        // console.log('here8')
        req.user = user
        next()
    } catch (error) {
        console.log(9,error)
        return res.status(401).json({
            success: false,
            message: "error in authMiddleware, user not found, catch last",
            error
        })
    }
}


export const checkAdmin = async (req, res, next) =>{
    try {
        const userId = req.user.id
    const user = await db.user.findUnique({
        where: {
            id: userId
        },
        select:{
            role: true
        }
    })

    if(!user || user.role !== "ADMIN"){
        return res.status(403).json({
            message: "Access Denied - Admins only"
        })
    }

    next()

    } catch (error) {
        console.error("error in admin check in auth.middlware.js")
        return res.status(401).json({
            message: "error checking admin role"
        })
    }
}