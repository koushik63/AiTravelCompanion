export interface TrainStatusResult {
  trainNumber: string;
  trainName: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  platform: string;
  coach: string;
  seat: string;
  status: string;
  delayMinutes: number;
  error?: string;
}

const REGISTERED_TRAINS: Record<string, TrainStatusResult> = {
  '15657': {
    trainNumber: '15657',
    trainName: 'Brahmaputra Mail Express',
    origin: 'Old Delhi Junction (DLI)',
    destination: 'Guwahati Junction (GHY), Meghalaya Gateway',
    departureTime: new Date(Date.now() - 7200000).toISOString(),
    arrivalTime: new Date(Date.now() + 54000000).toISOString(),
    platform: 'PF 4',
    coach: 'B2 (3A)',
    seat: '24 (Lower)',
    status: 'ON TIME - Running smooth via NJP',
    delayMinutes: 0
  },
  '12424': {
    trainNumber: '12424',
    trainName: 'Dibrugarh Rajdhani Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Guwahati Junction (GHY), Meghalaya Gateway',
    departureTime: new Date(Date.now() - 3600000).toISOString(),
    arrivalTime: new Date(Date.now() + 43200000).toISOString(),
    platform: 'PF 16',
    coach: 'A1 (2A)',
    seat: '12 (Upper)',
    status: 'ON TIME - Superfast Priority Clearance',
    delayMinutes: 0
  },
  '12509': {
    trainNumber: '12509',
    trainName: 'Guwahati Superfast Express',
    origin: 'SMVT Bengaluru (SMVB)',
    destination: 'Guwahati Junction (GHY), Meghalaya Gateway',
    departureTime: new Date(Date.now() - 10800000).toISOString(),
    arrivalTime: new Date(Date.now() + 64800000).toISOString(),
    platform: 'PF 2',
    coach: 'B4 (3A)',
    seat: '35 (Middle)',
    status: 'ON TIME - Crossing Malda Town',
    delayMinutes: 0
  },
  '20901': {
    trainNumber: '20901',
    trainName: 'Mumbai - Madgaon Vande Bharat Express',
    origin: 'Mumbai Central (MMCT)',
    destination: 'Madgaon Junction (MAO), Goa',
    departureTime: new Date(Date.now() - 14400000).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000).toISOString(),
    platform: 'PF 1',
    coach: 'C4 (Executive)',
    seat: '14 (Window)',
    status: 'ON TIME - Approaching Kankavli',
    delayMinutes: 0
  },
  '12051': {
    trainNumber: '12051',
    trainName: 'Dadar - Madgaon Jan Shatabdi Express',
    origin: 'Dadar Central (DR), Mumbai',
    destination: 'Madgaon Junction (MAO), Goa',
    departureTime: new Date(Date.now() - 18000000).toISOString(),
    arrivalTime: new Date(Date.now() + 7200000).toISOString(),
    platform: 'PF 5',
    coach: 'D2 (2S)',
    seat: '45 (Window)',
    status: 'ON TIME - Crossing Ratnagiri',
    delayMinutes: 0
  },
  '12952': {
    trainNumber: '12952',
    trainName: 'Mumbai Rajdhani Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Mumbai Central (MMCT)',
    departureTime: new Date(Date.now() - 21600000).toISOString(),
    arrivalTime: new Date(Date.now() + 10800000).toISOString(),
    platform: 'PF 1',
    coach: 'A2 (2A)',
    seat: '18 (Lower)',
    status: 'ON TIME - Approaching Vadodara',
    delayMinutes: 0
  },
  '12951': {
    trainNumber: '12951',
    trainName: 'Mumbai Rajdhani Express',
    origin: 'Mumbai Central (MMCT)',
    destination: 'New Delhi (NDLS)',
    departureTime: new Date(Date.now() - 18000000).toISOString(),
    arrivalTime: new Date(Date.now() + 14400000).toISOString(),
    platform: 'PF 1',
    coach: 'A1 (2A)',
    seat: '12 (Upper)',
    status: 'ON TIME - Approaching Kota Junction',
    delayMinutes: 0
  },
  '12002': {
    trainNumber: '12002',
    trainName: 'Bhopal Shatabdi Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Rani Kamlapati (RKMP), Bhopal',
    departureTime: new Date(Date.now() - 10800000).toISOString(),
    arrivalTime: new Date(Date.now() + 7200000).toISOString(),
    platform: 'PF 2',
    coach: 'C3 (CC)',
    seat: '22 (Window)',
    status: 'ON TIME - Passing Gwalior',
    delayMinutes: 0
  },
  '12626': {
    trainNumber: '12626',
    trainName: 'Kerala Superfast Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Trivandrum Central (TVC), Kerala',
    departureTime: new Date(Date.now() - 25200000).toISOString(),
    arrivalTime: new Date(Date.now() + 36000000).toISOString(),
    platform: 'PF 3',
    coach: 'B2 (3A)',
    seat: '45 (Side Lower)',
    status: 'ON TIME - Passing Vijayawada',
    delayMinutes: 0
  },
  '20947': {
    trainNumber: '20947',
    trainName: 'Delhi - Jaipur Vande Bharat Express',
    origin: 'New Delhi (NDLS)',
    destination: 'Jaipur Junction (JP), Rajasthan',
    departureTime: new Date(Date.now() - 7200000).toISOString(),
    arrivalTime: new Date(Date.now() + 3600000).toISOString(),
    platform: 'PF 1',
    coach: 'C2 (CC)',
    seat: '18 (Window)',
    status: 'ON TIME - Passing Alwar',
    delayMinutes: 0
  }
};

export class TrainService {
  static async getTrainStatus(trainNumber: string, destinationParam?: string): Promise<TrainStatusResult> {
    const num = (trainNumber || '').trim();
    const destCity = (destinationParam || '').trim().toLowerCase();

    if (num && REGISTERED_TRAINS[num]) {
      return REGISTERED_TRAINS[num];
    }

    if (destCity) {
      if (destCity.includes('meghalaya') || destCity.includes('shillong') || destCity.includes('guwahati')) {
        return REGISTERED_TRAINS['15657'];
      }
      if (destCity.includes('goa')) {
        return REGISTERED_TRAINS['20901'];
      }
      if (destCity.includes('mumbai')) {
        return REGISTERED_TRAINS['12952'];
      }
    }

    if (num) {
      return {
        trainNumber: num,
        trainName: 'Unknown Express',
        origin: 'N/A',
        destination: 'N/A',
        departureTime: new Date().toISOString(),
        arrivalTime: new Date().toISOString(),
        platform: 'N/A',
        coach: 'N/A',
        seat: 'N/A',
        status: 'TRAIN NOT FOUND',
        delayMinutes: 0,
        error: `Train number "${num}" was not found in Indian Railways live database. Please select from available trains.`
      };
    }

    return REGISTERED_TRAINS['15657'];
  }
}
