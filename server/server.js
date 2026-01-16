import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import conndb from "./db/db.js"
import authrouter from './routes/auth.routes.js'
import userrouter from './routes/user.routes.js'
import  dashboardroute from './routes/dahboard.routes.js'
import DeviceRouter from './routes/device.routes.js'

console.log("server")
dotenv.config();
const app = express()
const PORT  = process.env.PORT || 4000
app.use(express.json());
const allowedOrigin  = ['http://localhost:5175']
app.use(express.json({  strict: false}));
app.use(cookieParser());
app.use(cors({origin:allowedOrigin,credentials:true}));
conndb()

app.get("/" , (req,res)=>{
    res.status(200).send("API working")
})
app.use('/api/dashboard', dashboardroute)
app.use("/api/auth",authrouter)
app.use("/api/device" , DeviceRouter)
app.use("/api/user",userrouter)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
