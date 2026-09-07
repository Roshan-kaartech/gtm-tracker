import React, { useRef } from 'react';
import { useGTM } from '../../context/GTMContext';
import { 
  X, 
  Upload, 
  Download, 
  RotateCcw, 
  FileSpreadsheet, 
  Code
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DataManagementModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { 
    items, 
    exportDataExcel, 
    exportDataJSON, 
    importData, 
    resetToDefault,
    showToast,
    setDeadline,
    setCycleTitle
  } = useGTM();

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          importData(parsed);
        } else if (parsed && Array.isArray(parsed.items)) {
          if (parsed.deadline && typeof parsed.deadline === 'string') {
            setDeadline(parsed.deadline);
          }
          if (parsed.cycleTitle && typeof parsed.cycleTitle === 'string') {
            setCycleTitle(parsed.cycleTitle);
          }
          importData(parsed.items);
        } else {
          showToast('Invalid JSON file format. Please upload valid GTM dataset.', 'error');
        }
      } catch {
        showToast('Failed to parse JSON file.', 'error');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md glass-modal rounded-2xl sm:rounded-3xl overflow-hidden my-auto animate-slide-up max-h-[90vh] flex flex-col border border-kaar-deepRed/20 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 bg-white/60 shrink-0">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-gray-900">
              Data Management & Backup
            </h3>
            <p className="text-[10px] sm:text-[11px] text-gray-500">
              Export, import, or restore GTM Strategy dataset
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-kaar-deepRed hover:bg-kaar-deepRed/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-xs overflow-y-auto flex-1 bg-white/40">
          
          {/* Info pill */}
          <div className="p-3 rounded-xl sm:rounded-2xl bg-white border border-kaar-deepRed/15 shadow-sm text-gray-600 flex items-center justify-between">
            <span>Current Initiatives:</span>
            <span className="font-mono font-bold text-gray-900 text-xs">{items.length} items</span>
          </div>

          {/* Export section */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Export Dataset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={exportDataExcel}
                className="p-3 rounded-xl sm:rounded-2xl glass-btn text-left hover:border-emerald-500/50 hover:bg-emerald-50/30 transition-all group"
              >
                <div className="flex items-center space-x-2 text-gray-900 font-semibold mb-0.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Excel (.xlsx)</span>
                </div>
                <p className="text-[10px] text-gray-500">
                  Full matrix spreadsheet file
                </p>
              </button>

              <button
                onClick={exportDataJSON}
                className="p-3 rounded-xl sm:rounded-2xl glass-btn text-left hover:border-blue-500/50 hover:bg-blue-50/30 transition-all group"
              >
                <div className="flex items-center space-x-2 text-gray-900 font-semibold mb-0.5">
                  <Code className="w-4 h-4 text-blue-600" />
                  <span>JSON File</span>
                </div>
                <p className="text-[10px] text-gray-500">
                  Structured backup dataset
                </p>
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="space-y-2 pt-2 border-t border-gray-100">
            <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">
              Import & Restore
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-3 rounded-xl sm:rounded-2xl glass-btn text-left hover:border-purple-500/50 hover:bg-purple-50/30 transition-all flex items-center justify-between"
            >
              <div className="flex items-center space-x-2.5">
                <Upload className="w-4 h-4 text-purple-600" />
                <div>
                  <div className="font-semibold text-gray-900">Import JSON Backup</div>
                  <div className="text-[10px] text-gray-500">Restore previously saved GTM data</div>
                </div>
              </div>
              <Download className="w-3.5 h-3.5 text-gray-400" />
            </button>
          </div>

          {/* Reset section */}
          <div className="pt-2 border-t border-gray-100">
            <button
              onClick={() => {
                if (confirm('Reset dashboard to default baseline data? Any unsaved custom items will be replaced.')) {
                  resetToDefault();
                }
              }}
              className="w-full p-2.5 rounded-xl sm:rounded-2xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset to Baseline Data
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
