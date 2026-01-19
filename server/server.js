import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import conndb from './src/db/db.js'
import authrouter from '../server/src/routes/auth.routes.js'
import userrouter from './src/routes/user.routes.js'
import  dashboardroute from './src/routes/dahboard.routes.js'
import DeviceRouter from './src/routes/device.routes.js'




console.log("server")
dotenv.config();
const app = express()
const allowedOrigins = [
  'http://localhost:5175',
  'https://aerothermal-fanfronted.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true); // Postman / server calls
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));




const PORT  = process.env.PORT || 4000

app.use(express.json({  strict: false}));
app.use(cookieParser());
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
