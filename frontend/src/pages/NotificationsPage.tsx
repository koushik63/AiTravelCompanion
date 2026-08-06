import React, { useState } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { NotificationCard } from '../components/notifications/NotificationCard';
import { NotificationItem } from '../types';
import { EmptyState } from '../components/ui/EmptyState';

export const NotificationsPage: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

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

      {notifications.length === 0 ? (
        <EmptyState
          title="No Notifications"
          description="You are all caught up! Trip alerts and flight updates will appear here when active."
        />
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <NotificationCard key={n.id} notification={n} onMarkRead={handleMarkRead} />
          ))}
        </div>
      )}
    </div>
  );
};
