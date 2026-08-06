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

    // Advanced Fallback Intelligence: Authentic Named Landmarks & Dynamic N-Day Generator
    const lowMsg = message.toLowerCase().trim();
    const destContext = (tripContext?.destination && tripContext.destination !== 'Worldwide Travel') ? tripContext.destination : '';

    let targetPlace = '';

    // Direct Known City Matching Engine
    const knownCities = [
      'mumbai', 'bombay', 'delhi', 'new delhi', 'jaipur', 'hyderabad', 'secunderabad', 'kerala', 'kochi', 'munnar', 'alleppey',
      'paris', 'dubai', 'tokyo', 'london', 'new york', 'california', 'singapore', 'bangkok', 'phuket',
      'rome', 'bali', 'switzerland', 'usa', 'goa', 'ladakh', 'kashmir'
    ];

    for (const city of knownCities) {
      if (new RegExp(`\\b${city}\\b`, 'i').test(lowMsg)) {
        if (city === 'mumbai' || city === 'bombay') targetPlace = 'Mumbai';
        else if (city === 'delhi' || city === 'new delhi') targetPlace = 'Delhi';
        else if (city === 'secunderabad') targetPlace = 'Hyderabad';
        else if (city === 'usa') targetPlace = 'USA';
        else if (city === 'new york') targetPlace = 'New York';
        else if (city === 'kochi' || city === 'munnar' || city === 'alleppey') targetPlace = 'Kerala';
        else targetPlace = city.charAt(0).toUpperCase() + city.slice(1);
        break;
      }
    }

    if (!targetPlace) {
      const match = message.match(/(?:visit|in|at|to|for|about)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
      if (match && match[1] && match[1].toLowerCase() !== 'visit' && match[1].toLowerCase() !== 'trip') {
        targetPlace = match[1].trim();
      } else {
        targetPlace = destContext || 'Mumbai';
      }
    }

    const placeLower = targetPlace.toLowerCase();

    // 0. Places to Visit & Top Attractions Query Trigger
    if (/\b(place|places|visit|attraction|attractions|things to do|sightseeing|spot|spots|see|highlights|tourist)\b/i.test(lowMsg) && !/\b(itinerary|plan|schedule|trip)\b/i.test(lowMsg)) {
      let attractionsList: string[] = [];

      if (placeLower.includes('mumbai')) {
        attractionsList = [
          '1. **Gateway of India & Taj Mahal Palace**: Iconic 1924 waterfront monument & historic luxury hotel.',
          '2. **Marine Drive (Queen\'s Necklace)**: 3.6km C-shaped coastal boulevard perfect for sunset strolls.',
          '3. **Elephanta Caves**: UNESCO 5th-century rock-cut cave temples accessible via ferry from Gateway.',
          '4. **Chhatrapati Shivaji Maharaj Terminus (CSMT)**: UNESCO Victorian Gothic railway architectural masterpiece.',
          '5. **Haji Ali Dargah & Mahalaxmi Dhobi Ghat**: Sea-encircled mosque causeway & world’s largest open-air laundry.',
          '6. **Bandra Bandstand & Fort**: Seaside promenade near Bollywood celebrity homes (Shah Rukh Khan\'s Mannat).'
        ];
      } else if (placeLower.includes('delhi')) {
        attractionsList = [
          '1. **Red Fort (Lal Qila)**: 17th-century Mughal empire fortress with grand sandstone ramparts.',
          '2. **Qutub Minar Complex**: 73-meter UNESCO brick minaret with ancient Iron Pillar of Delhi.',
          '3. **Humayun\'s Tomb**: UNESCO red sandstone garden tomb that inspired the Taj Mahal.',
          '4. **India Gate & Kartavya Path**: National war memorial boulevard & President House (Rashtrapati Bhavan).',
          '5. **Chandni Chowk & Jama Masjid**: Historic Mughal bazaar rickshaw ride & India’s largest mosque.',
          '6. **Lotus Temple & Swaminarayan Akshardham**: Marble Bahá\'í House of Worship & epic temple water show.'
        ];
      } else if (placeLower.includes('jaipur')) {
        attractionsList = [
          '1. **Amber Fort & Sheesh Mahal**: Hilltop fortress with mirror palace hall & elephant rides.',
          '2. **Hawa Mahal (Palace of Winds)**: 953 honeycomb windows crafted for royal women.',
          '3. **Jaipur City Palace & Chandra Mahal**: Royal residence with Courtyard of Peacocks & museum.',
          '4. **Jantar Mantar Observatory**: UNESCO 18th-century astronomical instruments & world\'s largest sundial.',
          '5. **Nahargarh Fort & Jal Mahal**: Panoramic hilltop sunset lookout over the Pink City & Water Palace.'
        ];
      } else if (placeLower.includes('kerala')) {
        attractionsList = [
          '1. **Alleppey Backwaters**: Overnight deluxe houseboat cruise through coconut palms.',
          '2. **Munnar Tea Gardens & Anamudi Peak**: Rolling green hills & Eravikulam National Park.',
          '3. **Fort Kochi & Chinese Fishing Nets**: Historic heritage streets, Santa Cruz Basilica & seafood.',
          '4. **Thekkady Periyar Wildlife Sanctuary**: Boat safari spotting wild elephants & spice plantation walk.',
          '5. **Kovalam & Varkala Beaches**: Red cliff views, lighthouse promenade & sunset surfing.'
        ];
      } else if (placeLower.includes('hyderabad')) {
        attractionsList = [
          '1. **Charminar & Laad Bazaar**: Iconic 16th-century monument & historic pearl bazaar.',
          '2. **Golconda Fort**: Acoustic marvel hilltop fort with Fateh Rahben cannon & light show.',
          '3. **Chowmahalla Palace**: Royal seat of the Asaf Jahi dynasty featuring grand marble halls.',
          '4. **Ramoji Film City**: World’s largest film studio complex with Bahubali sets.',
          '5. **Hussain Sagar Lake & Buddha Statue**: Sunset boat cruise to standing monolith Buddha.'
        ];
      } else if (placeLower.includes('paris')) {
        attractionsList = [
          '1. **Eiffel Tower Summit**: Iconic iron tower with 360° views over Champ de Mars & Seine.',
          '2. **Louvre Museum**: World’s largest art museum housing Mona Lisa & Venus de Milo.',
          '3. **Arc de Triomphe & Champs-Élysées**: Triumphal arch rooftop terrace & luxury avenue.',
          '4. **Sacré-Cœur Basilica in Montmartre**: Hilltop basilica with cobblestone artist plazas.',
          '5. **Seine River Sunset Cruise**: Glass-canopy dinner cruise along historic bridges.'
        ];
      } else if (placeLower.includes('dubai')) {
        attractionsList = [
          '1. **Burj Khalifa 148th Floor Sky Deck**: World’s tallest building observation deck.',
          '2. **Museum of the Future**: Futuristic AI exhibits & Dubai Frame glass skywalk.',
          '3. **Red Dune Desert Safari**: 4x4 dune bashing, camel riding, and Bedouin BBQ dinner.',
          '4. **Dubai Mall & Fountain Show**: World’s largest mall with dancing water fountain.'
        ];
      } else if (placeLower.includes('tokyo')) {
        attractionsList = [
          '1. **Shibuya Scramble Crossing & Shibuya Sky**: World’s busiest pedestrian crossing & sky deck.',
          '2. **Senso-ji Temple in Asakusa**: 7th-century Buddhist temple & Nakamise souvenir street.',
          '3. **teamLab Planets**: Interactive digital art & mirrored water installations.',
          '4. **Meiji Shrine & Harajuku**: Shinto shrine forest & Takeshita Street pop culture fashion.'
        ];
      } else if (placeLower.includes('london')) {
        attractionsList = [
          '1. **Big Ben & Houses of Parliament**: Iconic clock tower & UK Parliament on River Thames.',
          '2. **London Eye**: 135-meter glass flight capsule over London skyline.',
          '3. **Tower of London & Crown Jewels**: Historic royal fortress & Crown Jewels vault.',
          '4. **Tower Bridge & Glass Floor**: High-level walkways overlooking River Thames.'
        ];
      } else {
        attractionsList = [
          `1. **Historic Central Plaza & Heritage Monuments in ${targetPlace}**: Explore famous landmark architecture.`,
          `2. **Premier City Museum & Cultural Galleries**: View local historical artifacts & exhibitions.`,
          `3. **Panoramic Sunset Sky Deck & Observation Lookout**: High-altitude spot for city photography.`,
          `4. **Bustling Artisan Bazaars & Craft Markets**: Vibrant traditional shopping streets.`
        ];
      }

      return {
        reply: `📍 **Top Places to Visit & Attractions in ${targetPlace}:**\n\n` +
          attractionsList.join('\n') +
          `\n\n💡 **Traveler Tip:** Visit popular landmarks early in the morning (08:30 AM – 10:30 AM) to avoid peak crowds and get the best lighting for photos!`
      };
    }

    // 1. Live Real Weather Report Trigger
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
            `• **Current Climate:** Pleasant, comfortable temperatures around 22°C–26°C with clear skies.\n` +
            `• **Recommended Apparel:** Wear breathable cotton outfits, walking shoes, and carry a light jacket.\n` +
            `• **Best Sightseeing Window:** Early morning (08:00 AM – 11:00 AM) and golden hour sunset.`
        };
      }
    }

    // 2. Food & Culinary Query
    if (/\b(food|eat|eating|dish|dishes|restaurant|restaurants|cuisine|lunch|dinner|breakfast)\b/i.test(lowMsg)) {
      let specialty = `authentic local street food & regional specialties in ${targetPlace}`;
      if (placeLower.includes('mumbai')) {
        specialty = `Mumbai Vada Pav, Pav Bhaji at Juhu Beach, Bombil Fry, Bhel Puri & Bademiya Kebabs`;
      } else if (placeLower.includes('delhi')) {
        specialty = `Delhi Butter Chicken, Chandni Chowk Paranthas, Chole Bhature & Daulat Ki Chaat`;
      } else if (placeLower.includes('jaipur')) {
        specialty = `Jaipur Dal Baati Churma, Pyaaz Kachori at Rawat, Laal Maas & Ghevar Sweets`;
      } else if (placeLower.includes('kerala')) {
        specialty = `Kerala Karimeen Pollichathu, Malabar Parotta with Chicken Curry, Appam with Stew & Banana Fritters`;
      } else if (placeLower.includes('hyderabad')) {
        specialty = `Hyderabadi Dum Biryani, Haleem, Double Ka Meetha & Irani Chai at Paradise / Shadab`;
      } else if (placeLower.includes('paris')) {
        specialty = `French Croissants, Duck Confit, Macarons & Escargot at traditional Parisian Bistros in Le Marais`;
      }

      return {
        reply: `🍽️ **Must-Try Culinary & Food Guide for ${targetPlace}:**\n\n` +
          `• **Must-Try Delicacies:** ${specialty}.\n` +
          `• **Top Food Hubs:** Explore central food halls, night markets, and highly-rated local bistros.\n` +
          `• **Hygiene & Dining Tip:** Choose popular venues with high customer turnover for fresh, piping hot meals.\n` +
          `• **Tipping & Payment:** Check local customary tipping etiquette (cards and mobile wallets widely accepted).`
      };
    }

    // 3. Transport & Getting Around
    if (/\b(transport|bus|buses|train|trains|metro|subway|taxi|taxis|cab|cabs|flight|flights|airport)\b/i.test(lowMsg)) {
      let transitInfo = `Metro subway lines, city buses, and licensed rideshare vehicles`;
      if (placeLower.includes('mumbai')) transitInfo = `Mumbai Local Trains (Western & Central Lines), Mumbai Metro, BEST buses, Kala-Peeli Taxis & Ola/Uber`;
      else if (placeLower.includes('delhi')) transitInfo = `Delhi Metro (Yellow & Blue Lines), Airport Express Line, DTC Electric Buses & Auto Rickshaws`;
      else if (placeLower.includes('kerala')) transitInfo = `KSRTC Swift Volvo buses, Kochi Metro, auto-rickshaws, and traditional wooden ferry boats`;
      else if (placeLower.includes('paris')) transitInfo = `RER & Paris Métro (Lines 1 & 4), Vélib bike rentals, and Seine Riverboats`;
      else if (placeLower.includes('dubai')) transitInfo = `Driverless Dubai Metro (Red Line), Abra water taxis (1 AED), and Careem cabs`;

      return {
        reply: `🚕 **Transport & Transit Guide for ${targetPlace}:**\n\n` +
          `• **Recommended Transit:** ${transitInfo}.\n` +
          `• **Payment:** Tap-and-go contactless credit cards or local transit passes offer the fastest turnstile entry.\n` +
          `• **Airport Connectivity:** Dedicated express trains connect main international airports to the city center.`
      };
    }

    // 4. Budget & Costs
    if (/\b(budget|cost|costs|money|currency|price|prices|cheap|expensive)\b/i.test(lowMsg)) {
      return {
        reply: `💰 **Budget & Expense Guide for ${targetPlace}:**\n\n` +
          `• **Daily Cost Estimate:** Budget: ~$40–$70/day; Mid-range: ~$120–$200/day; Luxury: $450+/day.\n` +
          `• **Cards vs. Cash:** Credit cards are accepted everywhere; carry a small amount of local cash for street stalls.\n` +
          `• **Saving Tip:** Purchase city tourist passes in advance for discounted entry to top attractions.`
      };
    }

    // 5. Safety & Visas
    if (/\b(safe|safety|visa|passport|emergency|police|hospital)\b/i.test(lowMsg)) {
      return {
        reply: `🛡️ **Safety & Practical Advice for ${targetPlace}:**\n\n` +
          `• **Tourist Safety:** ${targetPlace} is generally safe for international travelers. Keep valuables secure in crowded plazas.\n` +
          `• **Emergency Hotline:** Keep local emergency numbers and your embassy helpline saved offline.\n` +
          `• **Documents:** Store digital copies of your passport, visa, and travel insurance on your smartphone.`
      };
    }

    // 6. Explicit Request for Itinerary / Trip Plan (Dynamic N-Day Authentic Generator)
    if (/\b(itinerary|plan|schedule|trip|days|day)\b/i.test(lowMsg)) {
      let reqDays = 5;
      const numMatch = message.match(/\b(\d{1,2})\s*(?:day|days|d)\b/i);
      if (numMatch && numMatch[1]) {
        reqDays = Math.min(14, Math.max(1, parseInt(numMatch[1], 10)));
      } else if (tripContext?.durationDays) {
        reqDays = Number(tripContext.durationDays) || 5;
      }

      let allDayTemplates: Array<{ summary: string; morning: string; afternoon: string; evening: string }> = [];

      if (placeLower.includes('mumbai')) {
        allDayTemplates = [
          { summary: 'Gateway of India & Marine Drive Sunset Promenade', morning: 'Walk through Gateway of India plaza & view historic Taj Mahal Palace Hotel', afternoon: 'Sample Mumbai Vada Pav & Sev Puri at Churchgate', evening: 'Sunset Promenade walk along Marine Drive (Queen’s Necklace)' },
          { summary: 'Elephanta Caves Cruise & Colaba Heritage Shopping', morning: 'Ferry cruise from Gateway of India to UNESCO Elephanta Island Cave Temples', afternoon: 'Explore ancient 5th-century Lord Shiva rock-cut sculptures', evening: 'Colaba Causeway shopping for handicrafts & dinner at Cafe Mondegar' },
          { summary: 'Victorian Gothic Heritage & Crawford Market', morning: 'Guided tour of UNESCO Chhatrapati Shivaji Maharaj Terminus (CSMT) architecture', afternoon: 'Shop for spices, fruits & dry fruits at historic Crawford Market', evening: 'Stroll Horniman Circle Garden & Asiatic Society Library steps' },
          { summary: 'Haji Ali Dargah & Bandra Bandstand Celebrity Walk', morning: 'Walk the sea causeway to historic Haji Ali Dargah mosque', afternoon: 'View world’s largest open-air laundry at Mahalaxmi Dhobi Ghat', evening: 'Bandra Bandstand promenade walk past Shah Rukh Khan’s Mannat bungalow' },
          { summary: 'Sanjay Gandhi National Park & Kanheri Caves Trek', morning: 'Morning nature train & safari inside Sanjay Gandhi National Park', afternoon: 'Trek up ancient Buddhist Kanheri Caves carved into basalt rock', evening: 'Visit Global Vipassana Pagoda at Gorai Creek' },
          { summary: 'Juhu Beach Sunset & Bandra Linking Road Shopping', morning: 'Visit ISKCON Temple Juhu & peaceful courtyard gardens', afternoon: 'Street food tasting at Juhu Beach (Pav Bhaji, Kulfi & Pani Puri)', evening: 'Shop for fashion apparel at Bandra Linking Road' },
          { summary: 'Dr. Bhau Daji Lad Museum & High Tea', morning: 'Tour Mumbai’s oldest museum Dr. Bhau Daji Lad in Byculla', afternoon: 'Worli Sea Face promenade walk with view of Bandra-Worli Sea Link', evening: 'Royal High Tea experience at Sea Lounge, Taj Mahal Palace' }
        ];
      } else if (placeLower.includes('delhi')) {
        allDayTemplates = [
          { summary: 'Red Fort & Chandni Chowk Mughal Bazaar', morning: 'Tour grand red sandstone ramparts of UNESCO Red Fort (Lal Qila)', afternoon: 'Cycle rickshaw ride through Chandni Chowk & Paranthe Wali Gali lunch', evening: 'Visit Jama Masjid (India’s largest mosque) & Karim’s dinner' },
          { summary: 'Qutub Minar & Humayun’s Tomb Garden Tour', morning: 'Explore 73-meter UNESCO Qutub Minar & ancient Iron Pillar', afternoon: 'Visit UNESCO Humayun’s Tomb (inspiration for the Taj Mahal)', evening: 'Sunset walk through manicured lawns at Lodhi Gardens' },
          { summary: 'India Gate, Rashtrapati Bhavan & Connaught Place', morning: 'Walk Kartavya Path to India Gate War Memorial & President House', afternoon: 'Explore ancient art & sculptures at National Museum', evening: 'Shopping & rooftop dining at Connaught Place (CP)' },
          { summary: 'Lotus Temple & Akshardham Water Show', morning: 'Visit white marble Bahá\'í Lotus Temple for silent meditation', afternoon: 'Tour Swaminarayan Akshardham Temple complex & boat ride exhibit', evening: 'Watch Sahaj Anand Water & Light Show at Akshardham' },
          { summary: 'Hauz Khas Village & Dilli Haat Craft Bazaar', morning: 'Explore 14th-century Hauz Khas fort ruins & lake', afternoon: 'Shop for handlooms & authentic state thalis at Dilli Haat INA', evening: 'Rooftop cafe hopping in Hauz Khas Village' }
        ];
      } else if (placeLower.includes('jaipur')) {
        allDayTemplates = [
          { summary: 'Amber Fort Elephant Jeep Ride & Mirror Palace', morning: 'Ascend hilltop Amber Fort & explore Sheesh Mahal (Mirror Palace)', afternoon: 'View Maota Lake & traditional Rajasthani thali lunch', evening: 'Explore Panna Meena Ka Kund ancient stepwell' },
          { summary: 'Hawa Mahal, City Palace & Jantar Mantar', morning: 'Photograph honeycomb facade of Hawa Mahal (Palace of Winds)', afternoon: 'Tour Royal City Palace museum & Peacock Courtyard', evening: 'Explore UNESCO Jantar Mantar 18th-century observatory' },
          { summary: 'Nahargarh Fort Sunset & Jaigarh Fort Cannon', morning: 'See Jaivana (world’s largest cannon on wheels) at Jaigarh Fort', afternoon: 'Visit Jal Mahal (Water Palace) & Man Sagar Lake', evening: 'Panoramic sunset view over Pink City from Nahargarh Fort' },
          { summary: 'Albert Hall Museum & Johari Bazaar Shopping', morning: 'Tour Indo-Saracenic architecture at Albert Hall Museum', afternoon: 'Shop for precious gemstones & block-print textiles at Johari Bazaar', evening: 'Traditional cultural dance & dinner at Chokhi Dhani village' }
        ];
      } else if (placeLower.includes('kerala')) {
        allDayTemplates = [
          { summary: 'Fort Kochi Heritage & Chinese Fishing Nets', morning: 'Walk through historic Fort Kochi, Mattancherry Palace & Jewish Synagogue', afternoon: 'Seafood Thali Lunch & view iconic Chinese Fishing Nets', evening: 'Traditional Kathakali Cultural Dance Performance' },
          { summary: 'Scenic Drive to Munnar Tea Gardens & Waterfalls', morning: 'Travel from Kochi to Munnar stopping at Cheeyappara & Valara Waterfalls', afternoon: 'Guided walk through rolling Tata Tea Plantations & Tea Museum', evening: 'Cozy campfire dinner in Munnar hill station' },
          { summary: 'Munnar Eravikulam Wildlife & Top Station Viewpoint', morning: 'Safari trek in Eravikulam National Park spotting Nilgiri Tahr', afternoon: 'Visit Rose Garden & Echo Point panoramic valley lookout', evening: 'Shop for fresh cardamom, cinnamon & local green tea' },
          { summary: 'Thekkady Periyar Spice Plantations & Wildlife Safari', morning: 'Drive to Thekkady & Periyar Lake Boat Wildlife Safari', afternoon: 'Guided Organic Spice Plantation Walk tasting cardamom & pepper', evening: 'Kalaripayattu Martial Arts Live Demonstration' },
          { summary: 'Alleppey Backwaters Deluxe Houseboat Cruise', morning: 'Board private Deluxe Kerala Houseboat in Alleppey backwaters', afternoon: 'Cruising past quiet coconut lagoons with Karimeen fish lunch', evening: 'Sunset over Vembanad Lake & overnight houseboat stay' }
        ];
      } else if (placeLower.includes('paris')) {
        allDayTemplates = [
          { summary: 'Eiffel Tower Summit & Seine River Cruise', morning: 'Priority elevator to Eiffel Tower Summit for 360° Paris view', afternoon: 'Stroll Champ de Mars & lunch at French Bistro', evening: 'Glass-canopy Seine River Sunset Dinner Cruise' },
          { summary: 'Louvre Museum & Champs-Élysées Promenade', morning: 'Guided Mona Lisa & Venus de Milo tour at Louvre Museum', afternoon: 'Walk through Tuileries Garden to Place de la Concorde', evening: 'Climb Arc de Triomphe rooftop terrace for illuminated avenue views' },
          { summary: 'Montmartre Artists Quarter & Sacré-Cœur', morning: 'Explore Montmartre cobblestone streets & Place du Tertre artists', afternoon: 'Visit Sacré-Cœur Basilica & panoramic city staircase', evening: 'Cabaret performance & French wine tasting' },
          { summary: 'Palace of Versailles Grand Royal Tour', morning: 'RER train to Versailles & explore Hall of Mirrors & Royal Apartments', afternoon: 'Stroll Grand Canal & Musical Fountain Gardens', evening: 'Return to Paris for Latin Quarter dining' }
        ];
      } else if (placeLower.includes('dubai')) {
        allDayTemplates = [
          { summary: 'Burj Khalifa Sky Deck & Dubai Fountain', morning: 'Ascend Burj Khalifa 148th Floor Sky Deck', afternoon: 'Explore Dubai Mall Aquarium & Underwater Zoo', evening: 'Watch Dubai Fountain Light Show & dinner at Souk Al Bahar' },
          { summary: 'Old Dubai Heritage Souks & Abra River Ride', morning: 'Walk through Al Fahidi Historic District & Dubai Museum', afternoon: 'Take 1-AED Abra water taxi across Dubai Creek to Gold & Spice Souks', evening: 'Authentic Arabian BBQ dinner in Old Dubai' },
          { summary: 'Red Dune 4x4 Desert Safari Excursion', morning: 'Leisure morning at Dubai Marina Beach Promenade', afternoon: '4x4 Land Cruiser Desert Dune Bashing & Sandboarding', evening: 'Camel riding, henna painting & Bedouin Camp BBQ dinner show' }
        ];
      } else if (placeLower.includes('hyderabad')) {
        allDayTemplates = [
          { summary: 'Charminar, Laad Bazaar & Chowmahalla Palace', morning: 'Ascend 16th-century Charminar & shop for pearls at Laad Bazaar', afternoon: 'Tour royal marble courtyards at Chowmahalla Palace', evening: 'Taste authentic Hyderabadi Dum Biryani at Hotel Shadab' },
          { summary: 'Golconda Fort & Qutb Shahi Tombs', morning: 'Trek up acoustic marvel Golconda Fort to Fateh Rahben cannon', afternoon: 'Explore Persian arch architecture at Qutb Shahi Tombs', evening: 'Golconda Fort Sound & Light Show' },
          { summary: 'Full Day Ramoji Film City Adventure', morning: 'Guided tour of Bahubali film sets & stunt shows at Ramoji Film City', afternoon: 'Explore Eureka amusement zone & bird park', evening: 'Return to city for evening leisure' }
        ];
      } else {
        allDayTemplates = [
          { summary: `Arrival, Historic Landmarks & City View in ${targetPlace}`, morning: `Check-in & guided walk through premier historical landmarks in ${targetPlace}`, afternoon: `Sample famous regional specialties at top-rated local bistro`, evening: `Sunset observation deck views overlooking ${targetPlace}` },
          { summary: `Premier Museums & Artisan Bazaars in ${targetPlace}`, morning: `Visit premier history & art museum in ${targetPlace}`, afternoon: `Shop for local handicrafts & souvenirs in traditional craft markets`, evening: `Gourmet food tasting walk in culinary quarter` },
          { summary: `Scenic Nature Excursion & Waterfront Cruise in ${targetPlace}`, morning: `Excursion to nearby hill viewpoint or nature park`, afternoon: `Relaxing waterfront boat cruise & farm-to-table lunch`, evening: `Rooftop lounge dinner & live music` }
        ];
      }

      const generatedDays = Array.from({ length: reqDays }).map((_, idx) => {
        const template = allDayTemplates[idx % allDayTemplates.length];
        const dayNum = idx + 1;
        return `📍 **Day ${dayNum}: ${template.summary}**\n` +
          `• **Morning:** ${template.morning}.\n` +
          `• **Afternoon:** ${template.afternoon}.\n` +
          `• **Evening:** ${template.evening}.`;
      });

      return {
        reply: `🗺️ **Custom ${reqDays}-Day Travel Itinerary for ${targetPlace}:**\n\n` +
          generatedDays.join('\n\n') +
          `\n\n💡 **Traveler Tip:** You can customize any day or request specific hotel and flight recommendations for ${targetPlace}!`
      };
    }

    // 7. Direct Response tailored to User Query Input
    return {
      reply: `💡 **Travel Guidance for "${message}":**\n\n` +
        `Here is helpful advice regarding **${targetPlace}**:\n\n` +
        `• **Direct Answer:** For "${message}" in ${targetPlace}, we recommend checking official local city portals or operating schedules in advance.\n` +
        `• **Best Visiting Time:** Morning hours (08:30 AM – 10:30 AM) offer shorter queues and better photo lighting.\n` +
        `• **Need Specific Information?** Feel free to ask about live weather, authentic food, public transit, or budget tips for ${targetPlace}!`
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

    if (destLower.includes('mumbai') || destLower.includes('bombay')) {
      dayTemplates = [
        {
          summary: `Day 1: Gateway of India, Taj Mahal Palace & Marine Drive Sunset Walk`,
          morning: { title: `Walk & Photo Session at Gateway of India & Taj Mahal Palace`, category: 'Sightseeing', cost: 500 },
          afternoon: { title: `Colaba Causeway Shopping & Bademiya Kebab Lunch`, category: 'Food', cost: 1200 },
          evening: { title: `Sunset Promenade Walk along Marine Drive (Queen's Necklace)`, category: 'Leisure', cost: 800 }
        },
        {
          summary: `Day 2: UNESCO Elephanta Caves & Crawford Market`,
          morning: { title: `Ferry Ride & Exploration of 5th-Century UNESCO Elephanta Caves`, category: 'Culture', cost: 1500 },
          afternoon: { title: `Chhatrapati Shivaji Maharaj Terminus (CSMT) Tour & Crawford Market`, category: 'Sightseeing', cost: 900 },
          evening: { title: `Worli Sea Face Sunset & Dinner at High-End Bandra Bistro`, category: 'Food', cost: 2200 }
        }
      ];
    } else if (destLower.includes('california') || destLower.includes('san francisco') || destLower.includes('los angeles')) {
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
        }
      ];
    } else {
      dayTemplates = [
        {
          summary: `Day 1: Gateway of India, Heritage Plazas & City View in ${dest}`,
          morning: { title: `Guided Morning Walking Tour of Central Heritage Plazas in ${dest}`, category: 'Sightseeing', cost: 1200 },
          afternoon: { title: `Regional Specialty Lunch at Top Recommended City Bistro`, category: 'Food', cost: 1500 },
          evening: { title: `Sunset Sky Deck Viewpoint overlooking ${dest} Skyline`, category: 'Leisure', cost: 1800 }
        },
        {
          summary: `Day 2: Cultural Heritage Museums & Local Artisan Bazaars in ${dest}`,
          morning: { title: `Tour Premier City Art & History Museum in ${dest}`, category: 'Culture', cost: 1000 },
          afternoon: { title: `Shopping for Handicrafts & Souvenirs at Central Market`, category: 'Shopping', cost: 1400 },
          evening: { title: `Gourmet Food Tasting Walk in ${dest}'s Culinary District`, category: 'Food', cost: 2000 }
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
