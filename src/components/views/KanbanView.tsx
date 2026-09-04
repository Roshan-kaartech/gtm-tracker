import React, { useState } from 'react';
import { useGTM } from '../../context/GTMContext';
import { DeliverableItem } from '../../types/gtm';
import { OWNER_AVATARS } from '../../data/initialData';
import { 
  Calendar, 
  Edit3, 
  Plus
} from 'lucide-react';

export const KanbanView: React.FC = () => {
  const { filteredItems, setEditingItem, cycleMilestoneStatus, setIsAddModalOpen } = useGTM();
  const [mobileTab, setMobileTab] = useState<string>('all');

  const columns: { id: string; title: string; count: number; items: DeliverableItem[] }[] = [
    {
      id: 'not-started',
      title: 'Not Started',
      count: filteredItems.filter(i => i.progress === 0).length,
      items: filteredItems.filter(i => i.progress === 0)
    },
    {
      id: 'in-progress',
      title: 'In Progress',
      count: filteredItems.filter(i => {
        const hasDelayed = [i.milestone1, i.milestone2, i.milestone3].some(m => m?.status === 'delayed');
        return i.progress > 0 && i.progress < 100 && !hasDelayed;
      }).length,
      items: filteredItems.filter(i => {
        const hasDelayed = [i.milestone1, i.milestone2, i.milestone3].some(m => m?.status === 'delayed');
        return i.progress > 0 && i.progress < 100 && !hasDelayed;
      })
    },
    {
      id: 'delayed',
      title: 'At Risk',
      count: filteredItems.filter(i => {
        return [i.milestone1, i.milestone2, i.milestone3].some(m => m?.status === 'delayed');
      }).length,
      items: filteredItems.filter(i => {
        return [i.milestone1, i.milestone2, i.milestone3].some(m => m?.status === 'delayed');
      })
    },
    {
      id: 'completed',
      title: 'Completed',
      count: filteredItems.filter(i => i.progress === 100).length,
      items: filteredItems.filter(i => i.progress === 100)
    }
  ];

  const displayedColumns = mobileTab === 'all' 
    ? columns 
    : columns.filter(c => c.id === mobileTab);

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Top note & Mobile Tab Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 px-3.5 sm:px-4 py-2.5 rounded-2xl sm:rounded-3xl glass-card text-xs text-[#86868b]">
        <div className="flex items-center justify-between w-full sm:w-auto">
          <span className="text-[11px] sm:text-xs">
            Organized by stage. Tap milestones to cycle progress.
          </span>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="sm:hidden inline-flex items-center text-xs font-semibold text-white hover:text-blue-400 transition-colors"
          >
            <Plus className="w-3.5 h-3.5 mr-1" /> Add
          </button>
        </div>

        {/* Mobile Stage Selector */}
        <div className="flex lg:hidden items-center space-x-1 glass-segmented overflow-x-auto max-w-full no-scrollbar w-full sm:w-auto p-1">
          <button
            onClick={() => setMobileTab('all')}
            className={`px-2.5 py-1 text-xs font-medium glass-segmented-btn whitespace-nowrap ${
              mobileTab === 'all' ? 'active text-white' : 'text-[#86868b]'
            }`}
          >
            All ({filteredItems.length})
          </button>
          {columns.map(col => (
            <button
              key={col.id}
              onClick={() => setMobileTab(col.id)}
              className={`px-2.5 py-1 text-xs font-medium glass-segmented-btn whitespace-nowrap ${
                mobileTab === col.id ? 'active text-white' : 'text-[#86868b]'
              }`}
            >
              {col.title} ({col.count})
            </button>
          ))}
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="hidden sm:inline-flex items-center text-xs font-semibold text-white hover:text-blue-400 transition-colors shrink-0"
        >
          <Plus className="w-3.5 h-3.5 mr-1" /> Add Deliverable
        </button>
      </div>

      {/* Responsive Columns Board */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {displayedColumns.map(col => (
          <div 
            key={col.id}
            className="glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-3.5 flex flex-col min-h-[300px] sm:min-h-[500px]"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-2.5 border-b border-white/[0.08] mb-3 px-1">
              <span className="text-xs font-bold text-[#f5f5f7]">
                {col.title}
              </span>
              <span className="text-[11px] font-mono text-[#86868b] bg-white/[0.06] px-2 py-0.2 rounded-full border border-white/[0.08] shadow-inner">
                {col.count}
              </span>
            </div>

            {/* Cards */}
            <div className="space-y-2.5 sm:space-y-3 flex-1 overflow-y-auto pr-0.5">
              {col.items.map(item => {
                const avatar = OWNER_AVATARS[item.owner];

                return (
                  <div
                    key={item.id}
                    className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white/[0.03] backdrop-blur-md hover:bg-white/[0.07] border border-white/[0.08] hover:border-white/[0.18] transition-all group relative shadow-md"
                  >
                    {/* Stream & Priority */}
                    <div className="flex items-center justify-between gap-1 mb-1.5">
                      <span className="text-[10px] font-medium text-[#86868b] truncate max-w-[130px]">
                        {item.stream}
                      </span>
                      {item.priority === 'high' && (
                        <span className="px-2 py-0.2 rounded-full text-[9px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/25 shadow-[0_0_8px_rgba(255,69,58,0.15)]">
                          High
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <h4 
                      onClick={() => setEditingItem(item)}
                      className="text-xs font-bold text-[#f5f5f7] hover:text-blue-400 cursor-pointer line-clamp-2 transition-colors mb-2"
                    >
                      {item.title}
                    </h4>

                    {/* Dates */}
                    <div className="flex items-center text-[10px] text-[#86868b] font-mono mb-2">
                      <Calendar className="w-3 h-3 mr-1 opacity-70" />
                      <span>{item.startDate} → {item.endDate}</span>
                    </div>

                    {/* Milestones */}
                    <div className="space-y-1.5 pt-2 border-t border-white/[0.05] mb-2.5">
                      <div className="flex flex-col gap-1 text-[10px]">
                        {[
                          { key: 'milestone1' as const, m: item.milestone1, label: 'M1' },
                          { key: 'milestone2' as const, m: item.milestone2, label: 'M2' },
                          { key: 'milestone3' as const, m: item.milestone3, label: 'M3' }
                        ].map(({ key, m, label }) => {
                          if (!m || m.status === 'not-applicable' || m.name === 'N/A') return null;
                          const isDone = m.status === 'completed';
                          const isActive = m.status === 'in-progress';
                          const isDelay = m.status === 'delayed';

                          return (
                            <button
                              key={key}
                              onClick={() => cycleMilestoneStatus(item.id, key)}
                              className={`text-left px-2 py-1 rounded-xl border flex items-center justify-between transition-all ${
                                isDone 
                                  ? 'glass-status-completed' 
                                  : isActive 
                                  ? 'glass-status-active' 
                                  : isDelay 
                                  ? 'glass-status-delayed' 
                                  : 'glass-status-upcoming'
                              }`}
                              title="Tap to cycle status"
                            >
                              <span className="truncate pr-1">
                                <strong className="font-mono mr-1">[{label}]</strong>
                                {m.name}
                              </span>
                              <span className="font-mono text-[9px] shrink-0 font-medium">
                                {m.targetDate}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/[0.05]">
                      <div className="flex items-center space-x-1.5">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px] ${avatar?.bg || 'bg-white/10'}`}>
                          {avatar?.initial || '?'}
                        </div>
                        <span className="text-[11px] text-[#86868b] truncate max-w-[85px]">
                          {item.owner}
                        </span>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        <span className="text-[11px] font-mono font-bold text-white">
                          {item.progress}%
                        </span>
                        <button
                          onClick={() => setEditingItem(item)}
                          className="p-1 rounded-full text-[#6e6e73] hover:text-white transition-colors"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}

              {col.items.length === 0 && (
                <div className="h-24 flex items-center justify-center text-xs text-[#6e6e73] border border-dashed border-white/[0.08] rounded-2xl">
                  No deliverables
                </div>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};
