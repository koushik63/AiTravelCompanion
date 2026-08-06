import React, { useState, useEffect } from 'react';
import { Camera, Plus, Share2, Download, Sparkles, MapPin } from 'lucide-react';
import { MemoryService } from '../services/api';
import { useTravelStore } from '../store/useTravelStore';
import { useUIStore } from '../store/useUIStore';
import { MemoryCard } from '../components/memories/MemoryCard';
import { ShareModal } from '../components/memories/ShareModal';
import { ExportModal } from '../components/memories/ExportModal';
import { Memory } from '../types';

export const MemoriesPage: React.FC = () => {
  const { activeTrip } = useTravelStore();
  const { addToast } = useUIStore();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // New Memory State
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');

  const tripId = activeTrip?.id || '';

  useEffect(() => {
    MemoryService.getMemories(tripId).then(setMemories).catch(() => {});
  }, [tripId]);

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || !caption.trim()) return;

    try {
      const newMem = await MemoryService.addMemory({
        tripId,
        imageUrl: imageUrl.trim(),
        caption: caption.trim(),
        location: location.trim()
      });
      setMemories((prev) => [newMem, ...prev]);
      setShowAddModal(false);
      addToast({ type: 'success', message: 'Memory created with AI Tag!' });
    } catch (err: any) {
      addToast({ type: 'error', message: 'Failed to create memory' });
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Camera className="w-6 h-6 text-amber-400" /> Travel Memories & Photo Album
          </h1>
          <p className="text-xs text-slate-400">Post-travel gallery, AI captions, public sharing, and data export</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowShareModal(true)} className="glass-button-secondary text-xs py-2.5 px-4 flex items-center gap-1.5">
            <Share2 className="w-4 h-4 text-sky-400" /> Share Trip
          </button>
          <button onClick={() => setShowExportModal(true)} className="glass-button-secondary text-xs py-2.5 px-4 flex items-center gap-1.5">
            <Download className="w-4 h-4 text-emerald-400" /> Export PDF
          </button>
          <button onClick={() => setShowAddModal(true)} className="glass-button text-xs py-2.5 px-5 flex items-center gap-1.5 shadow-xl shadow-sky-500/20">
            <Plus className="w-4 h-4" /> Add Memory
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} />
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddMemory} className="glass-panel p-6 max-w-md w-full space-y-4">
            <h3 className="font-bold text-slate-100 text-lg border-b border-slate-800 pb-3">Create Travel Memory</h3>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Image URL</label>
              <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Caption / Moment</label>
              <input type="text" value={caption} onChange={(e) => setCaption(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Location</label>
              <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-sky-500" />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="glass-button-secondary text-xs py-2 px-4">Cancel</button>
              <button type="submit" className="glass-button text-xs py-2 px-6">Save Memory</button>
            </div>
          </form>
        </div>
      )}

      {/* Share & Export Modals */}
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} tripId={tripId} />
      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} tripId={tripId} />
    </div>
  );
};
