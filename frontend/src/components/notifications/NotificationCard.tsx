import React from 'react';
import { Bell, Check, Clock, ShieldAlert, CloudRain } from 'lucide-react';
import { NotificationItem } from '../../types';

interface NotificationCardProps {
  notification: NotificationItem;
  onMarkRead: (id: string) => void;
}

export const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onMarkRead }) => {
  return (
    <div
      className={`p-4 rounded-xl border transition-colors flex items-start justify-between gap-4 ${
        notification.isRead
          ? 'bg-slate-950/40 border-slate-900 text-slate-400'
          : 'bg-slate-900/90 border-slate-800 text-slate-100'
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-xl bg-sky-500/10 text-sky-400 border border-sky-500/20 flex items-center justify-center shrink-0 mt-0.5">
          <Bell className="w-4 h-4" />
        </div>
        <div className="space-y-1">
          <h4 className="font-bold text-xs">{notification.title}</h4>
          <p className="text-[11px] text-slate-400 leading-relaxed">{notification.message}</p>
          <span className="text-[10px] text-slate-500 block">
            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      {!notification.isRead && (
        <button
          onClick={() => onMarkRead(notification.id)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs flex items-center gap-1 shrink-0"
        >
          <Check className="w-3.5 h-3.5" /> Mark Read
        </button>
      )}
    </div>
  );
};
