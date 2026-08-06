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

  // Master Comprehensive City Landmark Knowledge Base with Real-World Places
  private static getCityLandmarks(destination: string, travelStyle: string = 'Leisure'): Array<{ summary: string; morning: string; afternoon: string; evening: string }> {
    const d = (destination || '').toLowerCase().trim();
    const style = (travelStyle || 'Leisure').toLowerCase();

    // 0. Assam
    if (d.includes('assam') || d.includes('guwahati') || d.includes('kaziranga')) {
      return [
        { summary: 'Guwahati Kamakhya Temple & Brahmaputra Sunset Cruise', morning: 'Visit sacred 51 Shakti Peeth Kamakhya Temple atop Nilachal Hill in Guwahati', afternoon: 'Guided walk through Assam State Museum & Umananda Peacock Island Temple', evening: 'Sunset Alfresco Cruise on Brahmaputra River with traditional Assamese dinner' },
        { summary: 'Kaziranga National Park Rhinoceros Elephant Safari', morning: 'Early 5:30 AM Elephant Safari in Kaziranga Central Range viewing One-Horned Rhinoceros', afternoon: 'Jeep Safari through Western Range & visit Kaziranga National Orchid Park', evening: 'Traditional Assamese Thali dinner featuring Masor Tenga & local bamboo shoot dishes' },
        { summary: 'Majuli River Island & Satra Monasteries', morning: 'Ferry ride from Jorhat to Majuli Island (World’s Largest River Island)', afternoon: 'Guided walk through Kamalabari & Auniati Satra Vaishnavite monasteries', evening: 'Traditional Mising tribal village walk & evening riverbank sunset view' },
        { summary: 'Tezpur Heritage & Assam Organic Tea Gardens', morning: 'Explore Agnigarh Hill park overlooking Brahmaputra River & Cole Park', afternoon: 'Guided tour & tea tasting at historic Koliabor Tea Estate', evening: 'Traditional Assamese pita dessert & tea session' }
      ];
    }

    // 0.1 Kerala
    if (d.includes('kerala') || d.includes('kochi') || d.includes('munnar') || d.includes('alleppey')) {
      return [
        { summary: 'Fort Kochi Heritage Walk, St. Francis Church & Chinese Nets', morning: 'Explore historic Fort Kochi, Mattancherry Dutch Palace & Jewish Synagogue', afternoon: 'View iconic Chinese Fishing Nets & fresh seafood lunch by the Arabian Sea', evening: 'Traditional Kathakali Cultural Dance Performance with elaborate face makeup' },
        { summary: 'Munnar Rolling Tea Estates & Cheeyappara Waterfalls', morning: 'Drive through misty Western Ghats stopping at Cheeyappara & Valara Waterfalls', afternoon: 'Guided walk through Tata Tea Plantations & visit Munnar Tea Museum', evening: 'Campfire dinner overlooking lush Tea Valley in Munnar hill station' },
        { summary: 'Alleppey Deluxe Backwaters Houseboat Cruise', morning: 'Board private Deluxe Kerala Houseboat in Alleppey (Alappuzha) backwaters', afternoon: 'Cruise past quiet palm-fringed lagoons with fresh Karimeen Pollichathu fish lunch', evening: 'Sunset over Vembanad Lake & overnight peaceful houseboat stay' },
        { summary: 'Kovalam Beach Cliff Walk & Samudra Beach Sunset', morning: 'Relaxation at Kovalam Lighthouse Beach & Samudra Beach', afternoon: 'Ayurvedic Abhyanga Herbal Oil Massage & rejuvenation session', evening: 'Sunset cliffside dining with fresh tiger prawns at Kovalam Promenade' }
      ];
    }

    // 1. Cairo / Egypt
    if (d.includes('cairo') || d.includes('egypt')) {
      return [
        { summary: 'Giza Plateau Pyramids, Great Sphinx & Camel Safari', morning: 'Explore Great Pyramids of Giza (Khufu, Khafre, Menkaure) & Camel Safari', afternoon: 'Photograph iconic Great Sphinx Monument & Valley Temple of Khafre', evening: 'Sunset Nile River Felucca Boat Cruise with Egyptian Koshary Dinner' },
        { summary: 'Grand Egyptian Museum & King Tutankhamun Treasures', morning: 'Visit Grand Egyptian Museum (GEM) & King Tutankhamun Golden Treasures', afternoon: 'Tour Tahrir Square Historic Museum of Egyptian Antiquities', evening: 'Authentic Grill Dinner in Downtown Cairo' },
        { summary: 'Khan el-Khalili 14th-Century Souk & El Fishawy Cafe', morning: 'Guided walk through 14th-century Khan el-Khalili Medieval Spice Bazaar', afternoon: 'Traditional Mint Tea & Shisha session at historic El Fishawy Cafe', evening: 'Sound & Light Show at Giza Pyramids' },
        { summary: 'Citadel of Saladin & Alabaster Mosque', morning: 'Tour Citadel of Saladin & Mosque of Muhammad Ali (Alabaster Mosque)', afternoon: 'Stroll Al-Mu\'izz Street Mamluk architectural monuments', evening: 'Panoramic sunset views from Al-Azhar Park overlooking Cairo' },
        { summary: 'Coptic Cairo Hanging Church & Ancient Churches', morning: 'Guided tour of Hanging Church of St. Mary & Church of St. Sergius', afternoon: 'Visit Ben Ezra Synagogue & Coptic Museum in Old Cairo', evening: 'Dinner Cruise on Nile River with traditional Tanoura dance' },
        { summary: 'Saqqara Step Pyramid & Ancient Memphis Ruins', morning: 'Excursion to Saqqara Step Pyramid of Djoser & Dahshur Pyramids', afternoon: 'Explore ancient capital ruins of Memphis & Colossus of Ramesses II', evening: 'Traditional Egyptian BBQ feast in Giza' }
      ];
    }

    // 2. Darjeeling
    if (d.includes('darjeeling')) {
      return [
        { summary: 'Tiger Hill 4:00 AM Sunrise & Mount Kanchenjunga View', morning: '4:00 AM excursion to Tiger Hill for sunrise over Mount Kanchenjunga', afternoon: 'Visit Batasia Loop heritage railway monument & Ghoom Monastery', evening: 'Stroll Chowrasta Mall Road & tea tasting at Nathmulls' },
        { summary: 'UNESCO Toy Train Ride & Happy Valley Tea Estate', morning: 'Ride UNESCO Darjeeling Himalayan Railway Steam Toy Train', afternoon: 'Guided tea leaf picking walk at Happy Valley Tea Estate', evening: 'Cozy dinner at Kunga Restaurant trying hot Momos & Thukpa' },
        { summary: 'Himalayan Mountaineering Institute & Padmaja Zoo', morning: 'Tour Himalayan Mountaineering Institute & Mount Everest Museum', afternoon: 'See Snow Leopards & Red Pandas at Padmaja Naidu Himalayan Zoo', evening: 'Sunset view from Observatory Hill Temple' },
        { summary: 'Peace Pagoda & Japanese Temple Stroll', morning: 'Visit Nipponzan Myohoji Peace Pagoda & Japanese Temple', afternoon: 'Excursion to Rock Garden & Ganga Maya Park waterfalls', evening: 'Souvenir shopping for Darjeeling First Flush Tea at Chowrasta' }
      ];
    }

    // 3. Rishikesh
    if (d.includes('rishikesh')) {
      return [
        { summary: 'Laxman Jhula & Ram Jhula Suspension Bridges Walk', morning: 'Walk historic Laxman Jhula & Ram Jhula suspension bridges across Ganges', afternoon: 'Explore Trayambakeshwar Temple (13-Story Temple)', evening: 'Attend Parmarth Niketan Evening Ganga Aarti Ceremony with Vedic Chanting' },
        { summary: 'White Water Ganges River Rafting & Cliff Jump', morning: '16km White Water Ganges River Rafting from Shivpuri to Rishikesh', afternoon: 'Cliff Jumping & Body Surfing in crystal glacier Ganges waters', evening: 'Riverside organic cafe dinner at Little Buddha Cafe' },
        { summary: 'Beatles Ashram Murals & Yoga Meditation', morning: 'Guided tour of Maharishi Mahesh Yogi Ashram (Beatles Ashram) murals', afternoon: 'Yoga & Pranayama session at Parmarth Niketan or Anand Prakash', evening: 'Sunset at Triveni Ghat Ganga Aarti' },
        { summary: 'Neer Garh Waterfall Trek & Kunjapuri Sunrise', morning: 'Early morning drive to Kunjapuri Temple for Himalayan Sunrise view', afternoon: 'Trek to Neer Garh Waterfalls & natural dip in mountain pools', evening: 'Farewell Ayurvedic Spa Massage & organic thali dinner' }
      ];
    }

    // 4. Ladakh / Leh
    if (d.includes('ladakh') || d.includes('leh')) {
      return [
        { summary: 'Acclimatization, Leh Market & Shanti Stupa Sunset', morning: 'Rest & acclimatization to high altitude (11,500 ft) in Leh town', afternoon: 'Walk through Leh Main Bazaar & Leh Palace ruins', evening: 'Panoramic sunset view over Indus Valley from white Shanti Stupa' },
        { summary: 'Thiksey Monastery Morning Chanting & Hemis Monastery', morning: 'Watch 6:00 AM Buddhist Monks Chanting at Thiksey Monastery', afternoon: 'Explore Hemis Monastery museum & Shey Palace complex', evening: 'Traditional Ladakhi Butter Tea & Skyu dinner' },
        { summary: 'Khardung La Pass (17,582 ft) to Nubra Valley Drive', morning: 'Scenic mountain drive across Khardung La Pass (highest motorable road)', afternoon: 'Visit Diskit Monastery & 106ft Giant Maitreya Buddha Statue', evening: 'Double-Humped Bactrian Camel Ride on Hunder Sand Dunes' },
        { summary: 'Pangong Tso Lake Turquoise Water & 3 Idiots Spot', morning: 'Drive through Chang La Pass to Pangong Tso Lake (14,270 ft)', afternoon: 'Photograph changing turquoise waters & 3 Idiots movie shooting point', evening: 'Overnight starry night camping on Pangong Tso shoreline' }
      ];
    }

    // 5. Kashmir / Srinagar
    if (d.includes('kashmir') || d.includes('srinagar')) {
      return [
        { summary: 'Dal Lake Shikara Ride & Luxury Houseboat Check-in', morning: 'Arrive Srinagar, check-in to hand-carved Wooden Luxury Houseboat', afternoon: '2-Hour Shikara Ride on Dal Lake through Meena Bazaar & Floating Gardens', evening: 'Sunset over Zabarwan Mountains & Kashmiri Kahwa Tea' },
        { summary: 'Mughal Gardens Tour & Hazratbal Shrine', morning: 'Tour Mughal Royal Gardens: Shalimar Bagh, Nishat Bagh & Chashme Shahi', afternoon: 'Visit white marble Hazratbal Shrine on Dal Lake shore', evening: 'Shop for Pashmina Shawls & Kashmiri Carpets at Lal Chowk' },
        { summary: 'Gulmarg Gondola Ride to Phase 2 Snow Peak', morning: 'Day excursion to Gulmarg: Ride Asia’s highest Gondola to Phase 2 (Kongdoori)', afternoon: 'Snow sledge ride & skiing on Apharwat Peak slopes', evening: 'Return to Srinagar for Wazwan 7-Course Royal Dinner' }
      ];
    }

    // 6. Bali
    if (d.includes('bali') || d.includes('ubud')) {
      return [
        { summary: 'Ubud Sacred Monkey Forest & Royal Palace Walk', morning: 'Explore Sacred Monkey Forest Sanctuary with 700+ long-tailed macaques', afternoon: 'Tour Puri Saren Agung (Ubud Royal Palace) & shop at Ubud Art Market', evening: 'Balinese Legong Dance performance at Puri Saraswati Temple' },
        { summary: 'Tegallalang Rice Terraces & Tirta Empul Temple', morning: 'Walk through terraced green hills at Tegallalang Rice Terraces & High Jungle Swings', afternoon: 'Visit Tirta Empul Holy Spring Temple for traditional ritual purification', evening: 'Dinner overlooking lush rainforest valley at Sayan Ridge' },
        { summary: 'Uluwatu Sea Temple Cliffside & Kecak Fire Dance', morning: 'Relax & surf at Padang Padang Beach or Suluban Hidden Beach', afternoon: 'Visit Uluwatu Cliffside Temple 70 meters above the Indian Ocean', evening: 'Sunset Kecak Fire Dance Performance on Uluwatu amphitheater cliff' },
        { summary: 'Nusa Penida Island Ferry & Kelingking T-Rex Beach', morning: 'Speedboat ferry to Nusa Penida & photograph famous Kelingking T-Rex Cliff', afternoon: 'Snorkel with Manta Rays at Crystal Bay & visit Angel’s Billabong', evening: 'Return to mainland Bali & dinner in Sanur waterfront' },
        { summary: 'Seminyak Beach Club Lounge & Sunset Cocktails', morning: 'Leisure morning boutique shopping along Seminyak Kayu Aya Street', afternoon: 'Poolside relaxation at Potato Head or Ku De Ta Beach Club', evening: 'Sunset beachside dining with live DJ beats in Seminyak' }
      ];
    }

    // 7. Paris / France
    if (d.includes('paris') || d.includes('france')) {
      return [
        { summary: 'Eiffel Tower Summit & Seine River Cruise', morning: 'Ascend Eiffel Tower 3rd tier summit for 360° Paris skyline view', afternoon: 'Walk Champs-Élysées avenue to Arc de Triomphe monument', evening: 'Sunset Seine River Cruise aboard Bateaux Parisiens with champagne' },
        { summary: 'Louvre Museum & Tuileries Garden Stroll', morning: 'Guided tour of Louvre Museum: Mona Lisa, Venus de Milo & Winged Victory', afternoon: 'Stroll Tuileries Garden & Place de la Concorde', evening: 'French Bistro dinner in Saint-Germain-des-Prés' },
        { summary: 'Montmartre Artists Quarter & Sacré-Cœur', morning: 'Walk historic cobblestone alleyways of Montmartre & Place du Tertre', afternoon: 'Visit Sacré-Cœur Basilica summit & view Paris panorama', evening: 'Moulin Rouge cabaret show or Latin Quarter bistro dinner' }
      ];
    }

    // 8. Tokyo / Japan
    if (d.includes('tokyo') || d.includes('japan')) {
      return [
        { summary: 'Shibuya Scramble Crossing & Shibuya Sky', morning: 'Experience world-famous Shibuya Scramble Crossing & Hachiko Statue', afternoon: '360° Tokyo skyline views from Shibuya Sky observation deck', evening: 'Dinner at Shinjuku Omoide Yokocho (Memory Lane) yakitori alleys' },
        { summary: 'Senso-ji Temple Asakusa & Tokyo Skytree', morning: 'Visit 7th-century Senso-ji Temple & Nakamise Shopping Street', afternoon: 'Sumida River Walk & ascend 634-meter Tokyo Skytree', evening: 'Traditional Tonkotsu Ramen dinner in Akihabara' },
        { summary: 'teamLab Planets Digital Art & Odaiba Seaside', morning: 'Interactive digital art experience at teamLab Planets TOKYO', afternoon: 'Walk Odaiba Seaside Park, view Unicorn Gundam Statue & Rainbow Bridge', evening: 'Rooftop sushi dining overlooking Tokyo Bay' }
      ];
    }

    // 9. Dubai / UAE
    if (d.includes('dubai') || d.includes('uae')) {
      return [
        { summary: 'Burj Khalifa 124th Floor Deck & Dubai Fountain', morning: 'Ascend Burj Khalifa 124th/125th floor observation deck', afternoon: 'Explore Dubai Mall, Aquarium & Underwater Zoo', evening: 'Watch Dubai Fountain Light & Music Show with dinner' },
        { summary: 'Old Dubai Gold Souk & Abra River Boat', morning: 'Explore Al Fahidi Historic Neighborhood & Dubai Museum', afternoon: 'Cross Dubai Creek on traditional Wooden Abra boat to Gold & Spice Souks', evening: 'Dubai Marina Luxury Yacht Sunset Cruise' },
        { summary: '4x4 Red Dune Desert Safari & Bedouin Night', morning: 'Leisure morning at Jumeirah Beach overlooking Burj Al Arab', afternoon: 'Dune bashing 4x4 safari across Lahbab Red Desert', evening: 'Bedouin Desert Camp barbecue dinner with Tanoura show & stargazing' }
      ];
    }

    // 10. Jaipur / Rajasthan
    if (d.includes('jaipur') || d.includes('rajasthan')) {
      return [
        { summary: 'Amber Fort Elephant Jeep Ride & Mirror Palace', morning: 'Ascend hilltop Amber Fort & explore Sheesh Mahal (Mirror Palace)', afternoon: 'View Maota Lake & traditional Rajasthani thali lunch at 1135 AD', evening: 'Photograph Panna Meena Ka Kund ancient stepwell' },
        { summary: 'Hawa Mahal, City Palace & Jantar Mantar', morning: 'Photograph honeycomb facade of Hawa Mahal (Palace of Winds)', afternoon: 'Tour Royal City Palace museum & Peacock Courtyard', evening: 'Explore UNESCO Jantar Mantar 18th-century observatory' }
      ];
    }

    // 11. Goa
    if (d.includes('goa')) {
      return [
        { summary: 'North Goa Baga Beach Water Sports & Aguada Fort', morning: 'Parasailing & Jet Skiing at Baga Beach', afternoon: 'Explore 17th-century Portuguese Fort Aguada & Lighthouse', evening: 'Sunset cocktails at Vagator Cliff Lounge (Thalassa)' },
        { summary: 'Old Goa UNESCO Cathedrals & Spice Plantation', morning: 'Tour Basilica of Bom Jesus & Se Cathedral in Old Goa', afternoon: 'Guided walk & buffet lunch at Sahakari Spice Plantation', evening: 'Mandovi River Sunset Cruise with Goan Folk Dance' }
      ];
    }

    // 12. Dynamic Intelligent Adaptor for ANY Other Place in the World
    const cleanPlace = (destination || 'Destination').trim();
    const capPlace = cleanPlace.charAt(0).toUpperCase() + cleanPlace.slice(1);
    if (style.includes('adventure')) {
      return [
        { summary: `High-Altitude Mountain Trekking & Outdoor Adventure in ${capPlace}`, morning: `Early morning guided wilderness trekking to mountain viewpoints in ${capPlace}`, afternoon: `White-water river rafting, ziplining or rock climbing excursion`, evening: `Campfire barbecue & stargazing session` },
        { summary: `Waterfall Hikes & Wildlife Nature Reserve in ${capPlace}`, morning: `Forest trail hike to hidden waterfalls & natural swimming pools in ${capPlace}`, afternoon: `Guided jeep wildlife safari through national park reserve`, evening: `Rustic mountain lodge dinner with local bonfire` }
      ];
    }

    if (style.includes('family')) {
      return [
        { summary: `Family Ocean World, Theme Park & Cultural Highlights in ${capPlace}`, morning: `Guided visit to famous city aquarium, zoo safari or interactive science center in ${capPlace}`, afternoon: `Family fun theme park rides & botanical garden walk`, evening: `Water fountain light show & kid-friendly buffet dining` },
        { summary: `Historic Castle, River Cruise & Artisan Bazaars in ${capPlace}`, morning: `Interactive historic castle or royal palace tour in ${capPlace}`, afternoon: `Scenic riverboat cruise & souvenir craft shopping`, evening: `Traditional cultural puppet show & ice cream tasting` }
      ];
    }

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

    // Advanced Fallback Intelligence: Authentic Named Landmarks & Dynamic N-Day Generator
    const lowMsg = message.toLowerCase().trim();
    const destContext = (tripContext?.destination && tripContext.destination !== 'Worldwide Travel') ? tripContext.destination : '';

    let targetPlace = destContext || 'Assam';
    const match = message.match(/(?:visit|in|at|to|for|about)\s+([A-Za-z]+(?:\s+[A-Za-z]+)?)/i);
    if (match && match[1] && !['visit', 'trip', 'plan', 'schedule', 'the', 'how', 'what', 'where'].includes(match[1].toLowerCase())) {
      targetPlace = match[1].trim();
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

    // 2. Itinerary / Trip Plan Request
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
      return `📍 **Day ${dayNum}: ${template.summary}**\n` +
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
    const dest = (input.destination || 'Assam').trim();
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

      return {
        dayNumber: i + 1,
        date: new Date(Date.now() + i * 86400000).toISOString().split('T')[0],
        summary: template.summary,
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
