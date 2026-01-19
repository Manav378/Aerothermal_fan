import express from 'express'
import { isAuthenticated, login, logout, register, resetPassword, sendverifyotp, setResetotp, verifyEmail  } from '../controller/auth.controller.js'
import userAuth from '../middelware/userAuth.js';
const authrouter = express.Router()


authrouter.post("/register" , register);
authrouter.post("/login" , login);
authrouter.post("/logout" , logout);
authrouter.post("/send-verify-otp" , userAuth , sendverifyotp);
authrouter.post("/send-verify-account" , userAuth , verifyEmail);
authrouter.get("/is-auth" , userAuth , isAuthenticated);
authrouter.post("/is-setreset"  , setResetotp);
authrouter.post("/is-resetpass"  , resetPassword);



export default authrouter



