# AI Travel Companion — Production Deployment Guide

Guide for deploying **AI Travel Companion** across **Vercel** (Frontend), **Render** (Backend Express), and **Supabase** (Database & Authentication).

---

## 🌐 1. Database & Authentication Setup (Supabase)

1. Create a project on [Supabase Dashboard](https://supabase.com).
2. Go to **Project Settings -> API** and copy:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `DATABASE_URL` (PostgreSQL Connection String)
3. Run Prisma migration:
   ```bash
   cd backend
   npx prisma db push
   ```

---

## 🚀 2. Backend Deployment (Render)

1. Connect your repository to [Render](https://render.com).
2. Create a new **Web Service**:
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
3. Configure Environment Variables in Render:
   - `PORT`: `5000`
   - `DATABASE_URL`: `your_supabase_postgres_url`
   - `SUPABASE_URL`: `your_supabase_url`
   - `SUPABASE_ANON_KEY`: `your_supabase_anon_key`
   - `GEMINI_API_KEY`: `your_gemini_api_key`
   - `OPENWEATHER_API_KEY`: `your_openweather_key`
   - `GOOGLE_MAPS_API_KEY`: `your_google_maps_key`

---

## ⚡ 3. Frontend Deployment (Vercel)

1. Connect your repository to [Vercel](https://vercel.com).
2. Root Directory: `frontend`
3. Framework Preset: `Vite`
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. Environment Variables:
   - `VITE_API_BASE_URL`: `https://your-render-backend-url.onrender.com/api`
   - `VITE_SUPABASE_URL`: `your_supabase_url`
   - `VITE_SUPABASE_ANON_KEY`: `your_supabase_anon_key`

---

## ✅ 4. Verification Checklist

- [x] Test `GET https://your-backend.onrender.com/api/health`
- [x] Test Supabase Auth login & signup
- [x] Test Gemini AI itinerary generation
- [x] Test Live Map & Weather Widgets
