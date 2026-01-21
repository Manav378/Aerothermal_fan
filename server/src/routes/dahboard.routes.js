// server/routes/dashboard.routes.js
import express from 'express';
import { sensorController, pwmSliderController, autoModeController, pwmStatusController} from '../controller/dashboard.controller.js';

const router = express.Router();

router.post('/sensor', sensorController);


router.post("/pwm/:devicekey", pwmSliderController);
router.post("/auto/:devicekey", autoModeController);
router.get("/pwm-status", pwmStatusController);

export default router;
