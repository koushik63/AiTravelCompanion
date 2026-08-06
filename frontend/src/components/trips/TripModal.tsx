import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Trip } from '../../types';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: Partial<Trip>) => void;
  initialData?: Trip | null;
}

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [destination, setDestination] = useState(initialData?.destination || '');
  const [country, setCountry] = useState(initialData?.country || 'India');
  const [startDate, setStartDate] = useState(initialData?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(initialData?.endDate?.split('T')[0] || new Date(Date.now() + 604800000).toISOString().split('T')[0]);
  const [budget, setBudget] = useState(initialData?.budget || 50000);
  const [currency, setCurrency] = useState(initialData?.currency || 'INR');
  const [travelType, setTravelType] = useState(initialData?.travelType || 'Leisure');
  const [transportType, setTransportType] = useState(initialData?.transportType || 'Flight');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title: title || `Journey to ${destination}`,
      destination,
      country,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      budget: Number(budget),
      currency,
      travelType: travelType as any,
      transportType: transportType as any,
      status: 'UPCOMING'
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Trip' : 'Create New Trip'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Trip Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Summer Beach Vacation" />
        <div className="grid grid-cols-2 gap-3">
          <Input label="Destination" value={destination} onChange={(e) => setDestination(e.target.value)} required placeholder="Goa" />
          <Input label="Country" value={country} onChange={(e) => setCountry(e.target.value)} placeholder="India" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
          <Input label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Budget" type="number" value={budget} onChange={(e) => setBudget(Number(e.target.value))} required />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Currency</label>
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500">
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Travel Style</label>
            <select value={travelType} onChange={(e) => setTravelType(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500">
              <option value="Leisure">Leisure</option>
              <option value="Solo">Solo</option>
              <option value="Family">Family</option>
              <option value="Business">Business</option>
              <option value="Adventure">Adventure</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Transport Type</label>
            <select value={transportType} onChange={(e) => setTransportType(e.target.value as any)} className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500">
              <option value="Flight">Flight</option>
              <option value="Train">Train</option>
              <option value="Car">Car</option>
              <option value="Bus">Bus</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
          <Button variant="secondary" size="sm" type="button" onClick={onClose}>Cancel</Button>
          <Button size="sm" type="submit">{initialData ? 'Update Trip' : 'Create Trip'}</Button>
        </div>
      </form>
    </Modal>
  );
};
