import { GoogleGenerativeAI } from '@google/generative-ai';
import { Logger } from '../utils/logger';
import { AICacheService } from './AICacheService';
import { AILoggingService } from './AILoggingService';

export class GeminiService {
  private static getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      return new GoogleGenerativeAI(apiKey);
    }
    return null;
  }

  static async generateItinerary(input: any) {
    const cacheKey = `itinerary_${input.destination}_${input.durationDays || 3}_${input.travelStyle || 'Balanced'}`;
    const cached = AICacheService.get(cacheKey);
    if (cached) {
      Logger.info(`Returning cached AI itinerary for ${input.destination}`, 'GeminiService');
      return cached;
    }

    const ai = this.getClient();
    if (!ai) {
      Logger.warn(`Gemini API key missing. Using intelligent fallback engine for ${input.destination}`, 'GeminiService');
      const fallback = this.generateFallbackItinerary(input);
      AICacheService.set(cacheKey, fallback);
      return fallback;
    }

    const startTime = Date.now();
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Act as an expert AI Travel Agent. Create a detailed structured JSON itinerary for ${input.destination} for ${input.durationDays || 3} days.
Travel Style: ${input.travelStyle || 'Balanced'}. Budget: ${input.budget || 50000} ${input.currency || 'INR'}.
Interests: ${input.interests?.join(', ') || 'Sightseeing, Local Cuisine'}.

Return ONLY valid JSON matching this schema:
{
  "tripTitle": "String",
  "destination": "${input.destination}",
  "summary": "String overview",
  "estimatedTotalCost": ${input.budget || 50000},
  "currency": "${input.currency || 'INR'}",
  "days": [
    {
      "dayNumber": 1,
      "date": "2026-08-10",
      "summary": "Day 1 Highlights",
      "morning": [
        { "id": "m1", "time": "09:00 AM", "title": "Morning Activity", "category": "Sightseeing", "cost": 500, "isCompleted": false }
      ],
      "afternoon": [
        { "id": "a1", "time": "01:00 PM", "title": "Afternoon Activity", "category": "Food", "cost": 800, "isCompleted": false }
      ],
      "evening": [
        { "id": "e1", "time": "06:00 PM", "title": "Evening Activity", "category": "Nightlife", "cost": 1200, "isCompleted": false }
      ],
      "dailyEstimatedCost": 2500
    }
  ],
  "recommendedAttractions": [{ "name": "Attraction 1", "category": "Sightseeing", "description": "Desc", "cost": 500 }],
  "recommendedRestaurants": [{ "name": "Bistro", "cuisine": "Local", "priceRange": "Moderate", "location": "${input.destination}" }],
  "recommendedHotels": [{ "name": "Grand Hotel", "style": "Boutique", "pricePerNight": 4000 }],
  "packingList": ["Sunscreen", "Comfortable Shoes", "Camera", "Travel Adapter"],
  "localTips": ["Use local transport apps", "Carry cash for local markets"],
  "safetyTips": ["Keep emergency contacts saved", "Stay hydrated"],
  "weatherConsiderations": "Sunny and pleasant",
  "confidenceNotes": "Generated via Gemini AI Engine v1.5"
}`;

      AILoggingService.logPrompt(prompt);
      const result = await model.generateContent(prompt);
      const text = result.response.text();
      AILoggingService.logResponse('success', Date.now() - startTime);

      const parsed = JSON.parse(text.replace(/```json|```/g, '').trim());
      AICacheService.set(cacheKey, parsed);
      return parsed;
    } catch (err) {
      Logger.error('Gemini AI Generation Error, engaging fallback', err, 'GeminiService');
      return this.generateFallbackItinerary(input);
    }
  }

  static async generatePackingList(input: any) {
    return {
      destination: input.destination,
      travelStyle: input.travelStyle || 'Balanced',
      items: [
        { category: 'Essentials', name: 'Passport / National ID & Tickets', quantity: 1 },
        { category: 'Clothing', name: 'Lightweight Breathable Outfits', quantity: 5 },
        { category: 'Electronics', name: 'Universal Travel Adapter & Powerbank', quantity: 2 },
        { category: 'Toiletries', name: 'SPF 50+ Sunscreen & Hydrating Moisturizer', quantity: 1 },
        { category: 'Footwear', name: 'Comfortable Walking Sneakers', quantity: 1 }
      ]
    };
  }

  static async getBudgetTips(destination: string, budget: number, currency: string = 'INR') {
    return {
      destination,
      suggestedAllocation: {
        accommodation: Math.round(budget * 0.4),
        activities: Math.round(budget * 0.25),
        food: Math.round(budget * 0.2),
        transport: Math.round(budget * 0.15)
      },
      tips: [
        'Book Vande Bharat train tickets 3 weeks prior for 30% savings.',
        'Opt for local thalis and street food hubs for authentic & affordable dining.',
        'Use UPI digital payments across India for quick receipt tracking.'
      ]
    };
  }

  static async suggestPlaces(destination: string, category: string) {
    return [
      { name: `Top Landmark in ${destination}`, category: 'Sightseeing', description: 'Famous tourist highlight with great photo opportunities.', cost: 500 },
      { name: `Famous Bistro in ${destination}`, category: 'Food', description: 'Popular local restaurant serving regional specialties.', cost: 1200 },
      { name: `Cultural Center in ${destination}`, category: 'Culture', description: 'Explore local heritage and traditional performances.', cost: 400 }
    ];
  }

  static async adjustWeather(destination: string, currentWeather: string, activities: any[]) {
    if (currentWeather.toLowerCase().includes('rain')) {
      return activities.map((act) => ({
        ...act,
        title: act.title.includes('Beach') ? `Indoor Museum Visit in ${destination}` : act.title,
        description: 'Adjusted for rainy conditions: indoor covered activity recommended.'
      }));
    }
    return activities;
  }

  private static generateFallbackItinerary(input: any) {
    const daysCount = Number(input.durationDays) || 3;
    const days = Array.from({ length: daysCount }).map((_, i) => ({
      dayNumber: i + 1,
      date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
      summary: `Day ${i + 1}: Exploring Highlights of ${input.destination}`,
      morning: [
        { id: `m_${i}`, time: '09:00 AM', title: `Morning Tour of Central ${input.destination}`, category: 'Sightseeing', cost: 500, isCompleted: false }
      ],
      afternoon: [
        { id: `a_${i}`, time: '01:00 PM', title: `Regional Specialities Lunch at Local Cafe`, category: 'Food', cost: 850, isCompleted: false }
      ],
      evening: [
        { id: `e_${i}`, time: '06:30 PM', title: `Sunset Walk & Local Artisan Market Shopping`, category: 'Leisure', cost: 1200, isCompleted: false }
      ],
      dailyEstimatedCost: 2550
    }));

    return {
      tripTitle: `AI Expedition to ${input.destination}`,
      destination: input.destination,
      summary: `Comprehensive ${daysCount}-day AI-curated travel plan for ${input.destination} customized for ${input.travelStyle || 'Balanced'} travel.`,
      estimatedTotalCost: Number(input.budget) || 45000,
      currency: input.currency || 'INR',
      days,
      recommendedAttractions: [
        { name: `Heritage Fort & Viewpoint in ${input.destination}`, category: 'Sightseeing', description: 'Iconic spot for sunset and photography.', cost: 400 },
        { name: `Artisan Handicraft Bazaar`, category: 'Shopping', description: 'Vibrant local market for souvenirs.', cost: 600 }
      ],
      recommendedRestaurants: [
        { name: `The Spice Route Kitchen`, cuisine: 'Authentic Indian', priceRange: 'Moderate', location: input.destination },
        { name: `Coastal Breeze Cafe`, cuisine: 'Seafood & Cafe', priceRange: 'Budget', location: input.destination }
      ],
      recommendedHotels: [
        { name: `Grand Horizon Resort`, style: 'Boutique Luxury', pricePerNight: 4500 }
      ],
      packingList: [
        'SPF 50+ Sunscreen',
        'Breathable Cotton Clothes',
        'Comfortable Walking Shoes',
        'Power Bank & Charging Cables',
        'First Aid Kit'
      ],
      localTips: [
        'Use UPI digital payments or carry small Indian Rupee notes for local auto-rickshaws.',
        'Early morning visits avoid long tourist queues.'
      ],
      safetyTips: [
        'Keep emergency contacts saved offline.',
        'Drink bottled or purified water while exploring.'
      ],
      weatherConsiderations: 'Pleasant temperatures expected (26°C - 30°C).',
      confidenceNotes: 'Generated via AI Travel Companion Smart Engine (Demo Mode Active).'
    };
  }
}
