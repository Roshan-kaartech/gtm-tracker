import React, { useState } from 'react';
import { useGTM } from '../../context/GTMContext';
import { MilestoneStatus } from '../../types/gtm';
import { OWNER_AVATARS } from '../../data/initialData';
import { 
  Check, 
  AlertCircle, 
  Calendar
} from 'lucide-react';

interface MilestoneRow {
  parentItemId: string;
  parentItemTitle: string;
  stream: string;
  owner: string;
  milestoneKey: 'milestone1' | 'milestone2' | 'milestone3';
  milestoneIndex: number;
  name: string;
  targetDate: string;
  status: MilestoneStatus;
  notes?: string;
}

export const MilestonesView: React.FC = () => {
  const { filteredItems, cycleMilestoneStatus } = useGTM();
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const allMilestones: MilestoneRow[] = [];

  filteredItems.forEach(item => {
    [
      { key: 'milestone1' as const, m: item.milestone1, idx: 1 },
      { key: 'milestone2' as const, m: item.milestone2, idx: 2 },
      { key: 'milestone3' as const, m: item.milestone3, idx: 3 }
    ].forEach(({ key, m, idx }) => {
      if (m && m.status !== 'not-applicable' && m.name && m.name !== 'N/A') {
        allMilestones.push({
          parentItemId: item.id,
          parentItemTitle: item.title,
          stream: item.stream,
          owner: item.owner,
          milestoneKey: key,
          milestoneIndex: idx,
          name: m.name,
          targetDate: m.targetDate,
          status: m.status,
          notes: m.notes
        });
      }
    });
  });

  const displayedMilestones = allMilestones.filter(m => {
    if (statusFilter === 'all') return true;
    return m.status === statusFilter;
  });

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-3.5 sm:px-4 py-2.5 rounded-2xl sm:rounded-3xl glass-card">
        <div>
          <h3 className="text-xs font-bold text-black">
            Milestones Breakdown ({displayedMilestones.length})
          </h3>
          <p className="text-[10px] sm:text-[11px] text-[#4b5563]">
            Tap any status pill to cycle its completion state.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1 glass-segmented overflow-x-auto max-w-full no-scrollbar p-1">
          {[
            { id: 'all', label: 'All' },
            { id: 'completed', label: 'Done' },
            { id: 'in-progress', label: 'Active' },
            { id: 'delayed', label: 'Delayed' },
            { id: 'upcoming', label: 'Upcoming' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1 text-xs font-bold glass-segmented-btn whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'active text-white'
                  : 'text-[#4b5563] hover:text-[#9E1B1E]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================
          1. MOBILE MILESTONE CARDS (< 768px)
      ========================================================= */}
      <div className="block md:hidden space-y-2.5">
        {displayedMilestones.map(m => {
          const avatar = OWNER_AVATARS[m.owner] || {
            bg: 'bg-[#9E1B1E] text-white',
            initial: m.owner ? m.owner.slice(0, 2).toUpperCase() : '?',
            role: 'Contributor'
          };
          const isCompleted = m.status === 'completed';
          const isInProgress = m.status === 'in-progress';
          const isDelayed = m.status === 'delayed';

          return (
            <div 
              key={`m-card-${m.parentItemId}-${m.milestoneKey}`}
              className="glass-card rounded-2xl p-3.5 space-y-2.5 border border-[#9E1B1E]/12"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="px-1.5 py-0.2 rounded bg-stone-100 text-[9px] font-mono text-black font-bold">
                      M{m.milestoneIndex}
                    </span>
                    <span className="text-[10px] font-mono text-[#4b5563] flex items-center font-semibold">
                      <Calendar className="w-2.5 h-2.5 mr-0.5 text-[#DE3A1E]" />
                      {m.targetDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-black leading-snug">
                    {m.name}
                  </h4>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#4b5563] border-t border-stone-100 pt-2">
                <div className="truncate pr-2">
                  <span className="text-black font-bold">{m.parentItemTitle}</span>
                  <span className="text-[#9E1B1E]"> • {m.stream}</span>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] ${avatar.bg}`}>
                    {avatar.initial}
                  </div>
                  <span className="text-black font-bold text-[10px]">{m.owner}</span>
                </div>
              </div>

              {/* Status Action Button */}
              <button
                onClick={() => cycleMilestoneStatus(m.parentItemId, m.milestoneKey)}
                className={`w-full py-2 px-3 rounded-xl font-bold text-[10px] uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
                  isCompleted
                    ? 'glass-status-completed'
                    : isInProgress
                    ? 'glass-status-active'
                    : isDelayed
                    ? 'glass-status-delayed'
                    : 'glass-status-upcoming'
                }`}
              >
                {isCompleted && <Check className="w-3 h-3" />}
                {isInProgress && <span className="w-2 h-2 rounded-full bg-[#DE3A1E] animate-pulse"></span>}
                {isDelayed && <AlertCircle className="w-3 h-3" />}
                <span>Status: {isCompleted ? 'Done' : isInProgress ? 'Active' : isDelayed ? 'Delayed' : 'Upcoming'} (Tap to change)</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* =========================================================
          2. DESKTOP MILESTONES TABLE (>= 768px)
      ========================================================= */}
      <div className="hidden md:block glass-card rounded-3xl overflow-hidden shadow-md border border-[#9E1B1E]/12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-stone-50 border-b border-[#9E1B1E]/15 text-[10px] font-bold uppercase tracking-wider text-[#4b5563]">
                <th className="py-3.5 px-4 w-[60px]">Stage</th>
                <th className="py-3.5 px-4 w-[280px]">Milestone Deliverable</th>
                <th className="py-3.5 px-4 w-[180px]">Parent Initiative</th>
                <th className="py-3.5 px-4 w-[150px]">Workstream</th>
                <th className="py-3.5 px-3 w-[110px]">Target</th>
                <th className="py-3.5 px-4 w-[130px]">Owner</th>
                <th className="py-3.5 px-4 w-[120px] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-xs bg-white">
              {displayedMilestones.map(m => {
                const avatar = OWNER_AVATARS[m.owner] || {
                  bg: 'bg-[#9E1B1E] text-white',
                  initial: m.owner ? m.owner.slice(0, 2).toUpperCase() : '?',
                  role: 'Contributor'
                };
                const isCompleted = m.status === 'completed';
                const isInProgress = m.status === 'in-progress';
                const isDelayed = m.status === 'delayed';

                return (
                  <tr 
                    key={`${m.parentItemId}-${m.milestoneKey}`}
                    className="hover:bg-red-50/30 transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono text-[10px] text-[#4b5563]">
                      <span className="px-2 py-0.5 rounded-lg bg-stone-100 border border-stone-200 font-bold text-black">
                        M{m.milestoneIndex}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-black group-hover:text-[#9E1B1E] transition-colors text-xs">
                        {m.name}
                      </div>
                      {m.notes && (
                        <div className="text-[10px] text-[#4b5563] mt-0.5 font-medium">
                          {m.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-black text-xs font-semibold">
                      {m.parentItemTitle}
                    </td>

                    <td className="py-3.5 px-4 text-[#9E1B1E] text-xs font-bold">
                      <span className="px-2 py-0.5 rounded-full bg-red-50 border border-red-200">
                        {m.stream}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[11px] text-black">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-stone-50 border border-stone-200 font-bold">
                        <Calendar className="w-2.5 h-2.5 mr-1 text-[#DE3A1E]" />
                        {m.targetDate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] ${avatar.bg}`}>
                          {avatar.initial}
                        </div>
                        <span className="text-xs text-black font-bold">{m.owner}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => cycleMilestoneStatus(m.parentItemId, m.milestoneKey)}
                        className={`w-full py-1.5 px-2.5 rounded-full font-bold text-[10px] uppercase tracking-wider border transition-all flex items-center justify-center gap-1 ${
                          isCompleted
                            ? 'glass-status-completed'
                            : isInProgress
                            ? 'glass-status-active'
                            : isDelayed
                            ? 'glass-status-delayed'
                            : 'glass-status-upcoming'
                        }`}
                        title="Click to cycle status"
                      >
                        {isCompleted && <Check className="w-2.5 h-2.5" />}
                        {isInProgress && <span className="w-1.5 h-1.5 rounded-full bg-[#DE3A1E] animate-pulse"></span>}
                        {isDelayed && <AlertCircle className="w-2.5 h-2.5" />}
                        {isCompleted ? 'Done' : isInProgress ? 'Active' : isDelayed ? 'Delayed' : 'Upcoming'}
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
