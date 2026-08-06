// Centralized Destination Image Provider for AiTravelCompanion
const HYDERABAD_PHOTO = 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=1200';

const REALTIME_DESTINATION_IMAGES: Record<string, string> = {
  // Major Indian Cities & Destinations
  hyderabad: HYDERABAD_PHOTO,
  secunderabad: HYDERABAD_PHOTO,
  goa: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=1200',
  mumbai: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=1200',
  delhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1200',
  newdelhi: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=1200',
  bangalore: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=1200',
  bengaluru: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&q=80&w=1200',
  jaipur: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=1200',
  udaipur: 'https://images.unsplash.com/photo-1615837136849-09516e681f4d?auto=format&fit=crop&q=80&w=1200',
  agra: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&q=80&w=1200',
  kerala: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=1200',
  varanasi: 'https://images.unsplash.com/photo-1561361058-c24cecae35ca?auto=format&fit=crop&q=80&w=1200',

  // Major International Destinations
  paris: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=1200',
  london: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&q=80&w=1200',
  tokyo: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&q=80&w=1200',
  dubai: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&q=80&w=1200',
  bali: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=1200',
  singapore: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&q=80&w=1200',
  newyork: 'https://images.unsplash.com/photo-1522083165195-3424ed129620?auto=format&fit=crop&q=80&w=1200',
  rome: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=80&w=1200'
};

/**
 * Resolves a real-time, destination-appropriate image URL for a given trip object or destination text.
 */
export function getTripImage(destination?: string, tripId?: string, imageUrl?: string, title?: string, coverImage?: string): string {
  const destStr = (destination || '').toLowerCase().trim();

  // Explicit check for Hyderabad -> Guaranteed real destination photo
  if (destStr.includes('hyderabad') || destStr.includes('secunderabad')) {
    return HYDERABAD_PHOTO;
  }

  // Keyword match against verified direct destination photos
  for (const [key, photoUrl] of Object.entries(REALTIME_DESTINATION_IMAGES)) {
    if (destStr.includes(key)) {
      return photoUrl;
    }
  }

  const customImg = imageUrl || coverImage;
  // Ignore wrong newspaper/code/resort photos or wikimedia blocked links if present
  if (
    customImg &&
    customImg.trim().length > 10 &&
    !customImg.includes('wikimedia.org') &&
    !customImg.includes('photo-1627894006066') &&
    !customImg.includes('photo-1605379399642') &&
    !customImg.includes('photo-1572445271230') &&
    !customImg.includes('photo-1476514525535') &&
    !customImg.includes('photo-1566073771259') &&
    !customImg.includes('photo-1582719508461')
  ) {
    return customImg;
  }

  return HYDERABAD_PHOTO;
}
