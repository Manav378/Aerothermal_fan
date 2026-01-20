import express from 'express'
import { getWeeklyRawData } from '../controller/rawDatacontroller.js'


const Rawrouter = express.Router()



Rawrouter.get('/:deviceId/raw-weekly', getWeeklyRawData)

export default Rawrouter