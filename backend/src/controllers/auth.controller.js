import bcrypt from 'bcryptjs'
import {db} from '../libs/db.js'
import { UserRole } from '../generated/prisma/index.js'
import jwt from 'jsonwebtoken'


    
export const register = async(req, res) => {

    //get data from db 
    const {email, name, password} = req.body
    
    try {
        const existingUser = await db.user.findUnique({
            where : {
                email
            }
        })
        
        if(existingUser){
            return res.status(400).json({
                error : "User already exists"
            })
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)
        
        const newUser = await db.user.create({
            data : {
                email,
                password: hashedPassword,
                name,
                role: UserRole.USER
            }
        })
    
        const token = jwt.sign({id : newUser.id}, process.env.JWT_SECRET, {
            expiresIn : "7d"
        })
    
        res.cookie("jwt", token, {
            httponly : true,
            sameside : "strict",
            secure : process.env.NODE_ENV !== "development",
            maxAge : 1000 * 60 * 60 * 24 * 7 // max age = 7days 
    
        })
    
        res.status(201).json({
            message : 'user created successfully',
            user : {
                id : newUser.id,
                email : newUser.email,
                name : newUser.role,
                role : newUser.role,
                jwt: token
            }
        })
        } catch (error) {
            console.error('error registering the user in auth.controller.js', error)
            res.status(500).json({
                success : false,
                message : 'something went wrong',
                error
            })
        }
}

export const login = async(req, res) => {

}
export const logout = async(req, res) => {

}
export const check = async(req, res) => {

}