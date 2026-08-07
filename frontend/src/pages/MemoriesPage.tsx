import React, { useState, useEffect, useRef } from 'react';
import { Camera, Plus, Sparkles, MapPin, Upload, Link, X, Image as ImageIcon } from 'lucide-react';
import { MemoryService } from '../services/api';
import { useTravelStore } from '../store/useTravelStore';
import { useUIStore } from '../store/useUIStore';
import { useAuth } from '../context/AuthContext';
import { MemoryCard } from '../components/memories/MemoryCard';
import { ShareModal } from '../components/memories/ShareModal';
import { ExportModal } from '../components/memories/ExportModal';
import { MemoryLightboxModal } from '../components/memories/MemoryLightboxModal';
import { Memory } from '../types';

export const MemoriesPage: React.FC = () => {
  const { activeTrip } = useTravelStore();
  const { user } = useAuth();
  const { addToast } = useUIStore();
  const [memories, setMemories] = useState<Memory[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // New Memory State
  const [imageSourceMode, setImageSourceMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tripId = activeTrip?.id || '';
  const memoryUserKey = user?.id || user?.email || 'demo_user';
  const storageKey = `ai_travel_user_memories_${memoryUserKey}`;

  useEffect(() => {
    const localStr = localStorage.getItem(storageKey);
    const localMems: Memory[] = localStr ? JSON.parse(localStr) : [];

    MemoryService.getMemories(tripId)
      .then((serverMems) => {
        const combinedMap = new Map<string, Memory>();
        (serverMems || []).forEach((m: Memory) => combinedMap.set(m.id, m));
        localMems.forEach((m: Memory) => combinedMap.set(m.id, m));

        const merged = Array.from(combinedMap.values()).sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setMemories(merged);
      })
      .catch(() => {
        setMemories(localMems);
      });
  }, [tripId, storageKey]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast({ type: 'error', message: 'Please select a valid image file (JPG, PNG, WEBP).' });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      addToast({ type: 'error', message: 'Image size must be less than 10MB.' });
      return;
    }

    setSelectedFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (dataUrl) {
        setImageUrl(dataUrl);
        addToast({ type: 'success', message: `Imported "${file.name}" from local device!` });
      }
    };
    reader.readAsDataURL(file);
  };

  const resetForm = () => {
    setImageUrl('');
    setSelectedFileName('');
    setCaption('');
    setLocation('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl.trim() || !caption.trim()) {
      addToast({ type: 'error', message: 'Please attach an image and enter a caption.' });
      return;
    }

    try {
      const newMem = await MemoryService.addMemory({
        tripId,
        imageUrl: imageUrl.trim(),
        caption: caption.trim(),
        location: location.trim()
      });

      // Save to localStorage for instant 100% persistence
      const localStr = localStorage.getItem(storageKey);
      const localMems: Memory[] = localStr ? JSON.parse(localStr) : [];
      const updatedLocal = [newMem, ...localMems.filter((m) => m.id !== newMem.id)];
      localStorage.setItem(storageKey, JSON.stringify(updatedLocal));

      setMemories((prev) => [newMem, ...prev.filter((m) => m.id !== newMem.id)]);
      window.dispatchEvent(new Event('memories-updated'));
      resetForm();
      setShowAddModal(false);
      addToast({ type: 'success', message: 'Memory created & saved to calendar!' });
    } catch (err: any) {
      // Local fallback memory creation
      const fallbackMem: Memory = {
        id: `mem_local_${Date.now()}`,
        tripId: tripId || 'trip_3',
        imageUrl: imageUrl.trim(),
        caption: caption.trim(),
        aiCaption: `✨ AI Memory Tag: Highlights of ${caption.trim()}`,
        location: location.trim() || 'Destination',
        createdAt: new Date().toISOString()
      };
      const localStr = localStorage.getItem(storageKey);
      const localMems: Memory[] = localStr ? JSON.parse(localStr) : [];
      const updatedLocal = [fallbackMem, ...localMems];
      localStorage.setItem(storageKey, JSON.stringify(updatedLocal));
      setMemories((prev) => [fallbackMem, ...prev]);
      window.dispatchEvent(new Event('memories-updated'));
      resetForm();
      setShowAddModal(false);
      addToast({ type: 'success', message: 'Memory created & saved locally!' });
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await MemoryService.deleteMemory(id);
    } catch (e) {}

    setMemories((prev) => prev.filter((m) => m.id !== id));

    const localStr = localStorage.getItem(storageKey);
    if (localStr) {
      const localMems: Memory[] = JSON.parse(localStr);
      const updated = localMems.filter((m) => m.id !== id);
      localStorage.setItem(storageKey, JSON.stringify(updated));
    }

    window.dispatchEvent(new Event('memories-updated'));

    if (lightboxIndex !== null) {
      setLightboxIndex(null);
    }

    addToast({ type: 'info', message: 'Memory photo deleted successfully.' });
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Camera className="w-6 h-6 text-amber-400" /> Travel Memories & Photo Album
          </h1>
          <p className="text-xs text-slate-400">Import photos from local device or paste web URLs. Enlarged lightbox viewer & calendar sync active!</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setShowAddModal(true)} className="glass-button text-xs py-2.5 px-5 flex items-center gap-1.5 shadow-xl shadow-sky-500/20 cursor-pointer">
            <Plus className="w-4 h-4" /> Add Memory
          </button>
        </div>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory, idx) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            onClick={() => setLightboxIndex(idx)}
            onDelete={() => handleDeleteMemory(memory.id)}
          />
        ))}
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <form onSubmit={handleAddMemory} className="glass-panel p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 text-lg">Create Travel Memory</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Input Mode Selector Tabs */}
            <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setImageSourceMode('upload')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  imageSourceMode === 'upload' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" /> Import from Device
              </button>
              <button
                type="button"
                onClick={() => setImageSourceMode('url')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                  imageSourceMode === 'url' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Link className="w-3.5 h-3.5" /> Image URL
              </button>
            </div>

            {imageSourceMode === 'upload' ? (
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 block">Local Device Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  className="hidden"
                />

                {imageUrl && imageUrl.startsWith('data:') ? (
                  <div className="relative h-44 rounded-xl overflow-hidden border border-amber-500/40 bg-slate-950 group">
                    <img src={imageUrl} alt="Uploaded Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setImageUrl('');
                        setSelectedFileName('');
                        if (fileInputRef.current) fileInputRef.current.value = '';
                      }}
                      className="absolute top-2 right-2 bg-slate-950/80 text-rose-400 p-1.5 rounded-lg border border-slate-800 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                      title="Remove image"
                    >
                      <X className="w-4 h-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 right-2 bg-slate-950/85 px-3 py-1 rounded-lg text-[10px] text-amber-300 truncate border border-slate-800 font-semibold">
                      ✓ {selectedFileName || 'Local image ready'}
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-700 hover:border-amber-500/60 rounded-2xl p-6 text-center bg-slate-950/50 hover:bg-slate-900/60 transition-all cursor-pointer space-y-2 group"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-200">Click to browse & import photo from device</p>
                      <p className="text-[10px] text-slate-400">Supports JPG, PNG, WEBP files up to 10MB</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Web Image URL</label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  required={imageSourceMode === 'url'}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Caption / Moment</label>
              <input
                type="text"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Sunset at Nohkalikai Falls"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Cherrapunji, Meghalaya"
                required
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800/80">
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="glass-button-secondary text-xs py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!imageUrl.trim()}
                className="glass-button text-xs py-2 px-6 cursor-pointer disabled:opacity-50"
              >
                Save Memory
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Image Lightbox Modal */}
      <MemoryLightboxModal
        isOpen={lightboxIndex !== null}
        onClose={() => setLightboxIndex(null)}
        memories={memories}
        currentIndex={lightboxIndex ?? 0}
        onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        onDelete={handleDeleteMemory}
      />

      {/* Share & Export Modals */}
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} tripId={tripId} />
      <ExportModal isOpen={showExportModal} onClose={() => setShowExportModal(false)} tripId={tripId} />
    </div>
  );
};
