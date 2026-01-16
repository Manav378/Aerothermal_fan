import express from 'express'
import userAuth from '../middelware/userAuth.js'
import { getuserdata } from '../controller/usercontroller.js'

const userrouter = express.Router()


userrouter.get("/data" , userAuth , getuserdata)

export default userrouter