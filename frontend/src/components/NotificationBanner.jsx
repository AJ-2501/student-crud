import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function NotificationBanner({ notification, onDismiss }) {
  if (!notification || !notification.message) return null;

  const isSuccess = notification.type === 'success';
  const isError = notification.type === 'error';

  const containerClasses = isSuccess
    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
    : isError
    ? 'bg-rose-50 border-rose-200 text-rose-800'
    : 'bg-blue-50 border-blue-200 text-blue-800';

  const iconClasses = isSuccess
    ? 'text-emerald-500'
    : isError
    ? 'text-rose-500'
    : 'text-blue-500';

  return (
    <div
      role="alert"
      className={`border rounded-xl p-4 mb-6 flex items-start justify-between shadow-xs transition-all duration-300 animate-in fade-in-50 slide-in-from-top-2 ${containerClasses}`}
    >
      <div className="flex items-center gap-3">
        {isSuccess && <CheckCircle2 className={`w-5 h-5 shrink-0 ${iconClasses}`} />}
        {isError && <AlertCircle className={`w-5 h-5 shrink-0 ${iconClasses}`} />}
        {!isSuccess && !isError && <Info className={`w-5 h-5 shrink-0 ${iconClasses}`} />}
        <p className="text-sm font-medium">{notification.message}</p>
      </div>

      <button
        onClick={onDismiss}
        aria-label="Close notification"
        className="p-1 rounded-md hover:bg-black/5 transition-colors"
      >
        <X className="w-4 h-4 opacity-70 hover:opacity-100" />
      </button>
    </div>
  );
}
