export class TrainService {
  static async getTrainStatus(trainNumber: string, destinationParam?: string) {
    const num = (trainNumber || '').trim();
    const destCity = (destinationParam || '').trim();
    const destLower = destCity.toLowerCase();

    let trainName = `${destCity || 'Express'} Superfast Express`;
    let origin = 'New Delhi Railway Station (NDLS)';
    let destination = destCity ? `${destCity} Central Station` : 'Mumbai Central (MMCT)';
    let platform = 'PF 1';

    if (destLower.includes('mumbai')) {
      trainName = 'Mumbai Rajdhani Express';
      origin = 'New Delhi (NDLS)';
      destination = 'Mumbai Central (MMCT)';
      platform = 'PF 1';
    } else if (destLower.includes('goa')) {
      trainName = 'Konkan Kanya Express';
      origin = 'Mumbai CST (CSMT)';
      destination = 'Madgaon Junction (MAO), Goa';
      platform = 'PF 3';
    } else if (destLower.includes('bali')) {
      trainName = 'Trans-Java Coastal Express';
      origin = 'Surabaya Gubeng (SGU)';
      destination = 'Denpasar Station, Bali';
      platform = 'PF 2';
    } else if (num.includes('20901')) {
      trainName = 'Mumbai - Gandhinagar Vande Bharat Express';
      origin = 'Mumbai Central (MMCT)';
      destination = 'Gandhinagar Capital (GNC)';
      platform = 'PF 5';
    } else if (num.includes('12951')) {
      trainName = 'Mumbai Rajdhani Express';
      origin = 'Mumbai Central (MMCT)';
      destination = 'New Delhi (NDLS)';
      platform = 'PF 1';
    } else if (num.includes('12002')) {
      trainName = 'Bhopal Shatabdi Express';
      origin = 'New Delhi (NDLS)';
      destination = 'Rani Kamlapati (RKMP), Bhopal';
      platform = 'PF 2';
    } else if (num.includes('12626')) {
      trainName = 'Kerala Superfast Express';
      origin = 'New Delhi (NDLS)';
      destination = 'Trivandrum Central (TVC)';
      platform = 'PF 3';
    } else if (num.includes('12260')) {
      trainName = 'Sealdah Duronto Express';
      origin = 'Bikaner Junction (BKN)';
      destination = 'Sealdah (SDAH)';
      platform = 'PF 4';
    } else if (num) {
      trainName = `Train #${num} Superfast Express`;
      origin = 'Central Railway Station';
      destination = 'Terminal Junction';
    }

    const defaultTrainNum = destLower.includes('goa') ? '10111' : destLower.includes('mumbai') ? '12951' : destLower.includes('bali') ? '104' : '22901';

    return {
      trainNumber: num || defaultTrainNum,
      trainName,
      origin,
      destination,
      departureTime: new Date(Date.now() - 7200000).toISOString(),
      arrivalTime: new Date(Date.now() + 14400000).toISOString(),
      platform,
      coach: 'B2',
      seat: '45 (Side Lower)',
      status: 'On Time - Running smooth on main line',
      delayMinutes: 0
    };
  }
}
