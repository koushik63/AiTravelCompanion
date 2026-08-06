import { Router } from 'express';
import { WeatherController } from '../controllers/weatherController';

const router = Router();

router.get('/current', WeatherController.getCurrentWeather);
router.get('/forecast', WeatherController.getForecast);

export default router;
