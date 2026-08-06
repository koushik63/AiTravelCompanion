# System Architecture & API Specification

## Architectural Overview
The AI Travel Companion application is built on a clean decoupled full-stack architecture:

`Frontend (React + Vite + TypeScript + Tailwind CSS) → Backend Proxy (Express + TypeScript) → External Services (Gemini AI, Google Maps, OpenWeather, Transport Status)`

---

## Service Proxy Layer
- **`GeminiService`**: Generates structured JSON travel itineraries, packing lists, weather adjustments, and budget tips.
- **`MapsService`**: Proxies Google Places text search, nearby POIs, and routing.
- **`WeatherService`**: Proxies OpenWeather current conditions and 5-day forecasts.
- **`FlightService`**: Proxies AviationStack flight status and gate/terminal tracking.
- **`TrainService`**: Proxies IRCTC & Railway status tracking.
- **`DatabaseService`**: Manages Prisma ORM PostgreSQL models with an in-memory seed fallback store for Demo Mode.

---

## System State Flow
1. **Theme System**: Persisted in `useThemeStore` (`dark` / `light` / `system`).
2. **Global UI Store**: Manages modals, drawers, toasts, and confirmation dialogs via `useUIStore`.
3. **App State Store**: Manages trips, current active trip, and notifications via `useTravelStore`.
