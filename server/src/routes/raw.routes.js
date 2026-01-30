import express from 'express'
import { getWeeklySummary } from '../controller/rawDatacontroller.js'


const Rawrouter = express.Router()



Rawrouter.get('/:deviceId', getWeeklySummary)

export default Rawrouter