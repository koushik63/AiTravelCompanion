import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env') });

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

const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    const allowed = [
      'https://ai-travel-companion-pi.vercel.app',
      'http://localhost:5173',
      'http://localhost:5174',
      process.env.FRONTEND_URL
    ].filter(Boolean);
    // Also allow any *.vercel.app preview deployments
    if (allowed.includes(origin) || origin.endsWith('.vercel.app') || origin.endsWith('.onrender.com')) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: Origin ${origin} not allowed`));
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan('dev'));
app.use(apiRateLimiter);

// Health check
app.get('/api/health', (req, res) => {
  const geminiActive = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '');
  const mapsActive = Boolean(process.env.GOOGLE_MAPS_API_KEY && process.env.GOOGLE_MAPS_API_KEY.trim() !== '');
  const weatherActive = Boolean(process.env.OPENWEATHER_API_KEY && process.env.OPENWEATHER_API_KEY.trim() !== '');
  const supabaseActive = Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_URL.trim() !== '');

  res.json({
    status: 'online',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    demoModeActive: !(geminiActive && mapsActive && weatherActive),
    services: {
      supabase: supabaseActive ? 'configured' : 'demo-auth-active',
      gemini: geminiActive ? 'configured' : 'fallback-active',
      googleMaps: mapsActive ? 'configured' : 'fallback-active',
      openWeather: weatherActive ? 'configured' : 'fallback-active'
    }
  });
});

import hotelRoutes from './routes/hotelRoutes';

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
app.use('/api/hotels', hotelRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/share', sharingRoutes);
app.use('/api/export', exportRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

app.listen(PORT, () => {
  console.log(`[INFO] [Server]: 🚀 AI Travel Companion Backend running on http://localhost:${PORT}`);
});

export default app;
