import express from 'express'
import { Adddevice, getDevice, getMyActiveDevice } from '../controller/Device.controller.js';



const DeviceRouter = express()


DeviceRouter.post("/add" ,Adddevice );
DeviceRouter.get("/" ,getDevice );
// server/routes/Device.routes.js
DeviceRouter.get("/my-device", getMyActiveDevice);


export default DeviceRouter