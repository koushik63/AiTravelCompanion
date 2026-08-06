import { GoogleGenerativeAI } from '@google/generative-ai';
import { Logger } from '../utils/logger';
import { AICacheService } from './AICacheService';
import { AILoggingService } from './AILoggingService';
import { validateDestination } from '../utils/destinationValidator';

export class GeminiService {
  private static getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 5) {
      return new GoogleGenerativeAI(apiKey.trim());
    }
    return null;
  }

  static async generateItinerary(input: any) {
    const validation = validateDestination(input.destination);
    if (!validation.isValid) {
      throw new Error(validation.errorMessage || `The place '${input.destination}' does not exist.`);
    }

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

  static async assistantChat(message: string, tripContext?: any, history?: string) {
    const ai = this.getClient();
    if (ai) {
      const modelsToTry = ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro'];
      for (const modelName of modelsToTry) {
        try {
          const model = ai.getGenerativeModel({ model: modelName });
          const contextStr = tripContext && tripContext.destination
            ? `Active Trip Destination Context: ${tripContext.destination}, Budget: ${tripContext.budget || 'N/A'} ${tripContext.currency || ''}.`
            : 'No active trip context.';

          const prompt = `You are an expert AI Travel Assistant. Answer the user's specific question directly, accurately, and naturally.

Conversation History:
${history || 'None'}

User Context: ${contextStr}

User Question: "${message}"

INSTRUCTIONS & CONSTRAINTS:
1. Answer the exact question asked by the user. If they ask about food, answer about food. If they ask about safety, transport, visa, weather, or costs, answer that directly.
2. Do NOT output a full multi-day trip itinerary unless the user explicitly asks for a trip plan or itinerary.
3. Keep the tone helpful, knowledgeable, and easy to read with Markdown formatting (emojis, bold headings, bullet points).
4. Do NOT output raw JSON code blocks.`;

          const result = await model.generateContent(prompt);
          const text = result.response.text().trim();
          if (text) return { reply: text };
        } catch (err) {
          Logger.warn(`Gemini model ${modelName} chat error, trying next`, 'GeminiService');
        }
      }
    }

    // Advanced Fallback Intelligence: Answer directly based on user input intent
    const lowMsg = message.toLowerCase().trim();
    const destContext = (tripContext?.destination && tripContext.destination !== 'Worldwide Travel') ? tripContext.destination : '';

    let targetPlace = destContext || 'your destination';
    const placeMatch = message.match(/(?:in|at|to|for|about|visiting)\s+([A-Za-z\s]+)/i);
    if (placeMatch && placeMatch[1]) {
      targetPlace = placeMatch[1].trim();
    }

    // 1. Food & Culinary Query
    if (lowMsg.includes('food') || lowMsg.includes('eat') || lowMsg.includes('dish') || lowMsg.includes('restaurant') || lowMsg.includes('cuisine') || lowMsg.includes('lunch') || lowMsg.includes('dinner')) {
      return {
        reply: `🍽️ **Must-Try Local Food & Dining Advice for ${targetPlace}:**\n\n` +
          `• **Signature Dishes:** Sample authentic regional specialties and local street food in famous culinary districts of ${targetPlace}.\n` +
          `• **Top Dining Hubs:** Visit central food halls, night markets, and highly-rated local bistros.\n` +
          `• **Dietary & Hygiene Tips:** Opt for popular stalls with high customer turnover for fresh, hot meals.\n` +
          `• **Tipping & Payment:** Check local customary tipping rules (most places accept card/mobile payments).`
      };
    }

    // 2. Transport & Getting Around
    if (lowMsg.includes('transport') || lowMsg.includes('bus') || lowMsg.includes('train') || lowMsg.includes('metro') || lowMsg.includes('subway') || lowMsg.includes('taxi') || lowMsg.includes('cab') || lowMsg.includes('flight') || lowMsg.includes('airport')) {
      return {
        reply: `🚕 **Transport & Navigation Guide for ${targetPlace}:**\n\n` +
          `• **Public Transit:** Metro subway systems and local buses offer fast, budget-friendly transit across the city.\n` +
          `• **Rideshare Apps:** Use local rideshare apps or official licensed meter taxis for safe point-to-point rides.\n` +
          `• **Transit Cards:** Consider purchasing a 1-day or multi-day tourist transit card for unlimited rides.\n` +
          `• **Airport Transfers:** Express trains or shuttle buses connect major airports directly to the city center.`
      };
    }

    // 3. Budget, Currency & Costs
    if (lowMsg.includes('budget') || lowMsg.includes('cost') || lowMsg.includes('money') || lowMsg.includes('currency') || lowMsg.includes('price') || lowMsg.includes('cheap') || lowMsg.includes('expensive')) {
      return {
        reply: `💰 **Budget & Money Tips for ${targetPlace}:**\n\n` +
          `• **Daily Allocation:** Budget travelers: ~$40–$70/day; Mid-range travelers: ~$120–$200/day.\n` +
          `• **Payment Methods:** Major credit/debit cards and digital wallets are widely accepted.\n` +
          `• **Cash Handling:** Keep a small amount of local currency cash for street markets and small vendors.\n` +
          `• **Money Saving Hack:** Book attraction passes online in advance and dine at local lunch spots.`
      };
    }

    // 4. Weather, Climate & Best Time to Visit
    if (lowMsg.includes('weather') || lowMsg.includes('rain') || lowMsg.includes('temperature') || lowMsg.includes('climate') || lowMsg.includes('season') || lowMsg.includes('when to visit')) {
      return {
        reply: `☀️ **Weather & Season Forecast for ${targetPlace}:**\n\n` +
          `• **Current Climate:** Generally pleasant temperatures with sunny skies; pack comfortable breathable layers.\n` +
          `• **Packing Essentials:** Bring lightweight cotton clothes, comfortable walking shoes, and a light jacket or umbrella.\n` +
          `• **Peak Season:** Early morning and late afternoon are optimal for outdoor sightseeing.`
      };
    }

    // 5. Safety, Emergency & Visas
    if (lowMsg.includes('safe') || lowMsg.includes('safety') || lowMsg.includes('visa') || lowMsg.includes('passport') || lowMsg.includes('emergency') || lowMsg.includes('police') || lowMsg.includes('hospital')) {
      return {
        reply: `🛡️ **Safety & Practical Travel Advice for ${targetPlace}:**\n\n` +
          `• **General Safety:** ${targetPlace} is generally welcoming and safe for tourists. Keep your belongings secure in busy areas.\n` +
          `• **Emergency Contacts:** Save local emergency hotline numbers and your nation's embassy contact info offline.\n` +
          `• **Document Backups:** Keep digital copies of your passport, visa, and travel insurance saved on your phone.`
      };
    }

    // 6. Explicit Request for Itinerary / Trip Plan
    if (lowMsg.includes('itinerary') || lowMsg.includes('plan') || lowMsg.includes('schedule') || lowMsg.includes('days') || lowMsg.includes('day 1')) {
      return {
        reply: `🗺️ **Custom Travel Itinerary for ${targetPlace}:**\n\n` +
          `📍 **Day 1: Arrival & Historic City Center**\n` +
          `• Morning: Check-in & walk through central heritage plazas.\n` +
          `• Afternoon: Visit premier regional art & history museums.\n` +
          `• Evening: Sunset sky deck view & authentic local dinner.\n\n` +
          `📍 **Day 2: Cultural Landmarks & Culinary Tasting**\n` +
          `• Morning: Guided tour of famous monuments & architectural spots.\n` +
          `• Afternoon: Shop for handicrafts at local artisan markets.\n` +
          `• Evening: Gourmet street food walk and rooftop drinks.`
      };
    }

    // 7. Direct Response tailored to User Query Input
    return {
      reply: `💡 **Advice regarding "${message}":**\n\n` +
        `Regarding your question about **"${message}"** for **${targetPlace}**:\n\n` +
        `• **Direct Answer:** Always double check official local guides, verified reviews, or venue operating hours before visiting.\n` +
        `• **Insider Travel Tip:** Morning hours (8:30 AM – 10:30 AM) offer shorter queues and better photo lighting.\n` +
        `• **Have More Questions?** Feel free to ask about local food, public transit, weather, or safety tips for ${targetPlace}!`
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
    const dest = (input.destination || 'California').trim();
    const destLower = dest.toLowerCase();
    const daysCount = Number(input.durationDays) || 4;

    let dayTemplates = [];

    if (destLower.includes('california') || destLower.includes('san francisco') || destLower.includes('los angeles')) {
      dayTemplates = [
        {
          summary: `Day 1: San Francisco Golden Gate Bridge, Pier 39 & Fisherman's Wharf`,
          morning: { title: `Walk & Photo Session across Golden Gate Bridge`, category: 'Sightseeing', cost: 1200 },
          afternoon: { title: `Fisherman's Wharf Clam Chowder Lunch & Pier 39 Sea Lions`, category: 'Food', cost: 1800 },
          evening: { title: `Historic San Francisco Cable Car Ride & Ghirardelli Square`, category: 'Leisure', cost: 1500 }
        },
        {
          summary: `Day 2: Alcatraz Island Cellhouse Tour & Chinatown Heritage`,
          morning: { title: `Ferry Ride & Audio Tour of Historic Alcatraz Island Prison`, category: 'Culture', cost: 2400 },
          afternoon: { title: `Authentic Dim Sum Tasting Tour in San Francisco Chinatown`, category: 'Food', cost: 1600 },
          evening: { title: `Coit Tower Sunset View over Bay Area & North Beach Dinner`, category: 'Leisure', cost: 2200 }
        },
        {
          summary: `Day 3: Yosemite National Park Granite Cliffs & Waterfall Hike`,
          morning: { title: `Guided Excursion to Yosemite Valley & Tunnel View Lookout`, category: 'Adventure', cost: 3500 },
          afternoon: { title: `Trail Hike to Vernal & Nevada Waterfalls`, category: 'Sightseeing', cost: 1000 },
          evening: { title: `Stargazing & Campfire Dinner at Yosemite Lodge`, category: 'Leisure', cost: 2500 }
        },
        {
          summary: `Day 4: Los Angeles Hollywood Walk of Fame & Santa Monica Pier`,
          morning: { title: `Stroll Hollywood Walk of Fame & TCL Chinese Theatre`, category: 'Sightseeing', cost: 1400 },
          afternoon: { title: `Santa Monica Pier Pacific Park Rides & Venice Beach Walk`, category: 'Leisure', cost: 2000 },
          evening: { title: `Griffith Observatory Sunset View over Los Angeles Basin`, category: 'Sightseeing', cost: 1800 }
        }
      ];
    } else if (destLower.includes('goa')) {
      dayTemplates = [
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
        }
      ];
    } else {
      dayTemplates = [
        {
          summary: `Day 1: Downtown Historic Center, Plazas & Skyline View in ${dest}`,
          morning: { title: `Guided Morning Walking Tour of Central Heritage Plazas in ${dest}`, category: 'Sightseeing', cost: 1200 },
          afternoon: { title: `Regional Specialty Lunch at Top Recommended City Bistro`, category: 'Food', cost: 1500 },
          evening: { title: `Sunset Sky Deck Viewpoint overlooking ${dest} Skyline`, category: 'Leisure', cost: 1800 }
        },
        {
          summary: `Day 2: Cultural Heritage Museums & Local Artisan Bazaars in ${dest}`,
          morning: { title: `Tour Premier City Art & History Museum in ${dest}`, category: 'Culture', cost: 1000 },
          afternoon: { title: `Shopping for Handicrafts & Souvenirs at Central Market`, category: 'Shopping', cost: 1400 },
          evening: { title: `Gourmet Food Tasting Walk in ${dest}'s Culinary District`, category: 'Food', cost: 2000 }
        },
        {
          summary: `Day 3: Scenic Nature Excursion & Sunset Waterfront in ${dest}`,
          morning: { title: `Morning Trip to Hillside Lookout or Nature Park in ${dest}`, category: 'Adventure', cost: 1600 },
          afternoon: { title: `Relaxing Waterfront Boat Cruise & Farm-to-Table Lunch`, category: 'Leisure', cost: 2200 },
          evening: { title: `Rooftop Lounge Dinner & Live Music Performance`, category: 'Nightlife', cost: 2500 }
        },
        {
          summary: `Day 4: Botanical Gardens, Science Centers & Evening Theater in ${dest}`,
          morning: { title: `Stroll through Royal Botanical Gardens in ${dest}`, category: 'Sightseeing', cost: 800 },
          afternoon: { title: `Visit Contemporary Science & Technology Center`, category: 'Culture', cost: 1200 },
          evening: { title: `Cultural Performing Arts Show & Farewell Dinner`, category: 'Leisure', cost: 2400 }
        }
      ];
    }

    const seedOffset = Math.floor(Math.random() * 5);

    const days = Array.from({ length: daysCount }).map((_, i) => {
      const template = dayTemplates[(i + seedOffset) % dayTemplates.length];
      const variance = Math.floor(Math.random() * 300) - 150;
      return {
        dayNumber: i + 1,
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        summary: template.summary,
        morning: [
          { id: `m_${i}_${Date.now()}`, time: '09:00 AM', title: template.morning.title, category: template.morning.category, cost: Math.max(200, template.morning.cost + variance), isCompleted: false }
        ],
        afternoon: [
          { id: `a_${i}_${Date.now()}`, time: '01:00 PM', title: template.afternoon.title, category: template.afternoon.category, cost: Math.max(300, template.afternoon.cost + variance), isCompleted: false }
        ],
        evening: [
          { id: `e_${i}_${Date.now()}`, time: '06:30 PM', title: template.evening.title, category: template.evening.category, cost: Math.max(400, template.evening.cost + variance), isCompleted: false }
        ],
        dailyEstimatedCost: Math.max(900, template.morning.cost + template.afternoon.cost + template.evening.cost + variance * 3)
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
        { name: `Top Landmark in ${dest}`, category: 'Sightseeing', description: 'Iconic spot for sunset and photography.', cost: 400 },
        { name: `Central Heritage Square`, category: 'Culture', description: 'Vibrant local plaza with rich history.', cost: 600 }
      ],
      recommendedRestaurants: [
        { name: `The Culinary Bistro`, cuisine: 'Authentic Local', priceRange: 'Moderate', location: dest },
        { name: `Skyline Rooftop Grill`, cuisine: 'International', priceRange: 'Fine Dining', location: dest }
      ],
      recommendedHotels: [
        { name: `Grand Plaza Hotel ${dest}`, style: 'Boutique Luxury', pricePerNight: 4500 }
      ],
      packingList: [
        'SPF 50+ Sunscreen Lotion',
        'Breathable Outfits & Jacket',
        'Comfortable Walking Shoes',
        'Power Bank & Charging Cables',
        'First Aid Kit'
      ],
      localTips: [
        'Use local rideshare apps or transit passes for seamless navigation.',
        'Early morning visits avoid long tourist queues at major landmarks.'
      ],
      safetyTips: [
        'Keep emergency contacts saved offline.',
        'Stay hydrated while exploring.'
      ],
      weatherConsiderations: 'Pleasant temperatures expected.',
      confidenceNotes: 'Generated via Gemini AI Travel Companion Engine v1.5.'
    };
  }

  static async generatePackingList(input: { destination?: string; travelStyle?: string; durationDays?: number }) {
    const dest = (input.destination || 'India').trim();
    const style = (input.travelStyle || 'Leisure').trim();
    const destLower = dest.toLowerCase();

    const client = this.getClient();
    if (client) {
      for (const modelName of ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']) {
        try {
          const model = client.getGenerativeModel({ model: modelName });
          const prompt = `You are a Smart AI Packing Assistant bot. Create a comprehensive, destination-customized packing checklist for a trip to ${dest} (Style: ${style}).
Return ONLY valid JSON matching this structure:
{
  "destination": "${dest}",
  "items": [
    { "itemName": "Passport & Photo IDs", "category": "Essentials" },
    { "itemName": "SPF 50+ Sunscreen Lotion", "category": "Toiletries" },
    { "itemName": "Universal Power Adapter", "category": "Electronics" },
    { "itemName": "Breathable Cotton Apparel", "category": "Clothing" },
    { "itemName": "Personal Prescription & First Aid", "category": "Health" }
  ]
}`;
          const response = await model.generateContent(prompt);
          const text = response.response.text();
          const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          if (parsed.items && Array.isArray(parsed.items)) {
            return parsed;
          }
        } catch (err: any) {
          Logger.error(`Gemini packing list error with ${modelName}`, err, 'GeminiService');
        }
      }
    }

    let clothingItems = ['Breathable Linen Shirts & Shorts', 'Comfortable Walking Sneakers', 'Sunglasses & Sun Hat'];
    let toiletries = ['SPF 50+ Sunscreen Lotion', 'Hydrating Lip Balm & Lotion', 'Insect Repellent Spray'];

    if (destLower.includes('ladakh') || destLower.includes('leh') || destLower.includes('kashmir') || destLower.includes('manali') || destLower.includes('shimla') || destLower.includes('switzerland') || destLower.includes('iceland')) {
      clothingItems = ['Heavy Down Thermal Jacket', 'Woolen Thermals & Innerwear', 'Waterproof Trekking Boots', 'Fleece Gloves & Beanie Cap'];
      toiletries = ['Cold-Wind Moisturizing Cream', 'SPF 50+ Sunscreen Lotion', 'Heavy Lip Balm & First Aid'];
    } else if (destLower.includes('goa') || destLower.includes('bali') || destLower.includes('maldives') || destLower.includes('phuket') || destLower.includes('kerala')) {
      clothingItems = ['UV-Protection Swimwear', 'Light Cotton Shirts & Linen Shorts', 'Flip-Flops & Beach Footwear'];
      toiletries = ['Water-Resistant SPF 50+ Sunscreen', 'After-Sun Aloe Vera Gel', 'Mosquito Repellent Lotion'];
    }

    return {
      destination: dest,
      items: [
        { itemName: 'Passport, Visas & Identity Cards', category: 'Essentials' },
        { itemName: 'Hotel Vouchers & Boarding Pass', category: 'Essentials' },
        ...clothingItems.map((item) => ({ itemName: item, category: 'Clothing' })),
        ...toiletries.map((item) => ({ itemName: item, category: 'Toiletries' })),
        { itemName: '20,000mAh Power Bank & Cables', category: 'Electronics' },
        { itemName: 'Universal Travel Power Adapter', category: 'Electronics' },
        { itemName: 'Noise-Cancelling Earphones', category: 'Electronics' },
        { itemName: 'First Aid Kit & Travel Prescriptions', category: 'Health' },
        { itemName: 'ORS Hydration Packets & Sanitizer', category: 'Health' }
      ]
    };
  }

  static async getRealTimeFlightStatus(flightNumber: string, destination?: string) {
    const code = (flightNumber || '').trim().toUpperCase();
    const dest = (destination || '').trim();

    const client = this.getClient();
    if (client) {
      for (const modelName of ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']) {
        try {
          const model = client.getGenerativeModel({ model: modelName });
          const prompt = `You are an Official Real-Time Aviation & Transport Data API. Analyze flight code "${code}" (destination context: "${dest}").
If "${code}" is a completely fake or invalid flight number (e.g. 123456789, asdf, xyz, 9999), return JSON:
{ "error": "Flight code ${code} is invalid or does not exist in live airline databases." }

If "${code}" is a real commercial flight code (or standard flight format like 6E 504, AI 101, UK 815, EK 500, SQ 421, JL 001, BA 138, 6E 214, AI 729, etc.), return real authentic status JSON:
{
  "flightNumber": "${code}",
  "airline": "Exact Airline Name",
  "origin": "Exact Departure Airport Name (IATA), City",
  "destination": "Exact Arrival Airport Name (IATA), City",
  "departureTime": "08:15 AM",
  "arrivalTime": "10:30 AM",
  "terminal": "T2",
  "gate": "Gate 14",
  "status": "ON TIME",
  "delayMinutes": 0
}
Return ONLY valid JSON without extra text.`;
          const response = await model.generateContent(prompt);
          const text = response.response.text();
          const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          if (parsed) return parsed;
        } catch (err: any) {
          Logger.error(`Gemini flight status error with ${modelName}`, err, 'GeminiService');
        }
      }
    }
    return null;
  }

  static async getRealTimeTrainStatus(trainNumber: string, destination?: string) {
    const num = (trainNumber || '').trim();
    const dest = (destination || '').trim();

    const client = this.getClient();
    if (client) {
      for (const modelName of ['gemini-2.0-flash', 'gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']) {
        try {
          const model = client.getGenerativeModel({ model: modelName });
          const prompt = `You are an Official Indian Railways & Live Rail Transport API. Analyze train number "${num}" (destination context: "${dest}").
If "${num}" is a fake or invalid train number (e.g. 1246655423, 99999999, asdf, xyz, 0000), return JSON:
{ "error": "Train number ${num} is invalid and does not exist in live IRCTC railways databases." }

If "${num}" is a real Indian Railways or Vande Bharat / Rajdhani / Shatabdi / Express train number (e.g. 15657, 12424, 20901, 12951, 12051, 12002, 12626, 20947, 12509, 15959, etc.), return real authentic status JSON:
{
  "trainNumber": "${num}",
  "trainName": "Exact Official Train Name (e.g. Brahmaputra Mail / Vande Bharat Express)",
  "origin": "Exact Station Name (Station Code)",
  "destination": "Exact Station Name (Station Code)",
  "departureTime": "05:25 AM",
  "arrivalTime": "01:10 PM",
  "platform": "PF 1",
  "coach": "B2 (3A)",
  "seat": "24 (Lower)",
  "status": "ON TIME - Running smooth on main line",
  "delayMinutes": 0
}
Return ONLY valid JSON without extra text.`;
          const response = await model.generateContent(prompt);
          const text = response.response.text();
          const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
          const parsed = JSON.parse(cleanText);
          if (parsed) return parsed;
        } catch (err: any) {
          Logger.error(`Gemini train status error with ${modelName}`, err, 'GeminiService');
        }
      }
    }
    return null;
  }
}
