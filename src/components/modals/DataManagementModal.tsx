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
    resetToDefault 
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
          importData(parsed.items);
        } else {
          alert('Invalid JSON file format.');
        }
      } catch (err) {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md glass-modal rounded-2xl sm:rounded-3xl overflow-hidden my-auto animate-slide-up max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-white/[0.08] bg-white/[0.02] shrink-0">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white">
              Data Management & Backup
            </h3>
            <p className="text-[10px] sm:text-[11px] text-[#86868b]">
              Export, import, or restore GTM Strategy dataset
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#86868b] hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 text-xs overflow-y-auto flex-1">
          
          {/* Info pill */}
          <div className="p-3 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/[0.06] text-[#86868b] flex items-center justify-between">
            <span>Current Initiatives:</span>
            <span className="font-mono font-bold text-white text-xs">{items.length} items</span>
          </div>

          {/* Export section */}
          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
              Export Dataset
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={exportDataExcel}
                className="p-3 rounded-xl sm:rounded-2xl glass-btn text-left hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center space-x-2 text-white font-semibold mb-0.5">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <span>Excel (.xlsx)</span>
                </div>
                <p className="text-[10px] text-[#86868b]">
                  Full matrix spreadsheet file
                </p>
              </button>

              <button
                onClick={exportDataJSON}
                className="p-3 rounded-xl sm:rounded-2xl glass-btn text-left hover:border-blue-500/40 transition-all group"
              >
                <div className="flex items-center space-x-2 text-white font-semibold mb-0.5">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span>JSON File</span>
                </div>
                <p className="text-[10px] text-[#86868b]">
                  Structured backup dataset
                </p>
              </button>
            </div>
          </div>

          {/* Import section */}
          <div className="space-y-2 pt-2 border-t border-white/[0.06]">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#86868b]">
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
              className="w-full p-3 rounded-xl sm:rounded-2xl glass-btn text-left hover:border-purple-500/40 transition-all flex items-center justify-between"
            >
              <div className="flex items-center space-x-2.5">
                <Upload className="w-4 h-4 text-purple-400" />
                <div>
                  <div className="font-semibold text-white">Import JSON Backup</div>
                  <div className="text-[10px] text-[#86868b]">Restore previously saved GTM data</div>
                </div>
              </div>
              <Download className="w-3.5 h-3.5 text-[#86868b]" />
            </button>
          </div>

          {/* Reset section */}
          <div className="pt-2 border-t border-white/[0.06]">
            <button
              onClick={() => {
                if (confirm('Reset dashboard to default baseline data? Any unsaved custom items will be replaced.')) {
                  resetToDefault();
                }
              }}
              className="w-full p-2.5 rounded-xl sm:rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
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
