// server/routes/dashboard.routes.js
import express from 'express';
import { sensorController, pwmSliderController, autoModeController, pwmStatusController} from '../controller/dashboard.controller.js';
import userAuth from '../middelware/userAuth.js';

const router = express.Router();

router.post('/sensor', sensorController);


router.post("/pwm/:devicekey",userAuth, pwmSliderController);
router.post("/auto/:devicekey",userAuth, autoModeController);
router.get("/pwm-status", pwmStatusController);

export default router;
