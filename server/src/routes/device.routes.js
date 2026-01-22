import express from 'express'
import { Adddevice, getDevice, getMyActiveDevice } from '../controller/Device.controller.js';
import userAuth from '../middelware/userAuth.js';


const DeviceRouter = express()


DeviceRouter.post("/add" ,userAuth,Adddevice );
DeviceRouter.get("/" ,userAuth,getDevice );
// server/routes/Device.routes.js
DeviceRouter.get("/my-device",userAuth, getMyActiveDevice);


export default DeviceRouter