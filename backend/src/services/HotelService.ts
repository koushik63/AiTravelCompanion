import { Logger } from '../utils/logger';
import axios from 'axios';

export interface HotelItem {
  id: string;
  name: string;
  destination: string;
  address: string;
  rating: number;
  reviewsCount: number;
  pricePerNight: number;
  currency: string;
  category: 'Luxury' | 'Boutique' | 'Beachfront' | 'Budget' | 'Resort';
  imageUrl: string;
  amenities: string[];
  googleMapsUrl: string;
  bookingUrl: string;
  distanceFromCenterKm: number;
  lat: number;
  lng: number;
}

const DESTINATION_HOTELS: Record<string, HotelItem[]> = {
  goa: [
    {
      id: 'goa_hotel_1',
      name: 'Taj Fort Aguada Resort & Spa, Goa',
      destination: 'Goa',
      address: 'Sinquerim Beach, Candolim, North Goa 403515',
      rating: 4.8,
      reviewsCount: 3840,
      pricePerNight: 18500,
      currency: 'INR',
      category: 'Luxury',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
      amenities: ['Private Beach', 'Infinity Pool', 'Jiva Spa', 'Free High-Speed WiFi', 'Ocean View Dining'],
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Taj+Fort+Aguada+Resort+Spa+Goa',
      bookingUrl: 'https://www.google.com/travel/hotels/entity/ChgI2ff2v_q9k_U4Gg0vZy8xMWMzcnBmcjR4EAE?destination=Goa',
      distanceFromCenterKm: 1.2,
      lat: 15.492,
      lng: 73.773
    },
    {
      id: 'goa_hotel_2',
      name: 'W Goa - Luxury Beachfront Resort',
      destination: 'Goa',
      address: 'Vagator Beach, Bardez, North Goa 403509',
      rating: 4.7,
      reviewsCount: 2450,
      pricePerNight: 22000,
      currency: 'INR',
      category: 'Beachfront',
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
      amenities: ['WOOBAR Lounge', 'Rock Pool Cliff View', 'AWAY Spa', 'Pet Friendly', 'Sunset Deck'],
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=W+Goa+Vagator+Beach',
      bookingUrl: 'https://www.google.com/travel/hotels/entity/ChgI2ff2v_q9k_U4Gg0vZy8xMWMzcnBmcjR4EAE?destination=Goa',
      distanceFromCenterKm: 2.5,
      lat: 15.602,
      lng: 73.734
    },
    {
      id: 'goa_hotel_3',
      name: 'Alila Diwa Goa - Hyatt Luxury Resort',
      destination: 'Goa',
      address: '48/10 Adao Waddo, Majorda, South Goa 403713',
      rating: 4.8,
      reviewsCount: 1980,
      pricePerNight: 14200,
      currency: 'INR',
      category: 'Resort',
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
      amenities: ['Paddy Field Infinity Pool', 'Spa Alila', 'Free Shuttle to Beach', 'Kids Club', 'Spice Studio Restaurant'],
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Alila+Diwa+Goa+Majorda',
      bookingUrl: 'https://www.google.com/travel/hotels/entity/ChgI2ff2v_q9k_U4Gg0vZy8xMWMzcnBmcjR4EAE?destination=Goa',
      distanceFromCenterKm: 3.8,
      lat: 15.312,
      lng: 73.908
    },
    {
      id: 'goa_hotel_4',
      name: 'Heritage Village Resort & Spa, Goa',
      address: 'Arossim Beach, Cansaulim, South Goa 403712',
      destination: 'Goa',
      rating: 4.6,
      reviewsCount: 1620,
      pricePerNight: 8900,
      currency: 'INR',
      category: 'Boutique',
      imageUrl: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&q=80&w=800',
      amenities: ['Ayurvedic Spa', 'Outdoor Pool', 'Live Goan Music', 'Archery & Games', 'Beachfront Walk'],
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Heritage+Village+Resort+Arossim+Goa',
      bookingUrl: 'https://www.google.com/travel/hotels/entity/ChgI2ff2v_q9k_U4Gg0vZy8xMWMzcnBmcjR4EAE?destination=Goa',
      distanceFromCenterKm: 4.2,
      lat: 15.334,
      lng: 73.896
    },
    {
      id: 'goa_hotel_5',
      name: 'Pappi Chulo Hostel & Eco Stay',
      destination: 'Goa',
      address: 'Little Vagator Beach Road, Anjuna, Goa 403509',
      rating: 4.5,
      reviewsCount: 1120,
      pricePerNight: 1800,
      currency: 'INR',
      category: 'Budget',
      imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
      amenities: ['Co-Working Space', 'Communal Kitchen', 'Free High-Speed WiFi', 'Garden Hammocks', 'Weekly Bonfire'],
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Pappi+Chulo+Hostel+Vagator+Goa',
      bookingUrl: 'https://www.google.com/travel/hotels?destination=Goa',
      distanceFromCenterKm: 1.8,
      lat: 15.598,
      lng: 73.738
    }
  ],
  meghalaya: [
    {
      id: 'meg_hotel_1',
      name: 'Ri Kynjai - Serenity by the Lake',
      destination: 'Meghalaya',
      address: 'Umiam Lake, UCC Road, Ri Bhoi District, Shillong 793122',
      rating: 4.9,
      reviewsCount: 1420,
      pricePerNight: 14800,
      currency: 'INR',
      category: 'Luxury',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
      amenities: ['Lake View Thatched Cottages', 'Khasi Spa Treatments', 'Boating Pier', 'Pine Forest Trail', 'Organic Dining'],
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Ri+Kynjai+Serenity+by+the+Lake+Shillong',
      bookingUrl: 'https://www.google.com/travel/hotels?destination=Shillong',
      distanceFromCenterKm: 8.5,
      lat: 25.654,
      lng: 91.902
    },
    {
      id: 'meg_hotel_2',
      name: 'Vivanta Shillong - IHCL SeleQtions',
      destination: 'Meghalaya',
      address: 'Police Bazaar, GS Road, Shillong, Meghalaya 793001',
      rating: 4.7,
      reviewsCount: 980,
      pricePerNight: 11500,
      currency: 'INR',
      category: 'Boutique',
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
      amenities: ['City Center View', 'Heated Indoor Pool', 'Mynt Fine Dining', 'Fitness Center', 'Valet Parking'],
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Vivanta+Shillong+Police+Bazaar',
      bookingUrl: 'https://www.google.com/travel/hotels?destination=Shillong',
      distanceFromCenterKm: 0.5,
      lat: 25.578,
      lng: 91.884
    },
    {
      id: 'meg_hotel_3',
      name: 'Cherrapunjee Holiday Resort',
      destination: 'Meghalaya',
      address: 'Laitkynsew Village, Cherrapunji (Sohra), Meghalaya 793108',
      rating: 4.6,
      reviewsCount: 850,
      pricePerNight: 4200,
      currency: 'INR',
      category: 'Resort',
      imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
      amenities: ['Living Root Bridge Trek Guide', 'Cliffside View', 'Homegrown Organic Food', 'Bonfire Area'],
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cherrapunjee+Holiday+Resort+Laitkynsew',
      bookingUrl: 'https://www.google.com/travel/hotels?destination=Cherrapunji',
      distanceFromCenterKm: 12.0,
      lat: 25.215,
      lng: 91.688
    }
  ],
  mumbai: [
    {
      id: 'mum_hotel_1',
      name: 'The Taj Mahal Palace & Tower, Mumbai',
      destination: 'Mumbai',
      address: 'Apollo Bunder, Colaba, Mumbai, Maharashtra 400001',
      rating: 4.9,
      reviewsCount: 14850,
      pricePerNight: 24000,
      currency: 'INR',
      category: 'Luxury',
      imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
      amenities: ['Gateway of India View', 'Wasabi by Morimoto Restaurant', 'Jiva Spa', 'Heritage Butler Service', 'Outdoor Pool'],
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Taj+Mahal+Palace+Mumbai',
      bookingUrl: 'https://www.google.com/travel/hotels?destination=Mumbai',
      distanceFromCenterKm: 0.3,
      lat: 18.922,
      lng: 72.833
    },
    {
      id: 'mum_hotel_2',
      name: 'The Oberoi, Mumbai',
      destination: 'Mumbai',
      address: 'Nariman Point, Marine Drive, Mumbai 400021',
      rating: 4.9,
      reviewsCount: 6200,
      pricePerNight: 21500,
      currency: 'INR',
      category: 'Beachfront',
      imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
      amenities: ['Queen’s Necklace Bay View', 'Ziya Michelin Star Chef Dining', '24x7 Heated Pool', 'Luxury Spa'],
      googleMapsUrl: 'https://www.google.com/maps/search/?api=1&query=The+Oberoi+Mumbai+Nariman+Point',
      bookingUrl: 'https://www.google.com/travel/hotels?destination=Mumbai',
      distanceFromCenterKm: 1.5,
      lat: 18.927,
      lng: 72.821
    }
  ]
};

export class HotelService {
  static async searchHotels(destination: string, filterCategory?: string): Promise<HotelItem[]> {
    const query = (destination || 'Goa').toLowerCase().trim();

    // Check pre-curated destination database
    let matches: HotelItem[] = [];
    if (query.includes('goa')) matches = DESTINATION_HOTELS['goa'];
    else if (query.includes('meghalaya') || query.includes('shillong') || query.includes('cherrapunji')) matches = DESTINATION_HOTELS['meghalaya'];
    else if (query.includes('mumbai') || query.includes('bombay')) matches = DESTINATION_HOTELS['mumbai'];

    if (!matches || matches.length === 0) {
      // Dynamic fallback hotel generator for ANY global location
      const destName = destination ? destination.split(',')[0].trim() : 'Destination';
      matches = [
        {
          id: `dyn_h1_${Date.now()}`,
          name: `Grand Hyatt & Spa ${destName}`,
          destination: destName,
          address: `12 Waterfront Boulevard, City Center, ${destName}`,
          rating: 4.8,
          reviewsCount: 1840,
          pricePerNight: 12500,
          currency: 'INR',
          category: 'Luxury',
          imageUrl: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800',
          amenities: ['Infinity Swimming Pool', 'Free Airport Shuttle', 'Executive Lounge Access', 'Free WiFi', '24/7 Room Service'],
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Luxury+Hotels+in+${encodeURIComponent(destName)}`,
          bookingUrl: `https://www.google.com/travel/hotels?destination=${encodeURIComponent(destName)}`,
          distanceFromCenterKm: 0.8,
          lat: 15.299,
          lng: 74.124
        },
        {
          id: `dyn_h2_${Date.now()}`,
          name: `The Heritage Boutique Hotel ${destName}`,
          destination: destName,
          address: `Old Heritage Quarter, ${destName}`,
          rating: 4.7,
          reviewsCount: 1210,
          pricePerNight: 7800,
          currency: 'INR',
          category: 'Boutique',
          imageUrl: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=800',
          amenities: ['Rooftop Garden Cafe', 'Ayurvedic Wellness Spa', 'Artisan Bakery', 'Cultural Walking Tour'],
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Boutique+Hotels+in+${encodeURIComponent(destName)}`,
          bookingUrl: `https://www.google.com/travel/hotels?destination=${encodeURIComponent(destName)}`,
          distanceFromCenterKm: 1.5,
          lat: 15.301,
          lng: 74.128
        },
        {
          id: `dyn_h3_${Date.now()}`,
          name: `Sunset Beach Resort & Villas ${destName}`,
          destination: destName,
          address: `Coastal Cliff Road, ${destName}`,
          rating: 4.6,
          reviewsCount: 940,
          pricePerNight: 9500,
          currency: 'INR',
          category: 'Beachfront',
          imageUrl: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
          amenities: ['Private Beach Access', 'Oceanfront Dining', 'Water Sports Desk', 'Sunset Deck Bar'],
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Resorts+in+${encodeURIComponent(destName)}`,
          bookingUrl: `https://www.google.com/travel/hotels?destination=${encodeURIComponent(destName)}`,
          distanceFromCenterKm: 2.4,
          lat: 15.305,
          lng: 74.135
        },
        {
          id: `dyn_h4_${Date.now()}`,
          name: `Backpackers Eco Hostel ${destName}`,
          destination: destName,
          address: `Main Market Promenade, ${destName}`,
          rating: 4.5,
          reviewsCount: 680,
          pricePerNight: 1600,
          currency: 'INR',
          category: 'Budget',
          imageUrl: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&q=80&w=800',
          amenities: ['Co-Working Lounge', 'Shared Kitchen', 'Free Breakfast', 'Bicycle Rental Desk'],
          googleMapsUrl: `https://www.google.com/maps/search/?api=1&query=Hostels+in+${encodeURIComponent(destName)}`,
          bookingUrl: `https://www.google.com/travel/hotels?destination=${encodeURIComponent(destName)}`,
          distanceFromCenterKm: 0.5,
          lat: 15.295,
          lng: 74.120
        }
      ];
    }

    if (filterCategory && filterCategory !== 'All') {
      return matches.filter((h) => h.category.toLowerCase() === filterCategory.toLowerCase());
    }

    return matches;
  }
}
