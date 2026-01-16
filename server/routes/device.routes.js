import express from 'express'
import { Adddevice, getDevice } from '../controller/Device.controller.js';
import userAuth from '../middelware/userAuth.js';

const DeviceRouter = express()


DeviceRouter.post("/add" ,userAuth,Adddevice );
DeviceRouter.get("/" ,getDevice );

export default DeviceRouter