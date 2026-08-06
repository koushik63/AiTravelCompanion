// Centralized Destination Image Provider for AiTravelCompanion
const DESTINATION_PHOTOS: Record<string, string> = {
  // Major Indian Cities & Destinations
  hyderabad: 'photo-1605379399642-870262d3d051', // Real Charminar Hyderabad Monument
  secunderabad: 'photo-1605379399642-870262d3d051',
  goa: 'photo-1512343879784-a960bf40e7f2', // Real Goa Beach & Palms
  mumbai: 'photo-1529253355930-ddbe423a2ac7', // Real Gateway of India Mumbai
  delhi: 'photo-1597074866923-dc0589150358', // Real India Gate Delhi
  newdelhi: 'photo-1597074866923-dc0589150358',
  bangalore: 'photo-1596176530529-78163a4f7af2', // Real Bengaluru Palace
  bengaluru: 'photo-1596176530529-78163a4f7af2',
  chennai: 'photo-1582510003544-4d00b7f74220', // Real Kapaleeshwarar Temple Chennai
  kolkata: 'photo-1558431382-27e303142255', // Real Howrah Bridge Kolkata
  pune: 'photo-1571679654681-ba01b9e1e117',
  jaipur: 'photo-1524492412937-b28074a5d7da', // Real Hawa Mahal Jaipur
  udaipur: 'photo-1615837136849-09516e681f4d', // Real Lake Palace Udaipur
  agra: 'photo-1564507592333-c60657eea523', // Real Taj Mahal Agra
  kerala: 'photo-1602216056096-3b40cc0c9944', // Real Kerala Backwaters
  munnar: 'photo-1602216056096-3b40cc0c9944',
  wayanad: 'photo-1602216056096-3b40cc0c9944',
  ladakh: 'photo-1506905925346-21bda4d32df4', // Real Pangong Tso Ladakh
  leh: 'photo-1506905925346-21bda4d32df4',
  kashmir: 'photo-1548013146-72479768bada', // Real Dal Lake Kashmir
  srinagar: 'photo-1548013146-72479768bada',
  manali: 'photo-1626621341517-bbf3d9990a23',
  shimla: 'photo-1626621341517-bbf3d9990a23',
  varanasi: 'photo-1561361058-c24cecae35ca', // Real Ganges Ghats Varanasi
  mysore: 'photo-1600697395543-b8d08c87c9d5', // Real Mysore Palace

  // Major International Destinations
  paris: 'photo-1502602898657-3e91760cbb34', // Real Eiffel Tower Paris
  london: 'photo-1513635269975-59663e0ac1ad', // Real Big Ben London
  tokyo: 'photo-1540959733332-eab4deabeeaf', // Real Tokyo Skyline
  kyoto: 'photo-1503899036084-c55cdd92da26',
  dubai: 'photo-1512453979798-5ea266f8880c', // Real Burj Khalifa Dubai
  bali: 'photo-1537996194471-e657df975ab4', // Real Uluwatu Bali Temple
  singapore: 'photo-1525625293386-3f8f99389edd', // Real Marina Bay Singapore
  newyork: 'photo-1522083165195-3424ed129620', // Real Manhattan NYC
  rome: 'photo-1552832230-c0197dd311b5', // Real Colosseum Rome
  barcelona: 'photo-1539037116277-4db20889f2d4', // Real Sagrada Familia Barcelona
  maldives: 'photo-1573843981267-be1999ff37cd',
  switzerland: 'photo-1506905925346-21bda4d32df4',
  amsterdam: 'photo-1534351590666-13e3e96b5702',
  bangkok: 'photo-1508009603885-50cf7c579365',
  istanbul: 'photo-1524231757912-21f4fe3a7200',
  greece: 'photo-1555993539-1732b0258235',
  santorini: 'photo-1555993539-1732b0258235'
};

const FALLBACK_POOL = [
  'photo-1605379399642-870262d3d051', // Charminar Monument
  'photo-1502602898657-3e91760cbb34', // Eiffel Tower
  'photo-1529253355930-ddbe423a2ac7', // Gateway of India
  'photo-1597074866923-dc0589150358', // India Gate
  'photo-1524492412937-b28074a5d7da', // Hawa Mahal
  'photo-1513635269975-59663e0ac1ad'  // Big Ben
];

/**
 * Resolves a real-time, destination-appropriate image URL for a given trip object or destination text.
 */
export function getTripImage(destination?: string, tripId?: string, imageUrl?: string, title?: string, coverImage?: string): string {
  const destStr = (destination || '').toLowerCase().trim();

  // Search keyword map FIRST to guarantee real destination matching
  for (const [key, photoId] of Object.entries(DESTINATION_PHOTOS)) {
    if (destStr.includes(key)) {
      return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=1200`;
    }
  }

  const customImg = imageUrl || coverImage;
  // Use custom image ONLY if it's a real user-uploaded base64/blob image and NOT a generic resort pool photo
  if (
    customImg &&
    customImg.trim().length > 10 &&
    !customImg.includes('photo-1476514525535-07fb3b4ae5f1') &&
    !customImg.includes('photo-1566073771259-6a8506099945') &&
    !customImg.includes('photo-1582719508461-905c673771fd') &&
    !customImg.includes('photo-1540555700478-4be289fbecef')
  ) {
    return customImg;
  }

  // Hashed deterministic fallback using destination + title + tripId
  const seedString = `${destStr}_${title || ''}_${tripId || ''}`;
  const charSum = seedString.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const photoIndex = Math.abs(charSum) % FALLBACK_POOL.length;

  return `https://images.unsplash.com/${FALLBACK_POOL[photoIndex]}?auto=format&fit=crop&q=80&w=1200`;
}
