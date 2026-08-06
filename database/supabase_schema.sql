-- Supabase Database Schema Migration Script for AI Travel Companion

-- Create Enums
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');
CREATE TYPE "TripStatus" AS ENUM ('UPCOMING', 'ACTIVE', 'COMPLETED', 'CANCELLED', 'ARCHIVED');
CREATE TYPE "TransportType" AS ENUM ('FLIGHT', 'TRAIN', 'BUS', 'CAR');
CREATE TYPE "NotificationType" AS ENUM ('WEATHER', 'BOARDING', 'ACTIVITY', 'BUDGET', 'SYSTEM');

-- Create User Table
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT NOT NULL UNIQUE,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "provider" TEXT NOT NULL DEFAULT 'email',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Profile Table
CREATE TABLE "Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'email',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create UserPreferences Table
CREATE TABLE "UserPreferences" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL UNIQUE REFERENCES "User"("id") ON DELETE CASCADE,
    "preferredCurrency" TEXT NOT NULL DEFAULT 'INR',
    "travelStyle" TEXT NOT NULL DEFAULT 'Balanced',
    "theme" TEXT NOT NULL DEFAULT 'dark',
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true
);

-- Create UserSession Table
CREATE TABLE "UserSession" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "token" TEXT NOT NULL UNIQUE,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create SavedPlace Table
CREATE TABLE "SavedPlace" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 4.5,
    "lat" DOUBLE PRECISION NOT NULL,
    "lng" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Trip Table
CREATE TABLE "Trip" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "country" TEXT DEFAULT 'India',
    "city" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "budget" DOUBLE PRECISION NOT NULL,
    "spent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "coverImage" TEXT,
    "status" "TripStatus" NOT NULL DEFAULT 'UPCOMING',
    "travelType" TEXT DEFAULT 'Balanced',
    "transportType" TEXT DEFAULT 'Flight',
    "accommodation" TEXT,
    "description" TEXT,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "isArchived" BOOLEAN NOT NULL DEFAULT false,
    "archivedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create ItineraryDay Table
CREATE TABLE "ItineraryDay" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL REFERENCES "Trip"("id") ON DELETE CASCADE,
    "dayNumber" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "summary" TEXT
);

-- Create Activity Table
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "itineraryDayId" TEXT NOT NULL REFERENCES "ItineraryDay"("id") ON DELETE CASCADE,
    "time" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "lat" DOUBLE PRECISION,
    "lng" DOUBLE PRECISION,
    "category" TEXT NOT NULL DEFAULT 'Sightseeing',
    "cost" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false
);

-- Create PackingItem Table
CREATE TABLE "PackingItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL REFERENCES "Trip"("id") ON DELETE CASCADE,
    "category" TEXT NOT NULL DEFAULT 'General',
    "itemName" TEXT NOT NULL,
    "isPacked" BOOLEAN NOT NULL DEFAULT false,
    "quantity" INTEGER NOT NULL DEFAULT 1
);

-- Create Expense Table
CREATE TABLE "Expense" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL REFERENCES "Trip"("id") ON DELETE CASCADE,
    "category" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Memory Table
CREATE TABLE "Memory" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL REFERENCES "Trip"("id") ON DELETE CASCADE,
    "imageUrl" TEXT NOT NULL,
    "caption" TEXT,
    "aiCaption" TEXT,
    "location" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create TransportTicket Table
CREATE TABLE "TransportTicket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tripId" TEXT NOT NULL REFERENCES "Trip"("id") ON DELETE CASCADE,
    "type" "TransportType" NOT NULL DEFAULT 'FLIGHT',
    "carrierNumber" TEXT NOT NULL,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "departureTime" TIMESTAMP(3) NOT NULL,
    "arrivalTime" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'On Time',
    "terminal" TEXT,
    "gate" TEXT,
    "platform" TEXT
);

-- Create Notification Table
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'SYSTEM',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create Feedback Table
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL REFERENCES "User"("id") ON DELETE CASCADE,
    "rating" INTEGER NOT NULL,
    "comment" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create SystemLog Table
CREATE TABLE "SystemLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "level" TEXT NOT NULL DEFAULT 'INFO',
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
