import express from 'express'
import dotenv from 'dotenv'
import authRoutes from './routes/auth.routes.js'
import cookieparser from 'cookie-parser'
import problemRoutes from './routes/problem.routes.js'
import executionRoute from './routes/executeCode.routes.js'

dotenv.config()

const port = process.env.PORT
const app = express()

app.get('/',(req,res) => {
    res.send('Welcome to leetlab🔥🛠️')
})

app.use(express.json())
app.use(cookieparser())

app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/problems', problemRoutes)
app.use('/api/v1/execute-code', executionRoute)

app.listen(port, ()=>{
    console.log('server listening to port:', port)
})