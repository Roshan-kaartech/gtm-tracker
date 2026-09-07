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
          className="p-3 text-center cursor-pointer hover:bg-stone-50 transition-colors group border-r border-[#9E1B1E]/10"
          title="Click to activate milestone"
        >
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono text-[#9ca3af] bg-stone-100 border border-dashed border-stone-300 group-hover:border-[#9E1B1E] transition-all">
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
        className="p-2.5 align-top cursor-pointer transition-all hover:bg-stone-50 relative group border-r border-[#9E1B1E]/10"
        title="Click to cycle status"
      >
        <div className={`p-2.5 rounded-xl sm:rounded-2xl transition-all ${
          isCompleted 
            ? 'glass-status-completed' 
            : isInProgress 
            ? 'glass-status-active' 
            : isDelayed 
            ? 'glass-status-delayed' 
            : 'glass-status-upcoming'
        }`}>
          {/* Target Date + Status Tag */}
          <div className="flex items-center justify-between gap-1 mb-1">
            <span className="inline-flex items-center text-[10px] font-mono font-bold tracking-tight">
              <Calendar className="w-2.5 h-2.5 mr-1 opacity-70" />
              {milestone.targetDate}
            </span>

            <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.2 rounded-full bg-white/80 shadow-xs">
              {isCompleted && <Check className="w-2.5 h-2.5 mr-0.5 text-emerald-600" />}
              {isInProgress && <span className="w-1.5 h-1.5 rounded-full bg-[#DE3A1E] mr-1 animate-pulse"></span>}
              {isDelayed && <AlertCircle className="w-2.5 h-2.5 mr-0.5 text-[#9E1B1E]" />}
              {milestone.status === 'completed' ? 'Done' : milestone.status === 'in-progress' ? 'Active' : milestone.status}
            </span>
          </div>

          {/* Deliverable description text */}
          <p className="text-[11px] leading-snug font-medium text-[#111827] line-clamp-2">
            {milestone.name}
          </p>
        </div>
      </td>
    );
  };

  if (streamsList.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-8 sm:p-12 text-center">
        <h3 className="text-sm font-bold text-black">No Deliverables Found</h3>
        <p className="text-xs text-[#4b5563] mt-1">No items match your active filters.</p>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="mt-4 inline-flex items-center px-4 py-2 rounded-full text-xs font-bold glass-btn-primary"
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
      <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl glass-card text-xs text-[#4b5563]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-[#DE3A1E] shrink-0" />
          <span className="text-[11px] sm:text-xs">
            Tap any milestone capsule to cycle status (<span className="text-emerald-700 font-bold">Done</span> / <span className="text-[#DE3A1E] font-bold">Active</span> / <span className="text-[#9E1B1E] font-bold">Delayed</span>).
          </span>
        </div>
        <span className="hidden sm:inline text-[11px] text-[#4b5563] font-mono">
          Auto-saved
        </span>
      </div>

      {/* =========================================================
          1. MOBILE CARD VIEW (< 768px)
      ========================================================= */}
      <div className="block md:hidden space-y-3">
        {streamsList.map(stream => {
          const streamItems = groupedByStream[stream];
          const isCollapsed = collapsedStreams[stream];
          const streamStyle = WORKSTREAM_COLORS[stream] || {
            badge: 'bg-red-50 text-[#9E1B1E] border-red-200',
            bar: 'bg-gradient-to-r from-[#9E1B1E] to-[#DE3A1E]',
            dot: 'bg-[#9E1B1E]'
          };
          const avgProgress = Math.round(
            streamItems.reduce((acc, i) => acc + i.progress, 0) / streamItems.length
          );

          return (
            <div key={`mobile-${stream}`} className="glass-card rounded-2xl overflow-hidden border border-[#9E1B1E]/10">
              {/* Stream Header */}
              <button
                onClick={() => toggleStreamCollapse(stream)}
                className="w-full p-3.5 bg-stone-50/70 hover:bg-stone-100 flex items-center justify-between text-left transition-colors border-b border-[#9E1B1E]/10"
              >
                <div className="flex items-center space-x-2 truncate">
                  <span className="p-1 rounded-full bg-white text-[#4b5563] shadow-xs">
                    {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </span>
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className={`w-2.5 h-2.5 rounded-full ${streamStyle.dot} shrink-0`}></span>
                    <span className="text-xs font-bold text-black tracking-tight truncate">
                      {stream}
                    </span>
                  </div>
                  <span className="text-[10px] text-[#4b5563] shrink-0 font-medium">
                    ({streamItems.length})
                  </span>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  <div className="w-14 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${streamStyle.bar} rounded-full`}
                      style={{ width: `${avgProgress}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-mono font-bold text-black">{avgProgress}%</span>
                </div>
              </button>

              {/* Stream Deliverables Cards */}
              {!isCollapsed && (
                <div className="p-2.5 space-y-2.5">
                  {streamItems.map(item => {
                    const avatarInfo = OWNER_AVATARS[item.owner] || {
                      bg: 'bg-[#9E1B1E] text-white',
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
                        className="p-3 rounded-xl bg-white border border-[#9E1B1E]/10 hover:border-[#DE3A1E]/30 transition-all space-y-2.5 shadow-sm"
                      >
                        {/* Title & Priority Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 
                              onClick={() => setEditingItem(item)}
                              className="text-xs font-bold text-black hover:text-[#9E1B1E] cursor-pointer transition-colors"
                            >
                              {item.title}
                            </h4>
                            {item.notes && (
                              <p className="text-[10px] text-[#4b5563] mt-0.5 line-clamp-1">
                                {item.notes}
                              </p>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-1 shrink-0">
                            {item.priority === 'high' && (
                              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-red-100 text-[#9E1B1E] border border-red-200">
                                High
                              </span>
                            )}
                            <span className="text-xs font-mono font-bold text-black bg-stone-100 px-1.5 py-0.5 rounded-lg border border-stone-200">
                              {item.progress}%
                            </span>
                          </div>
                        </div>

                        {/* Dates & Owner */}
                        <div className="flex items-center justify-between text-[10px] text-[#4b5563] border-y border-stone-100 py-1.5">
                          <div className="flex items-center space-x-1 font-mono">
                            <Calendar className="w-3 h-3 text-[#DE3A1E]" />
                            <span>{item.startDate} → {item.endDate}</span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center font-bold text-[8px] ${avatarInfo.bg}`}>
                              {avatarInfo.initial}
                            </div>
                            <span className="text-black font-semibold truncate max-w-[80px]">
                              {item.owner}
                            </span>
                          </div>
                        </div>

                        {/* Milestones Touch Pills */}
                        <div className="space-y-1.5">
                          <span className="text-[9px] uppercase font-bold tracking-wider text-[#4b5563] block">
                            Milestones (Tap to cycle):
                          </span>
                          <div className="grid grid-cols-1 gap-1.5">
                            {milestonesList.map(({ key, m, label }) => {
                              if (!m || m.status === 'not-applicable' || m.name === 'N/A' || !m.name) {
                                return (
                                  <button
                                    key={key}
                                    onClick={() => cycleMilestoneStatus(item.id, key)}
                                    className="p-1.5 rounded-lg border border-dashed border-stone-200 text-left text-[10px] text-[#9ca3af] flex items-center justify-between"
                                  >
                                    <span><strong>{label}:</strong> Not Applicable</span>
                                    <span className="text-[9px] font-mono text-[#9E1B1E] font-bold">+ Activate</span>
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
                                      <span className="font-mono text-[9px] font-medium opacity-80">{m.targetDate}</span>
                                    </div>
                                    <p className="text-[11px] leading-tight text-black font-semibold">
                                      {m.name}
                                    </p>
                                  </div>

                                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-white/80 shadow-xs shrink-0 mt-0.5 flex items-center gap-0.5">
                                    {isCompleted && <Check className="w-2.5 h-2.5 text-emerald-600" />}
                                    {isInProgress && <span className="w-1.5 h-1.5 rounded-full bg-[#DE3A1E] mr-0.5 animate-pulse"></span>}
                                    {isDelayed && <AlertCircle className="w-2.5 h-2.5 text-[#9E1B1E]" />}
                                    {m.status === 'completed' ? 'Done' : m.status === 'in-progress' ? 'Active' : m.status}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Card Actions Footer */}
                        <div className="flex items-center justify-between pt-1 text-[10px] text-[#4b5563]">
                          <div className="w-24 h-1.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                            <div 
                              className="h-full bg-gradient-to-r from-[#9E1B1E] to-[#DE3A1E] rounded-full"
                              style={{ width: `${item.progress}%` }}
                            ></div>
                          </div>

                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => setEditingItem(item)}
                              className="p-1 rounded-lg text-[#4b5563] hover:text-[#9E1B1E] bg-stone-50 border border-stone-200"
                              title="Edit"
                            >
                              <Edit3 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => duplicateDeliverable(item.id)}
                              className="p-1 rounded-lg text-[#4b5563] hover:text-black bg-stone-50 border border-stone-200"
                              title="Duplicate"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => deleteDeliverable(item.id)}
                              className="p-1 rounded-lg text-[#4b5563] hover:text-[#9E1B1E] bg-stone-50 border border-stone-200"
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
      ========================================================= */}
      <div className="hidden md:block glass-card rounded-3xl overflow-hidden shadow-md border border-[#9E1B1E]/12">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1050px]">
            {/* Table Header */}
            <thead>
              <tr className="bg-stone-50 border-b border-[#9E1B1E]/15 text-[10px] font-bold uppercase tracking-wider text-[#4b5563]">
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
            <tbody className="divide-y divide-[#9E1B1E]/8 text-xs bg-white">
              {streamsList.map(stream => {
                const streamItems = groupedByStream[stream];
                const isCollapsed = collapsedStreams[stream];
                const streamStyle = WORKSTREAM_COLORS[stream] || {
                  badge: 'bg-red-50 text-[#9E1B1E] border-red-200',
                  bar: 'bg-gradient-to-r from-[#9E1B1E] to-[#DE3A1E]',
                  dot: 'bg-[#9E1B1E]'
                };

                const avgProgress = Math.round(
                  streamItems.reduce((acc, i) => acc + i.progress, 0) / streamItems.length
                );

                return (
                  <React.Fragment key={stream}>
                    {/* Section Header Row */}
                    <tr className="bg-stone-50/80 hover:bg-stone-100 transition-colors border-y border-[#9E1B1E]/12">
                      <td colSpan={10} className="py-3 px-4">
                        <div className="flex items-center justify-between">
                          <button
                            onClick={() => toggleStreamCollapse(stream)}
                            className="flex items-center space-x-2 text-left group cursor-pointer"
                          >
                            <span className="p-1 rounded-full bg-white text-[#4b5563] group-hover:text-[#9E1B1E] shadow-xs transition-colors">
                              {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </span>
                            <span className="flex items-center space-x-1.5">
                              <span className={`w-2.5 h-2.5 rounded-full ${streamStyle.dot}`}></span>
                              <span className="text-xs font-bold text-black tracking-tight">
                                {stream}
                              </span>
                            </span>
                            <span className="text-[11px] text-[#4b5563] font-medium">
                              ({streamItems.length} initiatives)
                            </span>
                          </button>

                          <div className="flex items-center space-x-3">
                            <span className="text-[11px] text-[#4b5563] font-medium">Readiness:</span>
                            <div className="w-24 h-2 bg-stone-200 rounded-full overflow-hidden p-0.5 border border-stone-300">
                              <div 
                                className={`h-full ${streamStyle.bar} rounded-full transition-all duration-500`}
                                style={{ width: `${avgProgress}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-mono font-bold text-black">{avgProgress}%</span>
                          </div>
                        </div>
                      </td>
                    </tr>

                    {/* Sub-Item Rows */}
                    {!isCollapsed && streamItems.map((item, idx) => {
                      const avatarInfo = OWNER_AVATARS[item.owner] || {
                        bg: 'bg-[#9E1B1E] text-white',
                        initial: item.owner ? item.owner.slice(0, 2).toUpperCase() : '?',
                        role: 'Contributor'
                      };

                      return (
                        <tr 
                          key={item.id}
                          className="hover:bg-red-50/30 transition-colors border-b border-stone-100 group"
                        >
                          {/* Stream Pill Column */}
                          <td className="p-3.5 align-top font-bold text-black">
                            {idx === 0 && (
                              <span className="text-xs font-extrabold text-[#9E1B1E]">
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
                              <div className="font-bold text-black group-hover/title:text-[#9E1B1E] transition-colors flex items-center gap-1.5 text-xs">
                                <span>{item.title}</span>
                                <Edit3 className="w-3 h-3 text-[#9ca3af] opacity-0 group-hover/title:opacity-100 transition-opacity" />
                              </div>
                              {item.notes && (
                                <p className="text-[10px] text-[#4b5563] mt-0.5 line-clamp-1 font-medium">
                                  {item.notes}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {item.priority === 'high' && (
                                  <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-red-100 text-[#9E1B1E] border border-red-200">
                                    High Priority
                                  </span>
                                )}
                                {item.tags?.map(t => (
                                  <span key={t} className="px-2 py-0.2 rounded-full text-[9px] text-[#4b5563] bg-stone-100 border border-stone-200 font-medium">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </td>

                          {/* Start Date */}
                          <td className="p-3 align-top font-mono text-[11px] text-[#4b5563]">
                            <span className="px-2 py-0.5 rounded-lg bg-stone-50 border border-stone-200 font-medium">
                              {item.startDate || '-'}
                            </span>
                          </td>

                          {/* End Date */}
                          <td className="p-3 align-top font-mono text-[11px] text-[#4b5563]">
                            <span className="px-2 py-0.5 rounded-lg bg-stone-50 border border-stone-200 font-medium">
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
                                <span className="font-bold text-black">{item.progress}%</span>
                              </div>
                              <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                                <div 
                                  className="h-full bg-gradient-to-r from-[#9E1B1E] to-[#DE3A1E] rounded-full transition-all duration-500"
                                  style={{ width: `${item.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>

                          {/* Owners */}
                          <td className="p-3.5 align-top">
                            <div className="flex items-center space-x-2">
                              <div className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] ${avatarInfo.bg} shadow-sm`}>
                                {avatarInfo.initial}
                              </div>
                              <span className="font-bold text-black text-xs truncate">{item.owner}</span>
                            </div>
                          </td>

                          {/* Actions */}
                          <td className="p-3 align-top text-center">
                            <div className="flex items-center justify-center space-x-1 opacity-70 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="p-1.5 rounded-lg text-[#4b5563] hover:text-[#9E1B1E] hover:bg-red-50 transition-colors"
                                title="Edit deliverable"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => duplicateDeliverable(item.id)}
                                className="p-1.5 rounded-lg text-[#4b5563] hover:text-black hover:bg-stone-100 transition-colors"
                                title="Duplicate deliverable"
                              >
                                <Copy className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteDeliverable(item.id)}
                                className="p-1.5 rounded-lg text-[#4b5563] hover:text-[#9E1B1E] hover:bg-red-50 transition-colors"
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
