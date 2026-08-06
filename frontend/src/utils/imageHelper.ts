// Centralized Destination Image Provider for AiTravelCompanion
const DESTINATION_PHOTOS: Record<string, string> = {
  // Major Indian Cities & Destinations
  goa: 'photo-1512343879784-a960bf40e7f2',
  mumbai: 'photo-1529253355930-ddbe423a2ac7',
  delhi: 'photo-1597074866923-dc0589150358',
  newdelhi: 'photo-1597074866923-dc0589150358',
  bangalore: 'photo-1596176530529-78163a4f7af2',
  bengaluru: 'photo-1596176530529-78163a4f7af2',
  hyderabad: 'photo-1582719508461-905c673771fd',
  chennai: 'photo-1582510003544-4d00b7f74220',
  kolkata: 'photo-1558431382-27e303142255',
  pune: 'photo-1571679654681-ba01b9e1e117',
  jaipur: 'photo-1524492412937-b28074a5d7da',
  udaipur: 'photo-1615837136849-09516e681f4d',
  agra: 'photo-1564507592333-c60657eea523',
  kerala: 'photo-1602216056096-3b40cc0c9944',
  munnar: 'photo-1602216056096-3b40cc0c9944',
  wayanad: 'photo-1602216056096-3b40cc0c9944',
  ladakh: 'photo-1506905925346-21bda4d32df4',
  leh: 'photo-1506905925346-21bda4d32df4',
  kashmir: 'photo-1548013146-72479768bada',
  srinagar: 'photo-1548013146-72479768bada',
  manali: 'photo-1626621341517-bbf3d9990a23',
  shimla: 'photo-1626621341517-bbf3d9990a23',
  rishikesh: 'photo-1596176530529-78163a4f7af2',
  varanasi: 'photo-1561361058-c24cecae35ca',
  coorg: 'photo-1596176530529-78163a4f7af2',
  pondicherry: 'photo-1582510003544-4d00b7f74220',
  andaman: 'photo-1537956965359-7573183d1f57',
  mysore: 'photo-1600697395543-b8d08c87c9d5',
  ooty: 'photo-1602216056096-3b40cc0c9944',
  vizag: 'photo-1507525428034-b723cf961d3e',
  visakhapatnam: 'photo-1507525428034-b723cf961d3e',
  ahmedabad: 'photo-1571679654681-ba01b9e1e117',
  darjeeling: 'photo-1548013146-72479768bada',

  // Major International Destinations
  paris: 'photo-1502602898657-3e91760cbb34',
  london: 'photo-1513635269975-59663e0ac1ad',
  tokyo: 'photo-1540959733332-eab4deabeeaf',
  kyoto: 'photo-1503899036084-c55cdd92da26',
  dubai: 'photo-1512453979798-5ea266f8880c',
  bali: 'photo-1537996194471-e657df975ab4',
  singapore: 'photo-1525625293386-3f8f99389edd',
  newyork: 'photo-1522083165195-3424ed129620',
  rome: 'photo-1552832230-c0197dd311b5',
  barcelona: 'photo-1539037116277-4db20889f2d4',
  maldives: 'photo-1573843981267-be1999ff37cd',
  switzerland: 'photo-1506905925346-21bda4d32df4',
  amsterdam: 'photo-1534351590666-13e3e96b5702',
  bangkok: 'photo-1508009603885-50cf7c579365',
  phuket: 'photo-1537956965359-7573183d1f57',
  istanbul: 'photo-1524231757912-21f4fe3a7200',
  greece: 'photo-1555993539-1732b0258235',
  santorini: 'photo-1555993539-1732b0258235',
  hawaii: 'photo-1542259009477-d625272157b7',
  vietnam: 'photo-1528127269322-539801943592',
  iceland: 'photo-1529963183134-61a90db47eaf'
};

const FALLBACK_POOL = [
  'photo-1566073771259-6a8506099945',
  'photo-1582719508461-905c673771fd',
  'photo-1500530855697-b586d89ba3ee',
  'photo-1488085061387-422e29b40080',
  'photo-1469474968028-56623f02e42e',
  'photo-1519046904884-53103b34b206',
  'photo-1503220317375-aaad61436b1b',
  'photo-1551918120-9739cb430c6d'
];

/**
 * Resolves a unique destination-appropriate image URL for a given trip object or destination text.
 */
export function getTripImage(destination?: string, tripId?: string, imageUrl?: string, title?: string, coverImage?: string): string {
  const destStr = (destination || '').toLowerCase().trim();

  // Search keyword map first to guarantee destination match
  for (const [key, photoId] of Object.entries(DESTINATION_PHOTOS)) {
    if (destStr.includes(key)) {
      return `https://images.unsplash.com/${photoId}?auto=format&fit=crop&q=80&w=1200`;
    }
  }

  const customImg = imageUrl || coverImage;
  if (customImg && customImg.trim().length > 10 && !customImg.includes('photo-1476514525535-07fb3b4ae5f1')) {
    return customImg;
  }

  // Hashed deterministic fallback using destination + title + tripId
  const seedString = `${destStr}_${title || ''}_${tripId || ''}`;
  const charSum = seedString.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const photoIndex = Math.abs(charSum) % FALLBACK_POOL.length;

  return `https://images.unsplash.com/${FALLBACK_POOL[photoIndex]}?auto=format&fit=crop&q=80&w=1200`;
}
