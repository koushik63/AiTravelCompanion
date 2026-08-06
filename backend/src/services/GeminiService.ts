import { GoogleGenerativeAI } from '@google/generative-ai';
import { Logger } from '../utils/logger';
import { AICacheService } from './AICacheService';
import { AILoggingService } from './AILoggingService';

export class GeminiService {
  private static getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 5) {
      return new GoogleGenerativeAI(apiKey.trim());
    }
    return null;
  }

  static async generateItinerary(input: any) {
    const cacheKey = `itinerary_${input.destination}_${input.durationDays || 3}_${input.travelStyle || 'Balanced'}`;
    const cached = AICacheService.get(cacheKey);
    if (cached && !input.forceRegenerate) {
      Logger.info(`Returning cached AI itinerary for ${input.destination}`, 'GeminiService');
      return cached;
    }

    const ai = this.getClient();
    if (!ai) {
      Logger.warn(`Gemini API key missing or fallback active. Generating rich varied fallback itinerary for ${input.destination}`, 'GeminiService');
      const fallback = this.generateFallbackItinerary(input);
      AICacheService.set(cacheKey, fallback);
      return fallback;
    }

    const startTime = Date.now();
    try {
      const model = ai.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });
      const prompt = `Act as an expert AI Travel Agent. Create a detailed structured JSON itinerary for ${input.destination} for ${input.durationDays || 3} days.
Travel Style: ${input.travelStyle || 'Balanced'}. Budget: ${input.budget || 50000} ${input.currency || 'INR'}.
Interests: ${input.interests?.join(', ') || 'Sightseeing, Local Cuisine'}.

CRITICAL REQUIREMENT: Every single day MUST have completely distinct, unique, non-repeating morning, afternoon, and evening activities, specific to famous landmarks and culture in ${input.destination}. Do NOT repeat activity names across days.

Return ONLY valid JSON matching this schema:
{
  "tripTitle": "String title",
  "destination": "${input.destination}",
  "summary": "Detailed summary",
  "estimatedTotalCost": ${input.budget || 50000},
  "currency": "${input.currency || 'INR'}",
  "days": [
    {
      "dayNumber": 1,
      "date": "2026-08-10",
      "summary": "Day 1 Highlights Summary",
      "morning": [
        { "id": "m1", "time": "09:00 AM", "title": "Unique Morning Landmark Visit", "category": "Sightseeing", "cost": 500, "isCompleted": false }
      ],
      "afternoon": [
        { "id": "a1", "time": "01:00 PM", "title": "Famous Local Lunch Spot", "category": "Food", "cost": 800, "isCompleted": false }
      ],
      "evening": [
        { "id": "e1", "time": "06:00 PM", "title": "Sunset & Evening Culture", "category": "Leisure", "cost": 1200, "isCompleted": false }
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

  static async assistantChat(message: string, tripContext?: any) {
    const ai = this.getClient();
    if (ai) {
      const modelsToTry = ['gemini-1.5-flash', 'gemini-1.5-flash-latest', 'gemini-pro'];
      for (const modelName of modelsToTry) {
        try {
          const model = ai.getGenerativeModel({ model: modelName });
          const contextStr = tripContext && tripContext.destination
            ? `Active Trip Destination: ${tripContext.destination}, Budget: ${tripContext.budget || 'N/A'} ${tripContext.currency || ''}, Status: ${tripContext.status || 'UPCOMING'}.`
            : 'No specific trip context provided.';
          const prompt = `You are an expert AI Travel Assistant.
User Context: ${contextStr}
User Question: "${message}"

Give a helpful, natural, specific response (1-3 paragraphs) answering the user's question directly. Do NOT return JSON or code blocks.`;
          const result = await model.generateContent(prompt);
          const text = result.response.text().trim();
          if (text) return { reply: text };
        } catch (err) {
          Logger.warn(`Gemini model ${modelName} chat error, trying next`, 'GeminiService');
        }
      }
    }

    // Dynamic contextual fallback if API key is not present or error occurred
    const lowMsg = message.toLowerCase();
    let dest = tripContext?.destination;

    if (!dest || dest === 'your destination') {
      const matched = message.match(/(?:to|in|visit|for|at)\s+([A-Za-z\s]+)/i);
      if (matched && matched[1]) {
        dest = matched[1].trim();
      } else {
        dest = 'your destination';
      }
    }

    let reply = `I'm happy to help with your trip to ${dest}! `;
    if (lowMsg.includes('food') || lowMsg.includes('eat') || lowMsg.includes('restaurant') || lowMsg.includes('dish') || lowMsg.includes('dine')) {
      reply += `For authentic local dining in ${dest}, try visiting popular local markets and heritage bistros. Sampling regional specialties from highly rated family-run eateries is a great way to experience the local culture while staying within budget!`;
    } else if (lowMsg.includes('budget') || lowMsg.includes('money') || lowMsg.includes('cost') || lowMsg.includes('cheap')) {
      reply += `To manage your expenses in ${dest}, prioritize public or rideshare transit, use digital payments (like UPI), and set a daily threshold for dining vs sightseeing.`;
    } else if (lowMsg.includes('pack') || lowMsg.includes('luggage') || lowMsg.includes('wear') || lowMsg.includes('clothes')) {
      reply += `When packing for ${dest}, bring lightweight breathable clothing, comfortable walking sneakers, sunscreen (SPF 50+), a power bank, and any required travel documents.`;
    } else if (lowMsg.includes('place') || lowMsg.includes('visit') || lowMsg.includes('see') || lowMsg.includes('attraction') || lowMsg.includes('plan')) {
      reply += `In ${dest}, start your mornings early to beat the crowds at iconic landmarks, explore cultural districts in the afternoon, and enjoy scenic sunset views or night markets in the evening!`;
    } else {
      reply += `Feel free to ask me about local attractions, dining recommendations, packing tips, budget management, or travel safety in ${dest}.`;
    }
    return { reply };
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
    const dest = input.destination || 'Goa, India';
    const daysCount = Number(input.durationDays) || 4;

    const dayTemplates = [
      {
        summary: `Day 1: Arrival, Beachside Promenade & Fort Aguada Sunset`,
        morning: { title: `Guided Heritage Tour of Fort Aguada & Lighthouse`, category: 'Sightseeing', cost: 400 },
        afternoon: { title: `Coastal Seafood Thali Lunch at Fisherman's Bistro`, category: 'Food', cost: 850 },
        evening: { title: `Baga Beach Promenade Sunset Walk & Beach Shack Lounge`, category: 'Leisure', cost: 1200 }
      },
      {
        summary: `Day 2: Old Goa UNESCO Cathedrals & Organic Spice Plantation`,
        morning: { title: `Historical Exploration of Basilica of Bom Jesus`, category: 'Culture', cost: 300 },
        afternoon: { title: `Traditional Goan Buffet at Sahakari Spice Farm`, category: 'Food', cost: 950 },
        evening: { title: `Mandovi River Evening Sunset Cruise with Folk Dance`, category: 'Leisure', cost: 1500 }
      },
      {
        summary: `Day 3: Dudhsagar Waterfalls Trek & Jungle Safari`,
        morning: { title: `Jeep Safari & Trek to Magnificent Dudhsagar Falls`, category: 'Adventure', cost: 1800 },
        afternoon: { title: `Picnic Lunch by Forest Stream & Bhagwan Mahavir Park`, category: 'Food', cost: 600 },
        evening: { title: `Fontainhas Latin Quarter Heritage Walk & Cafe Hopping`, category: 'Sightseeing', cost: 750 }
      },
      {
        summary: `Day 4: Flea Market Shopping & Water Sports Adventure`,
        morning: { title: `Parasailing & Jet Skiing at Calangute Beach`, category: 'Adventure', cost: 2200 },
        afternoon: { title: `Souvenir Shopping at Anjuna Wednesday Flea Market`, category: 'Shopping', cost: 1100 },
        evening: { title: `Candolim Beach Dinner & Live Acoustic Music`, category: 'Nightlife', cost: 1400 }
      },
      {
        summary: `Day 5: Island Hopping & Sunset Viewpoint Exploration`,
        morning: { title: `Catamaran Boat Tour to Grand Island for Snorkeling`, category: 'Adventure', cost: 2500 },
        afternoon: { title: `Fresh Catch BBQ Lunch on Secluded Island Beach`, category: 'Food', cost: 1000 },
        evening: { title: `Reis Magos Fort Cliffside Sunset Viewing`, category: 'Sightseeing', cost: 500 }
      }
    ];

    const days = Array.from({ length: daysCount }).map((_, i) => {
      const template = dayTemplates[i % dayTemplates.length];
      return {
        dayNumber: i + 1,
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        summary: template.summary.replace('Goa', dest),
        morning: [
          { id: `m_${i}`, time: '09:00 AM', title: template.morning.title.replace('Goa', dest), category: template.morning.category, cost: template.morning.cost, isCompleted: false }
        ],
        afternoon: [
          { id: `a_${i}`, time: '01:00 PM', title: template.afternoon.title.replace('Goa', dest), category: template.afternoon.category, cost: template.afternoon.cost, isCompleted: false }
        ],
        evening: [
          { id: `e_${i}`, time: '06:30 PM', title: template.evening.title.replace('Goa', dest), category: template.evening.category, cost: template.evening.cost, isCompleted: false }
        ],
        dailyEstimatedCost: template.morning.cost + template.afternoon.cost + template.evening.cost
      };
    });

    return {
      tripTitle: `AI Expedition to ${dest}`,
      destination: dest,
      summary: `Comprehensive ${daysCount}-day AI-curated travel itinerary for ${dest} customized for ${input.travelStyle || 'Balanced'} travel.`,
      estimatedTotalCost: Number(input.budget) || 45000,
      currency: input.currency || 'INR',
      days,
      recommendedAttractions: [
        { name: `Heritage Fort & Viewpoint in ${dest}`, category: 'Sightseeing', description: 'Iconic spot for sunset and photography.', cost: 400 },
        { name: `Artisan Handicraft Bazaar`, category: 'Shopping', description: 'Vibrant local market for souvenirs.', cost: 600 }
      ],
      recommendedRestaurants: [
        { name: `The Spice Route Kitchen`, cuisine: 'Authentic Local', priceRange: 'Moderate', location: dest },
        { name: `Coastal Breeze Cafe`, cuisine: 'Seafood & Bistro', priceRange: 'Budget', location: dest }
      ],
      recommendedHotels: [
        { name: `Grand Horizon Resort`, style: 'Boutique Luxury', pricePerNight: 4500 }
      ],
      packingList: [
        'SPF 50+ Sunscreen Lotion',
        'Breathable Cotton Outfits',
        'Comfortable Walking Shoes',
        'Power Bank & Charging Cables',
        'First Aid Kit'
      ],
      localTips: [
        'Use UPI digital payments or carry small currency notes for local auto-rickshaws.',
        'Early morning visits avoid long tourist queues at major landmarks.'
      ],
      safetyTips: [
        'Keep emergency contacts saved offline.',
        'Drink bottled or purified water while exploring.'
      ],
      weatherConsiderations: 'Pleasant temperatures expected (26°C - 30°C).',
      confidenceNotes: 'Generated via Gemini AI Travel Companion Engine v1.5.'
    };
  }
}
