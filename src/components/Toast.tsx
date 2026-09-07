import React from 'react';
import { useGTM } from '../context/GTMContext';
import { Check, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toasts, removeToast } = useGTM();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-center justify-between p-3 rounded-2xl glass-modal shadow-2xl text-gray-900 border border-kaar-deepRed/20 bg-white/95"
          >
            <div className="flex items-center space-x-2.5 pr-3">
              {isSuccess && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-kaar-deepRed shrink-0" />}
              <span className="text-xs font-semibold leading-tight text-gray-900">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full text-gray-400 hover:text-kaar-deepRed transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
