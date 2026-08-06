import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { NotificationCard } from '../components/notifications/NotificationCard';
import { NotificationItem } from '../types';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      userId: 'usr_demo_1',
      title: 'Flight Boarding Alert',
      message: 'IndiGo flight 6E 504 to Goa departs in 3 hours from Terminal 3, Gate 14B.',
      type: 'BOARDING',
      isRead: false,
      createdAt: new Date().toISOString()
    },
    {
      id: 'n2',
      userId: 'usr_demo_1',
      title: 'Weather Warning: Pleasant Coastal Skies',
      message: 'Expect 29°C clear sunny weather in Goa today. Remember sunscreen!',
      type: 'WEATHER',
      isRead: false,
      createdAt: new Date(Date.now() - 3600000).toISOString()
    },
    {
      id: 'n3',
      userId: 'usr_demo_1',
      title: 'Budget Allocation Update',
      message: 'You have logged ₹1,200 for Seafood Dinner. ₹32,500 remains in your budget.',
      type: 'BUDGET',
      isRead: true,
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ]);

  const handleMarkRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <Bell className="w-6 h-6 text-sky-400" /> Notifications & Alerts
          </h1>
          <p className="text-xs text-slate-400">Flight updates, weather warnings, and budget alerts</p>
        </div>

        <button onClick={handleMarkAllRead} className="glass-button-secondary text-xs py-2 px-4 flex items-center gap-1.5">
          <CheckCheck className="w-4 h-4" /> Mark All as Read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} />
        ))}
      </div>
    </div>
  );
};
