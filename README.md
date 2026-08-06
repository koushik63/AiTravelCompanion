# ✈️ AI Travel Companion — Production AI Travel Ecosystem

[![CI Build Workflow](https://github.com/example/ai-travel-companion/actions/workflows/ci.yml/badge.svg)](https://github.com/example/ai-travel-companion)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Production Ready](https://img.shields.io/badge/Production-Ready-emerald.svg)](#)

> An end-to-end, production-grade AI Travel Companion powered by **Google Gemini API**, **Supabase Auth**, **OpenWeatherMap**, **AviationStack**, and **Indian Railways Vande Bharat Tracker**.

---

## 🌟 Key Features

- 🤖 **Gemini AI Travel Engine**: Structured day-by-day itineraries (Morning, Afternoon, Evening plans, daily costs, safety tips, packing lists).
- 🗺️ **Interactive Vector Maps & Nearby Explorer**: Google Maps platform abstraction with route visualization and distance calculations.
- 🌤️ **Live OpenWeather Engine**: 4-day climate forecasts, UV index, rain probability, humidity, and sunrise/sunset.
- ✈️ **Flight & Rail Status Tracker**: Live status for flights (`6E 504`, `JL 001`) and trains (`20901 Vande Bharat Express`).
- 💰 **Multi-Currency Budget & Expense Hub**: Expense CRUD, category breakdown analytics, and Gemini financial insights.
- 🎒 **Smart Packing Checklist**: Interactive packing list with category filters and weather recommendations.
- 🔔 **Notification Center**: Flight boarding alerts, weather warnings, budget reminders.
- 💬 **Interactive AI Travel Assistant Chatbot**: Conversational AI assistant with active trip context awareness.
- 📷 **Post-Travel Memory Album & AI Captions**: Gallery grid with auto-generated Gemini captions ("✨ AI Memory Tag").
- 🔗 **Public Trip Sharing & PDF Export**: Tokenized public read-only links (`/share/:token`), QR code preview, and PDF/JSON downloads.
- 🛡️ **Admin Console & Governance**: User management table, trip oversight, audit logs, and feedback reviews.

---

## ⚙️ Architecture & Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide React, Zustand |
| **Backend** | Node.js, Express, TypeScript, Prisma ORM |
| **Database & Auth** | PostgreSQL, Supabase Auth |
| **AI Provider** | Google Gemini API (`@google/generative-ai` v1.5) |
| **External APIs** | OpenWeatherMap, AviationStack, Google Maps Platform |

---

## 🚀 Quick Start (Local Development)

### 1. Clone Repository & Install Dependencies
```bash
git clone https://github.com/example/ai-travel-companion.git
cd "Ai Travel Companion"

# Install Backend Dependencies
cd backend && npm install

# Install Frontend Dependencies
cd ../frontend && npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` in both `backend` and `frontend`:
```bash
# Backend .env
PORT=5000
DATABASE_URL="postgresql://user:pass@localhost:5432/aitravel"
SUPABASE_URL="https://your-supabase-url.supabase.co"
SUPABASE_ANON_KEY="your-supabase-anon-key"
GEMINI_API_KEY="your-gemini-api-key"
```

### 3. Generate Prisma Client & Run Servers
```bash
# Generate Prisma Client
cd backend
npx prisma generate

# Run Backend Express Server
npm run dev

# In a separate terminal, run Frontend Vite Server
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser!

---

## 📜 Documentation

- 📄 [Architecture Specification](docs/ARCHITECTURE.md)
- 🚀 [Deployment Guide (Vercel, Render, Supabase)](docs/DEPLOYMENT.md)
- 🏆 [Hackathon Judge Demo Script](docs/JUDGE_DEMO_SCRIPT.md)

---

## 📄 License
Licensed under the [MIT License](LICENSE).
