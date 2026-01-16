// server/routes/dashboard.routes.js
import express from 'express';
import { tempController, rpmController, rpmSliderController, checkpwm, autmode ,sensorController, pwm} from '../controller/dashboard.controller.js';

const router = express.Router();

router.post('/sensor', sensorController);
router.get('/temp', tempController);
router.get('/rpm', rpmController);
router.post('/rpmslider', rpmSliderController);
router.get('/checkpwmslider', checkpwm);
router.post('/automode', autmode);
router.get("/pwm" ,pwm )

export default router;
