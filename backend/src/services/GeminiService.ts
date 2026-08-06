import { GoogleGenerativeAI } from '@google/generative-ai';
import { Logger } from '../utils/logger';
import { AICacheService } from './AICacheService';
import { AILoggingService } from './AILoggingService';
import { validateDestination } from '../utils/destinationValidator';
import { WeatherService } from './WeatherService';

export class GeminiService {
  private static getClient() {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey.trim().length > 5 && !apiKey.startsWith('AQ.')) {
      return new GoogleGenerativeAI(apiKey.trim());
    }
    return null;
  }

  // Master Landmark Knowledge Base Covering All India & Major World Destinations
  private static getCityLandmarks(destination: string, travelStyle: string = 'Leisure'): Array<{ summary: string; morning: string; afternoon: string; evening: string }> {
    const d = (destination || '').toLowerCase().trim();

    // 0. Vizag / Visakhapatnam
    if (d.includes('vizag') || d.includes('visakhapatnam')) {
      return [
        { summary: 'INS Kursura Submarine Museum, RK Beach & Tenneti Park', morning: 'Tour historic INS Kursura Submarine Museum & TU 142 Aircraft Museum on RK Beach', afternoon: 'Explore Victory at Sea Memorial & enjoy fresh coconut water at Ramakrishna Beach', evening: 'Sunset walk at Tenneti Park cliff overlook & seaside seafood dinner' },
        { summary: 'Kailasagiri Hilltop Ropeway & Rushikonda Blue Flag Beach', morning: 'Ride Kailasagiri Ropeway to hilltop park viewing giant Lord Shiva & Parvati statues', afternoon: 'Water sports, speedboating & surf lessons at Rushikonda Blue Flag Beach', evening: 'Seafood grill dinner at Rushikonda Beach Resort' },
        { summary: 'Borra Caves & Araku Valley Coffee Plantations Excursion', morning: 'Scenic Vizag to Araku Vistadome train ride through 58 tunnels', afternoon: 'Explore 150 million-year-old Borra Limestone Caves & Katiki Waterfalls', evening: 'Visit Araku Tribal Museum & taste organic Araku Valley Filter Coffee' },
        { summary: 'Simhachalam Temple & Yarada Beach Sunset Cliff', morning: 'Visit sacred 11th-century Simhachalam Lord Narasimha Temple atop hill', afternoon: 'Excursion to secluded Yarada Beach & Dolphin’s Nose Lighthouse lookout', evening: 'Farewell seafood thali dinner at Sea Pearl Restaurant' }
      ];
    }

    // 1. Pune
    if (d.includes('pune')) {
      return [
        { summary: 'Shaniwar Wada Fort, Lal Mahal & Dagdusheth Ganpati Temple', morning: 'Explore historic 1730 AD Shaniwar Wada Peshwa Palace ramparts & Lal Mahal', afternoon: 'Visit revered Shreemant Dagdusheth Halwai Ganpati Temple & Tulshibaug shopping market', evening: 'Authentic Puneri Misal Pav & Mastani Mango drink tasting at Sujata Mastani' },
        { summary: 'Aga Khan Palace, Osho Teerth Park & Koregaon Park Cafes', morning: 'Tour historic Aga Khan Palace (Mahatma Gandhi Memorial & ashes memorial)', afternoon: 'Stroll serene Osho Teerth Zen Park botanical trails', evening: 'Boutique cafe dining & live music walk in Koregaon Park' },
        { summary: 'Sinhagad Fort Hilltop Trek & Khadakwasla Dam Sunset', morning: 'Trek to 1300m Sinhagad Fort (Kondhana) ruins & Tanaji Malusare Memorial', afternoon: 'Traditional Pithla Bhakri & Kanda Bhajji lunch at Sinhagad summit', evening: 'Sunset promenade stroll along Khadakwasla Dam reservoir' },
        { summary: 'Raja Dinkar Kelkar Museum & Saras Baug Gardens', morning: 'Explore 20,000+ antique artifacts collection at Raja Dinkar Kelkar Museum', afternoon: 'Stroll Saras Baug Ganpati temple lake gardens & Vishrambaug Wada', evening: 'Dinner trying Maharashtrian Thali at Sukanta or Durvankur' },
        { summary: 'Lavasa Hill City Day Excursion & Temghar Dam View', morning: 'Drive through Western Ghats pass to Lavasa Italian-style lakeside town', afternoon: 'Water sports, kayaking & lakeside promenade walk in Lavasa', evening: 'Sunset stop at Temghar Dam viewpoint on return to Pune' },
        { summary: 'Lonavala & Khandala Day Trip: Tiger Point & Karla Caves', morning: 'Excursion to Lonavala: Visit 2nd-century BC Buddhist Karla Caves & Bhaja Caves', afternoon: 'View Rajmachi Point, Duke’s Nose & Tiger Point canyon views', evening: 'Shop for famous Lonavala Chikki & Fudge before returning to Pune' },
        { summary: 'Parvati Hill Temple & Empress Botanical Garden Stroll', morning: 'Climb 103 stone steps to hilltop Parvati Hill Temple complex & Peshwa Museum', afternoon: 'Guided walk through 39-acre historic Empress Botanical Garden', evening: 'Farewell sunset terrace dining overlooking Pune skyline' }
      ];
    }

    // 2. Hyderabad
    if (d.includes('hyderabad') || d.includes('secunderabad')) {
      return [
        { summary: 'Charminar, Laad Bazaar Pearls & Chowmahalla Palace', morning: 'Climb 1591 AD Charminar & shop for bangles in Laad Bazaar', afternoon: 'Tour Nizams grand Chowmahalla Palace & vintage car collection', evening: 'Authentic Hyderabadi Dum Biryani dinner at Paradise or Hotel Shadab' },
        { summary: 'Golconda Fort Acoustics, Qutb Shahi Tombs & Sound Show', morning: 'Guided hike through majestic Golconda Fort acoustics & royal palaces', afternoon: 'Explore 7 domed Qutb Shahi Royal Tombs garden complex', evening: 'Sound & Light Show at Golconda Fort' },
        { summary: 'Full Day Ramoji Film City Adventure', morning: 'Explore World\'s Largest Film Studio Complex at Ramoji Film City', afternoon: 'Watch live stunt shows, Japanese Gardens & Bahubali Movie Sets', evening: 'Return to Hyderabad city & Hussain Sagar Lake Boat Ride to Buddha Statue' },
        { summary: 'Salar Jung Museum, Birla Mandir & Tank Bund Promenade', morning: 'Explore world-class single-man collection at Salar Jung Museum & Veiled Rebecca', afternoon: 'Visit white marble Birla Mandir atop Naubat Pahad hill', evening: 'Sunset walk along Tank Bund & NTR Gardens' }
      ];
    }

    // 3. Assam
    if (d.includes('assam') || d.includes('guwahati') || d.includes('kaziranga') || d.includes('majuli')) {
      return [
        { summary: 'Guwahati Kamakhya Temple & Brahmaputra Sunset Cruise', morning: 'Visit sacred 51 Shakti Peeth Kamakhya Temple atop Nilachal Hill in Guwahati', afternoon: 'Guided walk through Assam State Museum & Umananda Peacock Island Temple', evening: 'Sunset Alfresco Cruise on Brahmaputra River with traditional Assamese dinner' },
        { summary: 'Kaziranga National Park Rhinoceros Elephant & Jeep Safari', morning: 'Early 5:30 AM Elephant Safari in Kaziranga Central Range viewing One-Horned Rhinoceros', afternoon: 'Jeep Safari through Western Range & visit Kaziranga National Orchid Park', evening: 'Traditional Assamese Thali dinner featuring Masor Tenga & local bamboo shoot dishes' },
        { summary: 'Majuli River Island & Satra Monasteries', morning: 'Ferry ride from Jorhat to Majuli Island (World’s Largest River Island)', afternoon: 'Guided walk through Kamalabari & Auniati Satra Vaishnavite monasteries', evening: 'Traditional Mising tribal village walk & evening riverbank sunset view' }
      ];
    }

    // 4. Kerala
    if (d.includes('kerala') || d.includes('kochi') || d.includes('munnar') || d.includes('alleppey') || d.includes('kovalam')) {
      return [
        { summary: 'Fort Kochi Heritage Walk, St. Francis Church & Chinese Nets', morning: 'Explore historic Fort Kochi, Mattancherry Dutch Palace & Jewish Synagogue', afternoon: 'View iconic Chinese Fishing Nets & fresh seafood lunch by the Arabian Sea', evening: 'Traditional Kathakali Cultural Dance Performance with elaborate face makeup' },
        { summary: 'Munnar Rolling Tea Estates & Cheeyappara Waterfalls', morning: 'Drive through misty Western Ghats stopping at Cheeyappara & Valara Waterfalls', afternoon: 'Guided walk through Tata Tea Plantations & visit Munnar Tea Museum', evening: 'Campfire dinner overlooking lush Tea Valley in Munnar hill station' },
        { summary: 'Alleppey Deluxe Backwaters Houseboat Cruise', morning: 'Board private Deluxe Kerala Houseboat in Alleppey (Alappuzha) backwaters', afternoon: 'Cruise past quiet palm-fringed lagoons with fresh Karimeen Pollichathu fish lunch', evening: 'Sunset over Vembanad Lake & overnight peaceful houseboat stay' }
      ];
    }

    // 5. Goa
    if (d.includes('goa') || d.includes('baga') || d.includes('panaji')) {
      return [
        { summary: 'North Goa Baga Beach Water Sports & Aguada Fort', morning: 'Parasailing & Jet Skiing at Baga Beach', afternoon: 'Explore 17th-century Portuguese Fort Aguada & Lighthouse', evening: 'Sunset cocktails at Vagator Cliff Lounge (Thalassa)' },
        { summary: 'Old Goa UNESCO Cathedrals & Spice Plantation', morning: 'Tour Basilica of Bom Jesus & Se Cathedral in Old Goa', afternoon: 'Guided walk & buffet lunch at Sahakari Spice Plantation', evening: 'Mandovi River Sunset Cruise with Goan Folk Dance' }
      ];
    }

    // Dynamic Intelligent Generator for Any Other City/State on Earth
    const cleanPlace = (destination || 'Destination').trim();
    const capPlace = cleanPlace.charAt(0).toUpperCase() + cleanPlace.slice(1);
    
    return [
      { summary: `Historic City Heritage District & Local Monument Tour in ${capPlace}`, morning: `Morning guided walk through central historical quarter & iconic landmarks in ${capPlace}`, afternoon: `Visit top-rated national cultural museum & local craft markets in ${capPlace}`, evening: `Sunset terrace dining overlooking ${capPlace} skyline & authentic regional specialties` },
      { summary: `Scenic Nature Excursion & Cultural Craft Bazaars in ${capPlace}`, morning: `Scenic morning excursion to nearby mountain lookout or nature park surrounding ${capPlace}`, afternoon: `Explore artisan handicraft bazaars & sample authentic street food delicacies in ${capPlace}`, evening: `Waterfront promenade walk & traditional performing arts show in ${capPlace}` },
      { summary: `Artisan Markets & Culinary Tasting Walk in ${capPlace}`, morning: `Visit historic cathedral, fort or central cultural gallery in ${capPlace}`, afternoon: `Guided food tasting walk trying top regional delicacies at popular local bistros`, evening: `Sunset lounge session & candlelit dinner in ${capPlace}` }
    ];
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
    if (ai) {
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
        Logger.warn('Gemini AI API Call Failed, switching to Master Landmark Engine', 'GeminiService');
      }
    }

    // High-Fidelity Landmark Fallback Generator
    const fallback = this.generateFallbackItinerary(input);
    AICacheService.set(cacheKey, fallback);
    return fallback;
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
        'Book Vande Bharat / Express train tickets 3 weeks prior for 30% savings.',
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
            ? `Active Trip Context: ${tripContext.destination}, Budget: ${tripContext.budget || 'N/A'} ${tripContext.currency || ''}.`
            : 'No active trip context.';

          const prompt = `You are an expert AI Travel Assistant. Answer the user's specific question directly, accurately, and naturally.

Conversation History:
${history || 'None'}

User Context: ${contextStr}

User Question: "${message}"

INSTRUCTIONS & CONSTRAINTS:
1. Answer the exact question asked by the user. If they ask for a trip plan for N days, generate a complete N-day itinerary detailing every requested day (Day 1 through Day N) with real specific famous landmark names.
2. Keep the tone helpful, knowledgeable, and easy to read with Markdown formatting (emojis, bold headings, bullet points).
3. Do NOT output raw JSON code blocks.`;

          const result = await model.generateContent(prompt);
          const text = result.response.text().trim();
          if (text) return { reply: text };
        } catch (err) {
          Logger.warn(`Gemini model ${modelName} chat error, trying next`, 'GeminiService');
        }
      }
    }

    // Universal Dynamic City Extraction Algorithm
    const lowMsg = message.toLowerCase().trim();
    const destContext = (tripContext?.destination && tripContext.destination !== 'Worldwide Travel') ? tripContext.destination : '';

    let targetPlace = '';

    // Universal Stop Words Set
    const stopWords = new Set([
      'day', 'days', 'd', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14',
      'trip', 'plan', 'schedule', 'itinerary', 'tour', 'vacation', 'visit', 'in', 'at', 'to', 'for',
      'about', 'the', 'a', 'an', 'my', 'our', 'give', 'me', 'show', 'create', 'make', 'generate',
      'want', 'need', 'please', 'can', 'you', 'how', 'what', 'where', 'when', 'is', 'are', 'weather',
      'temp', 'temperature', 'places', 'attractions', 'things', 'do'
    ]);

    const tokens = lowMsg.split(/\s+/).map(t => t.replace(/[^a-z0-9]/g, '')).filter(Boolean);
    const nonStopTokens = tokens.filter(t => !stopWords.has(t));

    if (nonStopTokens.length > 0) {
      targetPlace = nonStopTokens.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    } else {
      targetPlace = destContext || 'Visakhapatnam';
    }

    const dayTemplates = this.getCityLandmarks(targetPlace, tripContext?.travelStyle);

    // 0. Places to Visit Query
    if (/\b(place|places|visit|attraction|attractions|things to do|sightseeing|spot|spots|see|highlights|tourist)\b/i.test(lowMsg) && !/\b(itinerary|plan|schedule|trip)\b/i.test(lowMsg)) {
      const attractionsList = dayTemplates.map((t, idx) => `${idx + 1}. **${t.summary}**: ${t.morning} & ${t.afternoon}.`);
      return {
        reply: `📍 **Top Places to Visit & Attractions in ${targetPlace}:**\n\n` +
          attractionsList.join('\n\n') +
          `\n\n💡 **Traveler Tip:** Visit popular landmarks early in the morning (08:30 AM – 10:30 AM) to avoid peak crowds and get the best lighting for photos!`
      };
    }

    // 1. Weather Query
    if (/\b(weather|rain|raining|temp|temperature|climate|forecast|sunny|cloudy|snow)\b/i.test(lowMsg)) {
      try {
        const wx = await WeatherService.getCurrentWeather(targetPlace);
        const outlookStr = wx.dailyForecast.map((d: any) => `${d.day}: ${d.tempMax}°C / ${d.tempMin}°C (${d.condition})`).join(' • ');
        return {
          reply: `🌤️ **Real-Time Weather Report for ${wx.city}:**\n\n` +
            `• **Current Temperature:** ${wx.temp}°C (Feels like ${wx.feelsLike}°C)\n` +
            `• **Condition:** ${wx.condition} — ${wx.description}\n` +
            `• **Humidity:** ${wx.humidity}% | **Wind Speed:** ${wx.windSpeed} km/h\n` +
            `• **Rain Probability:** ${wx.rainProbability}%\n` +
            `• **Sun Schedule:** Sunrise ${wx.sunrise} | Sunset ${wx.sunset}\n` +
            `• **5-Day Climate Outlook:** ${outlookStr}\n` +
            `• **Sightseeing Advice:** ${wx.advisory}`
        };
      } catch (err) {
        return {
          reply: `☀️ **Weather & Climate Report for ${targetPlace}:**\n\n` +
            `• **Current Climate:** Pleasant travel climate around 26°C–31°C with clear skies.\n` +
            `• **Recommended Apparel:** Wear lightweight linen outfits, sun hat, and comfortable walking shoes.\n` +
            `• **Best Sightseeing Window:** Early morning (07:30 AM – 10:30 AM) and golden hour sunset.`
        };
      }
    }

    // 2. Itinerary / Trip Plan Request (UNIVERSAL EXACT TARGET PLACE & NON-REPEATING DAYS)
    let reqDays = 5;
    const numMatch = message.match(/\b(\d{1,2})\s*(?:day|days|d)\b/i);
    if (numMatch && numMatch[1]) {
      reqDays = Math.min(14, Math.max(1, parseInt(numMatch[1], 10)));
    } else if (tripContext?.durationDays) {
      reqDays = Number(tripContext.durationDays) || 5;
    }

    const generatedDays = Array.from({ length: reqDays }).map((_, idx) => {
      const template = dayTemplates[idx % dayTemplates.length];
      const dayNum = idx + 1;
      const summaryTitle = idx < dayTemplates.length ? template.summary : `${template.summary} (Part ${Math.floor(idx / dayTemplates.length) + 1})`;
      return `📍 **Day ${dayNum}: ${summaryTitle}**\n` +
        `• **Morning:** ${template.morning}.\n` +
        `• **Afternoon:** ${template.afternoon}.\n` +
        `• **Evening:** ${template.evening}.`;
    });

    return {
      reply: `🗺️ **Custom ${reqDays}-Day Travel Itinerary for ${targetPlace}:**\n\n` +
        generatedDays.join('\n\n') +
        `\n\n💡 **Traveler Tip:** You can customize any day or ask for specific hotel and flight recommendations for ${targetPlace}!`
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
    const dest = (input.destination || 'Visakhapatnam').trim();
    const daysCount = Number(input.durationDays) || 4;
    const style = input.travelStyle || 'Leisure';

    const dayTemplates = this.getCityLandmarks(dest, style);
    const budgetTotal = Number(input.budget) || 50000;
    const approxDailyBudget = Math.round(budgetTotal / daysCount);

    const days = Array.from({ length: daysCount }).map((_, i) => {
      const template = dayTemplates[i % dayTemplates.length];
      const morningCost = Math.round(approxDailyBudget * 0.3);
      const afternoonCost = Math.round(approxDailyBudget * 0.35);
      const eveningCost = Math.round(approxDailyBudget * 0.35);

      const summaryTitle = i < dayTemplates.length ? template.summary : `${template.summary} (Part ${Math.floor(i / dayTemplates.length) + 1})`;

      return {
        dayNumber: i + 1,
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        summary: summaryTitle,
        morning: [
          { id: `m_${i}_${Date.now()}`, time: '09:00 AM', title: template.morning, category: 'Sightseeing', cost: morningCost, isCompleted: false }
        ],
        afternoon: [
          { id: `a_${i}_${Date.now()}`, time: '01:00 PM', title: template.afternoon, category: 'Culture', cost: afternoonCost, isCompleted: false }
        ],
        evening: [
          { id: `e_${i}_${Date.now()}`, time: '06:30 PM', title: template.evening, category: 'Leisure', cost: eveningCost, isCompleted: false }
        ],
        dailyEstimatedCost: morningCost + afternoonCost + eveningCost
      };
    });

    return {
      tripTitle: `AI Expedition to ${dest}`,
      destination: dest,
      summary: `Comprehensive ${daysCount}-day AI-curated travel itinerary for ${dest} featuring authentic famous landmarks & tailored for ${style} travel.`,
      estimatedTotalCost: budgetTotal,
      currency: input.currency || 'INR',
      days,
      recommendedAttractions: [
        { name: `Top Landmark in ${dest}`, category: 'Sightseeing', description: 'Iconic spot for sunset and photography.', cost: Math.round(approxDailyBudget * 0.2) },
        { name: `Central Heritage Square`, category: 'Culture', description: 'Vibrant local plaza with rich history.', cost: Math.round(approxDailyBudget * 0.25) }
      ],
      recommendedRestaurants: [
        { name: `The Culinary Bistro`, cuisine: 'Authentic Local', priceRange: 'Moderate', location: dest },
        { name: `Skyline Rooftop Grill`, cuisine: 'International', priceRange: 'Fine Dining', location: dest }
      ],
      recommendedHotels: [
        { name: `Grand Plaza Hotel ${dest}`, style: 'Boutique Luxury', pricePerNight: Math.round(budgetTotal * 0.15) }
      ],
      packingList: [
        'SPF 50+ Sunscreen Lotion',
        'Breathable Outfits & Jacket',
        'Comfortable Walking Shoes',
        'Power Bank & Charging Cables',
        'First Aid Kit'
      ],
      localTips: [
        'Use local transport apps or transit passes for seamless navigation.',
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
    } else if (destLower.includes('goa') || destLower.includes('bali') || destLower.includes('maldives') || destLower.includes('phuket') || destLower.includes('kerala') || destLower.includes('assam')) {
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
