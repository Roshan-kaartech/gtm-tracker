import React, { useState } from 'react';
import { useGTM } from '../../context/GTMContext';
import { DeliverableItem, Milestone } from '../../types/gtm';
import { WORKSTREAM_COLORS, OWNER_AVATARS } from '../../data/initialData';
import { 
  ChevronDown, 
  ChevronRight, 
  Edit3, 
  Copy, 
  Trash2, 
  Check, 
  AlertCircle, 
  Calendar,
  Sparkles,
  Plus
} from 'lucide-react';

export const MatrixView: React.FC = () => {
  const { 
    filteredItems, 
    cycleMilestoneStatus, 
    setEditingItem, 
    duplicateDeliverable, 
    deleteDeliverable,
    setIsAddModalOpen
  } = useGTM();

  const [collapsedStreams, setCollapsedStreams] = useState<Record<string, boolean>>({});

  const toggleStreamCollapse = (stream: string) => {
    setCollapsedStreams(prev => ({ ...prev, [stream]: !prev[stream] }));
  };

  const groupedByStream = filteredItems.reduce((acc, item) => {
    if (!acc[item.stream]) {
      acc[item.stream] = [];
    }
    acc[item.stream].push(item);
    return acc;
  }, {} as Record<string, DeliverableItem[]>);

  const streamsList = Object.keys(groupedByStream);

  const renderMilestoneCell = (
    item: DeliverableItem, 
    milestoneKey: 'milestone1' | 'milestone2' | 'milestone3', 
    milestone: Milestone
  ) => {
    if (!milestone || milestone.status === 'not-applicable' || milestone.name === 'N/A' || !milestone.name) {
      return (
        <td 
          onClick={() => cycleMilestoneStatus(item.id, milestoneKey)}
          className="p-3 text-center cursor-pointer hover:bg-white/[0.02] transition-colors group"
          title="Click to activate milestone"
        >
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono text-[#6e6e73] bg-white/[0.02] border border-dashed border-white/[0.08] group-hover:border-white/[0.2] transition-all">
            N/A
          </span>
        </td>
      );
    }

    const isCompleted = milestone.status === 'completed';
    const isInProgress = milestone.status === 'in-progress';
    const isDelayed = milestone.status === 'delayed';

    return (
      <td 
        onClick={() => cycleMilestoneStatus(item.id, milestoneKey)}
        className="p-2.5 align-top cursor-pointer transition-all hover:bg-white/[0.02] relative group border-r border-white/[0.04]"
        title="Click to cycle status"
      >
        <div className={`p-2.5 rounded-2xl transition-all ${
          isCompleted 
            ? 'glass-status-completed' 
            : isInProgress 
            ? 'glass-status-active' 
            : isDelayed 
            ? 'glass-status-delayed' 
            : 'glass-status-upcoming'
        }`}>
          {/* Target Date + Status Tag */}
          <div className="flex items-center justify-between gap-1 mb-1.5">
            <span className="inline-flex items-center text-[10px] font-mono font-medium tracking-tight">
              <Calendar className="w-2.5 h-2.5 mr-1 opacity-70" />
              {milestone.targetDate}
            </span>

            <span className="inline-flex items-center text-[9px] font-semibold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-white/[0.08] backdrop-blur-md">
              {isCompleted && <Check className="w-2.5 h-2.5 mr-0.5" />}
              {isInProgress && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1 animate-pulse shadow-[0_0_6px_#2997ff]"></span>}
              {isDelayed && <AlertCircle className="w-2.5 h-2.5 mr-0.5" />}
              {milestone.status === 'completed' ? 'Done' : milestone.status === 'in-progress' ? 'Active' : milestone.status}
            </span>
          </div>

          {/* Deliverable description text */}
          <p className="text-[11px] leading-snug font-normal text-[#f5f5f7] line-clamp-2">
            {milestone.name}
          </p>
        </div>
      </td>
    );
  };

  if (streamsList.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 sm:p-12 text-center">
        <h3 className="text-sm font-semibold text-white">No Deliverables Found</h3>
        <p className="text-xs text-[#86868b] mt-1">No items match your active filters.</p>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold glass-btn-primary"
        >
          <Plus className="w-3.5 h-3.5 mr-1" />
          Add Deliverable
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Help tooltip banner */}
      <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl glass-card text-xs text-[#86868b]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          <span className="text-[11px] sm:text-xs">
            Tap any milestone capsule to cycle status (<span className="text-emerald-400 font-medium">Done</span> / <span className="text-blue-400 font-medium">Active</span> / <span className="text-rose-400 font-medium">Delayed</span>).
          </span>
        </div>
        <span className="hidden sm:inline text-[11px] text-[#6e6e73] font-mono">
          Auto-saved
        </span>
      </div>

      {/* =========================================================
          1. MOBILE CARD VIEW (< 768px)
          Adaptive native mobile cards with 1-click milestone capsules
      ========================================================= */}
      <div className="block md:hidden space-y-3">
        {streamsList.map(stream => {
          const streamItems = groupedByStream[stream];
          const isCollapsed = collapsedStreams[stream];
          const streamStyle = WORKSTREAM_COLORS[stream] || {
            badge: 'bg-white/[0.06] text-white border-white/[0.12]',
            bar: 'bg-blue-500',
            dot: 'bg-blue-400'
          };
          const avgProgress = Math.round(
            streamItems.reduce((acc, i) => acc + i.progress, 0) / streamItems.length
          );

          return (
            <div key={`mobile-${stream}`} className="glass-card rounded-2xl overflow-hidden border border-white/[0.08]">
              {/* Stream Header */}
              <button
                onClick={() => toggleStreamCollapse(stream)}
                className="w-full p-3.5 bg-white/[0.03] hover:bg-white/[0.06] flex items-center justify-between text-left transition-colors border-b border-white/[0.06]"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="p-1 rounded-full bg-white/[0.05] text-[#86868b]">
                    {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </span>
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className={`w-2 h-2 rounded-full ${streamStyle.dot} shrink-0 shadow-[0_0_6px_currentColor]`}></span>
                    <span className="text-xs font-bold text-white tracking-tight truncate">
                      {stream}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#86868b] shrink-0">
                    ({streamItems.length})
                  </span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <div className="w-14 h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${streamStyle.bar} rounded-full`}
                      style={{ width: `${avgProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{avgProgress}%</span>
                </div>
              </button>

              {/* Stream Deliverables Cards */}
              {!isCollapsed && (
                <div className="p-2.5 space-y-2.5">
                  {streamItems.map(item => {
                    const avatarInfo = OWNER_AVATARS[item.owner] || {
                      bg: 'bg-white/10 text-white',
                      initial: item.owner ? item.owner.slice(0, 2).toUpperCase() : '?',
                      role: 'Lead'
                    };

                    const milestonesList = [
                      { key: 'milestone1' as const, m: item.milestone1, label: 'M1' },
                      { key: 'milestone2' as const, m: item.milestone2, label: 'M2' },
                      { key: 'milestone3' as const, m: item.milestone3, label: 'M3' }
                    ];

                    return (
                      <div 
                        key={`m-item-${item.id}`}
                        className="p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.14] transition-all space-y-2.5 shadow-sm"
                      >
                        {/* Title & Priority Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 
                              onClick={() => setEditingItem(item)}
                              className="text-xs font-bold text-[#f5f5f7] hover:text-blue-400 cursor-pointer transition-colors"
                            >
                              {item.title}
                            </h4>
                            {item.notes && (
                              <p className="text-[10px] text-[#86868b] mt-0.5 line-clamp-1">
                                {item.notes}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1 shrink-0">
                            {item.priority === 'high' && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/25">
                                High
                              </span>
                            )}
                            <span className="text-xs font-mono font-bold text-white bg-white/[0.06] px-1.5 py-0.5 rounded-lg border border-white/[0.08]">
                              {item.progress}%
                            </span>
                          </div>
                        </div>

                        {/* Dates & Owner */}
                        <div className="flex items-center justify-between text-[10px] text-[#86868b] border-y border-white/[0.04] py-1.5">
                          <div className="flex items-center space-x-1 font-mono">
                            <Calendar className="w-3 h-3 text-[#86868b]" />
                            <span>{item.startDate} → {item.endDate}</span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] ${avatarInfo.bg} border border-white/20`}>
                              {avatarInfo.initial}
                            </div>
                            <span className="text-[#f5f5f7] font-medium truncate max-w-[80px]">
                              {item.owner}
                            </span>
                          </div>
                        </div>

                        {/* Milestones Touch Pills (1-Click Cycle) */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-[#86868b] block">
                            Milestones (Tap to cycle):
                          </span>
                          <div className="grid grid-cols-1 gap-1.5">
                            {milestonesList.map(({ key, m, label }) => {
                              if (!m || m.status === 'not-applicable' || m.name === 'N/A' || !m.name) {
                                return (
                                  <button
                                    key={key}
                                    onClick={() => cycleMilestoneStatus(item.id, key)}
                                    className="p-1.5 rounded-lg border border-dashed border-white/[0.08] text-left text-[10px] text-[#6e6e73] flex items-center justify-between"
                                  >
                                    <span><strong>{label}:</strong> Not Applicable</span>
                                    <span className="text-[9px] font-mono">+ Activate</span>
                                  </button>
                                );
                              }

                              const isCompleted = m.status === 'completed';
                              const isInProgress = m.status === 'in-progress';
                              const isDelayed = m.status === 'delayed';

                              return (
                                <button
                                  key={key}
                                  onClick={() => cycleMilestoneStatus(item.id, key)}
                                  className={`p-2 rounded-xl text-left border transition-all flex items-start justify-between gap-2 ${
                                    isCompleted 
                                      ? 'glass-status-completed' 
                                      : isInProgress 
                                      ? 'glass-status-active' 
                                      : isDelayed 
                                      ? 'glass-status-delayed' 
                                      : 'glass-status-upcoming'
                                  }`}
                                >
                                  <div className="min-w-0 flex-1">
                                    <div className="flex items-center space-x-1.5 mb-0.5">
                                      <span className="font-mono font-bold text-[9px]">[{label}]</span>
                                      <span className="font-mono text-[9px] opacity-80">{m.targetDate}</span>
                                    </div>
                                    <p className="text-[11px] leading-tight text-[#f5f5f7] font-normal">
                                      {m.name}
                                    </p>
                                  </div>

                                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold uppercase tracking-wider bg-white/[0.08] shrink-0 mt-0.5 flex items-center gap-0.5">
                                    {isCompleted && <Check className="w-2.5 h-2.5" />}
                                    {isInProgress && <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-0.5 animate-pulse"></span>}
                                    {isDelayed && <AlertCircle className="w-2.5 h-2.5" />}
                                    {m.status === 'completed' ? 'Done' : m.status === 'in-progress' ? 'Active' : m.status}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="flex items-center justify-between pt-1 text-[10px] text-[#86868b]">
                          <div className="w-24 h-1.5 bg-white/[0.08] rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                            <div 
                              className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1 rounded-lg text-[#86868b] hover:text-white bg-white/[0.03] border border-white/[0.06]"
                              title="Edit"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => duplicateDeliverable(item.id)}
                              className="p-1 rounded-lg text-[#86868b] hover:text-white bg-white/[0.03] border border-white/[0.06]"
                              title="Duplicate"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteDeliverable(item.id)}
                              className="p-1 rounded-lg text-[#86868b] hover:text-rose-400 bg-white/[0.03] border border-white/[0.06]"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* =========================================================
          2. DESKTOP / TABLET SPREADSHEET MATRIX (>= 768px)
          Full 10-column interactive spreadsheet matrix with frosted rows
      ========================================================= */}
      <div className="hidden md:block glass-card rounded-3xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            {/* Table Header */}
            <thead>
              <tr className="bg-black/60 backdrop-blur-xl border-b border-white/[0.08] text-[10px] font-semibold uppercase tracking-wider text-[#86868b]">
                <th className="py-3.5 px-4 w-[170px]">Line Items</th>
                <th className="py-3.5 px-4 w-[230px]">Sub-Items / Deliverables</th>
                <th className="py-3.5 px-3 w-[90px]">Start</th>
                <th className="py-3.5 px-3 w-[90px]">End</th>
                <th className="py-3.5 px-3 w-[210px]">Milestone-1</th>
                <th className="py-3.5 px-3 w-[210px]">Milestone-2</th>
                <th className="py-3.5 px-3 w-[210px]">Milestone-3</th>
                <th className="py-3.5 px-3 w-[100px]">Progress</th>
                <th className="py-3.5 px-4 w-[140px]">Owners</th>
                <th className="py-3.5 px-3 w-[70px] text-center">Actions</th>
              </tr>
            </thead>

            {/* Table Body with Workstream Groups */}
            <tbody className="divide-y divide-white/[0.04] text-xs">
              {streamsList.map(stream => {
                const streamItems = groupedByStream[stream];
                const isCollapsed = collapsedStreams[stream];
                const streamStyle = WORKSTREAM_COLORS[stream] || {
                  badge: 'bg-white/[0.06] text-white border-white/[0.12]',
                  bar: 'bg-blue-500',
                  dot: 'bg-blue-400'
                };

                const avgProgress = Math.round(
                  streamItems.reduce((acc, i) => acc + i.progress, 0) / streamItems.length
                );

                return (
                  <React.Fragment key={stream}>
                    {/* Section Header Row */}
                    <tr className="bg-white/[0.02] hover:bg-white/[0.04] backdrop-blur-md transition-colors border-y border-white/[0.08]">
                      <td colSpan={10} className="py-3 px-4">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleStreamCollapse(stream)}
                            className="flex items-center space-x-2 text-left group"
                          >
                            <span className="p-1 rounded-full bg-white/[0.05] text-[#86868b] group-hover:text-white transition-colors">
                              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </span>
                            <span className="flex items-center space-x-1.5">
                              <span className={`w-2 h-2 rounded-full ${streamStyle.dot} shadow-[0_0_8px_currentColor]`}></span>
                              <span className="text-xs font-bold text-white tracking-tight">
                                {stream}
                              </span>
                            </span>
                            <span className="text-[11px] text-[#86868b]">
                              ({streamItems.length} initiatives)
                            </span>
                          </button>

                          <div className="flex items-center space-x-3">
                            <span className="text-[11px] text-[#86868b]">Readiness:</span>
                            <div className="w-24 h-2 bg-white/[0.08] rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                              <div 
                                className={`h-full ${streamStyle.bar} rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(41,151,255,0.3)]`}
                                style={{ width: `${avgProgress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-mono font-bold text-white">{avgProgress}%</span>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Sub-Item Rows */}
                    {!isCollapsed && streamItems.map((item, idx) => {
                      const avatarInfo = OWNER_AVATARS[item.owner] || {
                        bg: 'bg-white/10 text-white',
                        initial: item.owner ? item.owner.slice(0, 2).toUpperCase() : '?',
                        role: 'Contributor'
                      };

                      return (
                        <tr 
                          key={item.id}
                          className="hover:bg-white/[0.02] transition-colors border-b border-white/[0.03] group"
                        >
                          {/* Stream Pill Column */}
                          <td className="p-3.5 align-top font-medium text-[#86868b]">
                            {idx === 0 && (
                              <span className="text-xs font-bold text-white">
                                {stream}
                              </span>
                            )}
                          </td>

                          {/* Sub-Item Title & Tags */}
                          <td className="p-3.5 align-top">
                            <div 
                              onClick={() => setEditingItem(item)}
                              className="cursor-pointer group/title"
                            >
                              <div className="font-semibold text-[#f5f5f7] group-hover/title:text-blue-400 transition-colors flex items-center gap-1.5 text-xs">
                                <span>{item.title}</span>
                                <Edit3 className="w-3 h-3 text-[#6e6e73] opacity-0 group-hover/title:opacity-100 transition-opacity" />
                              </div>
                              {item.notes && (
                                <p className="text-[10px] text-[#86868b] mt-0.5 line-clamp-1">
                                  {item.notes}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {item.priority === 'high' && (
                                  <span className="px-2 py-0.2 rounded-full text-[9px] font-semibold bg-rose-500/15 text-rose-400 border border-rose-500/30 shadow-[0_0_8px_rgba(255,69,58,0.15)]">
                                    High Priority
                                  </span>
                                )}
                                {item.tags?.map(t => (
                                  <span key={t} className="px-2 py-0.2 rounded-full text-[9px] text-[#86868b] bg-white/[0.04] border border-white/[0.06]">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>

                          {/* Start Date */}
                          <td className="p-3 align-top font-mono text-[11px] text-[#86868b]">
                            <span className="px-2 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                              {item.startDate || '-'}
                            </span>
                          </td>

                          {/* End Date */}
                          <td className="p-3 align-top font-mono text-[11px] text-[#86868b]">
                            <span className="px-2 py-0.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                              {item.endDate || '-'}
                            </span>
                          </td>

                          {/* Milestone-1 */}
                          {renderMilestoneCell(item, 'milestone1', item.milestone1)}

                          {/* Milestone-2 */}
                          {renderMilestoneCell(item, 'milestone2', item.milestone2)}

                          {/* Milestone-3 */}
                          {renderMilestoneCell(item, 'milestone3', item.milestone3)}

                          {/* Progress */}
                          <td className="p-3 align-top">
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-[10px] font-mono">
                                <span className="font-bold text-white">{item.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                                <div 
                                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(41,151,255,0.3)]"
                                  style={{ width: `${item.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          {/* Owners */}
                          <td className="p-3.5 align-top">
                            <div className="flex items-center space-x-2">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] ${avatarInfo.bg} border border-white/20 shadow-sm`}>
                                {avatarInfo.initial}
                              </div>
                              <div className="truncate">
                                <div className="font-semibold text-[#f5f5f7] text-xs truncate">{item.owner}</div>
                                <div className="text-[9px] text-[#86868b] truncate">{avatarInfo.role}</div>
                              </div>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-3 align-top text-center">
                            <div className="flex items-center justify-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="p-1.5 rounded-lg text-[#86868b] hover:text-white hover:bg-white/[0.08] transition-colors"
                                title="Edit deliverable"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => duplicateDeliverable(item.id)}
                                className="p-1.5 rounded-lg text-[#86868b] hover:text-white hover:bg-white/[0.08] transition-colors"
                                title="Duplicate deliverable"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteDeliverable(item.id)}
                                className="p-1.5 rounded-lg text-[#86868b] hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
                                title="Delete deliverable"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
