import { DatabaseService } from './DatabaseService';

export class ExportService {
  static async exportTripJSON(tripId: string) {
    const trip = await DatabaseService.getTripById(tripId);
    if (!trip) throw new Error('Trip not found');
    return JSON.stringify(trip, null, 2);
  }

  static async exportTripPDF(tripId: string) {
    const trip = await DatabaseService.getTripById(tripId);
    if (!trip) throw new Error('Trip not found');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Travel Summary - ${trip.title}</title>
        <style>
          body { font-family: sans-serif; padding: 40px; color: #1e293b; }
          h1 { color: #0284c7; }
          .section { margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 15px; }
          .badge { background: #e0f2fe; color: #0369a1; padding: 4px 8px; border-radius: 6px; font-weight: bold; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>${trip.title}</h1>
        <p><strong>Destination:</strong> ${trip.destination} | <strong>Budget:</strong> ${trip.currency} ${trip.budget}</p>
        <div class="section">
          <h3>Itinerary Summary</h3>
          <p>${trip.description || 'Customized AI travel itinerary.'}</p>
        </div>
      </body>
      </html>
    `;
  }
}
