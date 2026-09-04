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
            className="pointer-events-auto flex items-center justify-between p-3 rounded-2xl glass-modal shadow-2xl text-[#f5f5f7] border border-white/[0.18]"
          >
            <div className="flex items-center space-x-2.5 pr-3">
              {isSuccess && <Check className="w-4 h-4 text-emerald-400 shrink-0 shadow-[0_0_8px_#30d158]" />}
              {isError && <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 shadow-[0_0_8px_#ff453a]" />}
              {isWarning && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 shadow-[0_0_8px_#ffd60a]" />}
              {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400 shrink-0 shadow-[0_0_8px_#2997ff]" />}
              <span className="text-xs font-medium leading-tight">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-full text-[#86868b] hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
