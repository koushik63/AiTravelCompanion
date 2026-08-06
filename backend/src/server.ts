import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

import { globalErrorHandler, notFoundHandler } from './middleware/errorMiddleware';
import { apiRateLimiter } from './middleware/rateLimiter';

import authRoutes from './routes/authRoutes';
import profileRoutes from './routes/profileRoutes';
import tripRoutes from './routes/tripRoutes';
import aiRoutes from './routes/aiRoutes';
import mapsRoutes from './routes/mapsRoutes';
import weatherRoutes from './routes/weatherRoutes';
import transportRoutes from './routes/transportRoutes';
import expenseRoutes from './routes/expenseRoutes';
import memoriesRoutes from './routes/memoriesRoutes';
import adminRoutes from './routes/adminRoutes';
import sharingRoutes from './routes/sharingRoutes';
import exportRoutes from './routes/exportRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({ origin: true, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use(apiRateLimiter);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    demoModeActive: true,
    services: {
      supabase: process.env.SUPABASE_URL ? 'configured' : 'demo-auth-active',
      gemini: process.env.GEMINI_API_KEY ? 'configured' : 'fallback-active',
      googleMaps: process.env.GOOGLE_MAPS_API_KEY ? 'configured' : 'fallback-active',
      openWeather: process.env.OPENWEATHER_API_KEY ? 'configured' : 'fallback-active'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/maps', mapsRoutes);
app.use('/api/weather', weatherRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/memories', memoriesRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/share', sharingRoutes);
app.use('/api/export', exportRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`[INFO] [Server]: 🚀 AI Travel Companion Backend running on http://localhost:${PORT}`);
});

export default app;
