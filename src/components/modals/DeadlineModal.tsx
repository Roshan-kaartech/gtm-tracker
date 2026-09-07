import React, { useState, useEffect } from 'react';
import { useGTM } from '../../context/GTMContext';
import { 
  X, 
  CalendarDays, 
  Sparkles, 
  ArrowRight
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DeadlineModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { 
    deadline, 
    cycleTitle, 
    setDeadline, 
    setCycleTitle, 
    startNextTrackerCycle,
    stats
  } = useGTM();

  const [inputDeadline, setInputDeadline] = useState(deadline);
  const [inputCycleTitle, setInputCycleTitle] = useState(cycleTitle);
  const [resetMilestones, setResetMilestones] = useState(false);
  const [activeTab, setActiveTab] = useState<'edit' | 'next-cycle'>('edit');

  useEffect(() => {
    setInputDeadline(deadline);
    setInputCycleTitle(cycleTitle);
    setResetMilestones(false);
  }, [deadline, cycleTitle, isOpen]);

  if (!isOpen) return null;

  const handleSaveOnly = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputDeadline.trim()) return;
    setDeadline(inputDeadline.trim());
    if (inputCycleTitle.trim()) {
      setCycleTitle(inputCycleTitle.trim());
    }
    onClose();
  };

  const handleStartNextCycle = () => {
    if (!inputDeadline.trim() || !inputCycleTitle.trim()) return;
    startNextTrackerCycle(inputDeadline.trim(), inputCycleTitle.trim(), resetMilestones);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md glass-modal rounded-2xl sm:rounded-3xl overflow-hidden my-auto animate-slide-up max-h-[90vh] flex flex-col border border-kaar-deepRed/20 shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 bg-white/60 shrink-0">
          <div className="flex items-center space-x-2.5 min-w-0 pr-2">
            <div className="p-1.5 sm:p-2 rounded-xl sm:rounded-2xl bg-kaar-orangeRed/10 text-kaar-deepRed border border-kaar-orangeRed/20 shadow-sm shrink-0">
              <CalendarDays className="w-4 h-4" />
            </div>
            <div className="min-w-0 truncate">
              <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                Tracker Deadline & Cycle
              </h3>
              <p className="text-[10px] sm:text-[11px] text-gray-500 truncate">
                Adjust target deadline or start next cycle
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-kaar-deepRed hover:bg-kaar-deepRed/5 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="p-3 sm:p-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div className="grid grid-cols-2 glass-segmented p-1">
            <button
              onClick={() => setActiveTab('edit')}
              className={`py-1.5 text-xs font-semibold glass-segmented-btn text-center ${
                activeTab === 'edit'
                  ? 'active text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Update Deadline
            </button>
            <button
              onClick={() => setActiveTab('next-cycle')}
              className={`py-1.5 text-xs font-semibold glass-segmented-btn text-center flex items-center justify-center gap-1 ${
                activeTab === 'next-cycle'
                  ? 'active text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Next Cycle</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1 bg-white/40">
          
          {activeTab === 'edit' ? (
            <form onSubmit={handleSaveOnly} className="space-y-3.5 sm:space-y-4">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Target Deadline Date
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 30-Sep, 15-Oct, 31-Dec, 2026-11-30"
                  value={inputDeadline}
                  onChange={e => setInputDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-2xl glass-input text-gray-900 font-mono placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  Cycle / Period Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q3 2026 Strategy, Q4 Execution Sprint"
                  value={inputCycleTitle}
                  onChange={e => setInputCycleTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-2xl glass-input text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* Quick Presets */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 block mb-1.5">
                  Quick Presets
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {['30-Sep', '15-Oct', '31-Oct', '15-Nov', '31-Dec', 'Q1 2027'].map(preset => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setInputDeadline(preset)}
                      className="px-2.5 py-1 rounded-xl text-[11px] font-mono glass-btn text-gray-700 hover:text-kaar-deepRed transition-all"
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 glass-btn rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 sm:px-5 py-1.5 text-xs font-semibold rounded-full glass-btn-primary"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-3.5 sm:space-y-4">
              <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-kaar-deepRed/15 shadow-sm text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">Current Progress:</span>
                  <span className="font-mono font-bold text-emerald-600">{stats.overallProgress}%</span>
                </div>
                <p className="text-[10px] sm:text-[11px] text-gray-500">
                  {stats.completedMilestones} of {stats.totalMilestones} milestones completed.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  New Tracker Cycle Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q4 2026 Strategy & Scaling"
                  value={inputCycleTitle}
                  onChange={e => setInputCycleTitle(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-2xl glass-input text-gray-900 placeholder-gray-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                  New Target Deadline
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 31-Dec, 15-Nov, 2027-03-31"
                  value={inputDeadline}
                  onChange={e => setInputDeadline(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-2xl glass-input text-gray-900 font-mono placeholder-gray-400 focus:outline-none"
                />
              </div>

              {/* Reset milestone option */}
              <label className="flex items-start space-x-2.5 p-3 rounded-xl sm:rounded-2xl bg-white border border-gray-200/80 cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="checkbox"
                  checked={resetMilestones}
                  onChange={e => setResetMilestones(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-kaar-deepRed focus:ring-0 focus:ring-offset-0 bg-white"
                />
                <div className="text-xs">
                  <span className="font-semibold text-gray-900 block">
                    Reset milestone statuses for the new cycle
                  </span>
                  <span className="text-[10px] text-gray-500">
                    Sets all milestone statuses to "Upcoming" (0%) while retaining all 17 deliverable titles and team leads.
                  </span>
                </div>
              </label>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 glass-btn rounded-full transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartNextCycle}
                  className="px-4 sm:px-5 py-1.5 text-xs font-semibold rounded-full glass-btn-primary flex items-center gap-1.5"
                >
                  <span>Launch Next Cycle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
