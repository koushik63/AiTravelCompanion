import React, { useState, useEffect } from 'react';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { Trip } from '../../types';
import { validateDestination } from '../../utils/destinationValidator';
import { AlertCircle } from 'lucide-react';

interface TripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (tripData: Partial<Trip>) => void;
  initialData?: Trip | null;
  defaultDestination?: string;
}

export const TripModal: React.FC<TripModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultDestination
}) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [destination, setDestination] = useState(defaultDestination || initialData?.destination || '');
  const [country, setCountry] = useState(initialData?.country || 'India');
  const [startDate, setStartDate] = useState(initialData?.startDate?.split('T')[0] || new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(initialData?.endDate?.split('T')[0] || new Date(Date.now() + 604800000).toISOString().split('T')[0]);
  const [budget, setBudget] = useState(initialData?.budget || 50000);
  const [currency, setCurrency] = useState(initialData?.currency || 'INR');
  const [travelType, setTravelType] = useState<any>(initialData?.travelType || 'Leisure');
  const [transportType, setTransportType] = useState<any>(initialData?.transportType || 'Flight');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (defaultDestination) {
      setDestination(defaultDestination);
      setTitle(`Journey to ${defaultDestination}`);
    }
  }, [defaultDestination]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const validation = validateDestination(destination);
    if (!validation.isValid) {
      setErrorMsg(validation.errorMessage || `The place "${destination}" does not exist. Please enter a valid destination.`);
      return;
    }

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
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Input
          label="Trip Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Summer Vacation in Paris"
          required
        />
        <Input
          label="Destination City / Region"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="e.g. Goa, Paris, Tokyo, Dubai..."
          required
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Start Date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
          <Input
            label="End Date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Budget"
            type="number"
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            required
          />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Currency</label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Travel Type</label>
            <select
              value={travelType}
              onChange={(e) => setTravelType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="Leisure">Leisure</option>
              <option value="Solo">Solo</option>
              <option value="Family">Family</option>
              <option value="Business">Business</option>
              <option value="Adventure">Adventure</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Transport</label>
            <select
              value={transportType}
              onChange={(e) => setTransportType(e.target.value as any)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500"
            >
              <option value="Flight">Flight</option>
              <option value="Train">Train</option>
              <option value="Bus">Bus</option>
              <option value="Car">Car</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {initialData ? 'Update Trip' : 'Save Journey'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
