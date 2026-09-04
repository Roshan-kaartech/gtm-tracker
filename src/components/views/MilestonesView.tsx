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
          <h3 className="text-xs font-semibold text-white">
            Milestones Breakdown ({displayedMilestones.length})
          </h3>
          <p className="text-[10px] sm:text-[11px] text-[#86868b]">
            Tap any status pill to cycle its completion state.
          </p>
        </div>

        {/* Filter Pills (Scrollable on mobile) */}
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
              className={`px-3 py-1 text-xs font-medium glass-segmented-btn whitespace-nowrap ${
                statusFilter === tab.id
                  ? 'active text-white font-semibold'
                  : 'text-[#86868b] hover:text-white'
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
          const avatar = OWNER_AVATARS[m.owner];
          const isCompleted = m.status === 'completed';
          const isInProgress = m.status === 'in-progress';
          const isDelayed = m.status === 'delayed';

          return (
            <div 
              key={`m-card-${m.parentItemId}-${m.milestoneKey}`}
              className="glass-card rounded-2xl p-3.5 space-y-2.5 border border-white/[0.08]"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5 mb-1">
                    <span className="px-1.5 py-0.2 rounded bg-white/[0.08] text-[9px] font-mono text-white font-bold">
                      M{m.milestoneIndex}
                    </span>
                    <span className="text-[10px] font-mono text-[#86868b] flex items-center">
                      <Calendar className="w-2.5 h-2.5 mr-0.5 text-[#86868b]" />
                      {m.targetDate}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold text-[#f5f5f7] leading-snug">
                    {m.name}
                  </h4>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-[#86868b] border-t border-white/[0.04] pt-2">
                <div className="truncate pr-2">
                  <span className="text-white font-medium">{m.parentItemTitle}</span>
                  <span className="text-[#6e6e73]"> • {m.stream}</span>
                </div>

                <div className="flex items-center space-x-1 shrink-0">
                  <div className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] ${avatar?.bg || 'bg-white/10'}`}>
                    {avatar?.initial || '?'}
                  </div>
                  <span className="text-[#f5f5f7] text-[10px]">{m.owner}</span>
                </div>
              </div>

              {/* Status Action Button */}
              <button
                onClick={() => cycleMilestoneStatus(m.parentItemId, m.milestoneKey)}
                className={`w-full py-2 px-3 rounded-xl font-semibold text-[10px] uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
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
                {isInProgress && <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>}
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
      <div className="hidden md:block glass-card rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="bg-black/60 backdrop-blur-xl border-b border-white/[0.08] text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">
                <th className="py-3.5 px-4 w-[60px]">Stage</th>
                <th className="py-3.5 px-4 w-[280px]">Milestone Deliverable</th>
                <th className="py-3.5 px-4 w-[180px]">Parent Initiative</th>
                <th className="py-3.5 px-4 w-[150px]">Workstream</th>
                <th className="py-3.5 px-3 w-[110px]">Target</th>
                <th className="py-3.5 px-4 w-[130px]">Owner</th>
                <th className="py-3.5 px-4 w-[120px] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {displayedMilestones.map(m => {
                const avatar = OWNER_AVATARS[m.owner];
                const isCompleted = m.status === 'completed';
                const isInProgress = m.status === 'in-progress';
                const isDelayed = m.status === 'delayed';

                return (
                  <tr 
                    key={`${m.parentItemId}-${m.milestoneKey}`}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="py-3.5 px-4 font-mono text-[10px] text-[#86868b]">
                      <span className="px-2 py-0.5 rounded-lg bg-white/[0.04] border border-white/[0.06]">
                        M{m.milestoneIndex}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-[#f5f5f7] group-hover:text-blue-400 transition-colors text-xs">
                        {m.name}
                      </div>
                      {m.notes && (
                        <div className="text-[10px] text-[#86868b] mt-0.5">
                          {m.notes}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-[#86868b] text-xs font-medium">
                      {m.parentItemTitle}
                    </td>

                    <td className="py-3.5 px-4 text-[#86868b] text-xs">
                      <span className="px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06]">
                        {m.stream}
                      </span>
                    </td>

                    <td className="py-3.5 px-3 font-mono text-[11px] text-[#f5f5f7]">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                        <Calendar className="w-2.5 h-2.5 mr-1 text-[#86868b]" />
                        {m.targetDate}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-1.5">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[9px] ${avatar?.bg || 'bg-white/10'} border border-white/20`}>
                          {avatar?.initial || '?'}
                        </div>
                        <span className="text-xs text-[#f5f5f7] font-medium">{m.owner}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => cycleMilestoneStatus(m.parentItemId, m.milestoneKey)}
                        className={`w-full py-1.5 px-2.5 rounded-full font-semibold text-[10px] uppercase tracking-wider border transition-all flex items-center justify-center gap-1 ${
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
                        {isInProgress && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse shadow-[0_0_6px_#2997ff]"></span>}
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
