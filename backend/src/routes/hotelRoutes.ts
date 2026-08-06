import { Router } from 'express';
import { HotelController } from '../controllers/hotelController';

const router = Router();

router.get('/', HotelController.searchHotels);

export default router;
