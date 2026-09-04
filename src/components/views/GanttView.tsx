import React from 'react';
import { useGTM } from '../../context/GTMContext';
import { WORKSTREAM_COLORS } from '../../data/initialData';
import { Calendar } from 'lucide-react';

export const GanttView: React.FC = () => {
  const { filteredItems, setEditingItem, cycleMilestoneStatus } = useGTM();

  const parseDateToDayOffset = (dateStr: string): number => {
    if (!dateStr || dateStr === 'N/A') return 0;
    const parts = dateStr.trim().split('-');
    if (parts.length < 2) return 0;
    const day = parseInt(parts[0], 10) || 1;
    const month = parts[1].toLowerCase();

    if (month.startsWith('jul')) {
      return Math.min(30, Math.max(0, day - 1));
    } else if (month.startsWith('aug')) {
      return 31 + Math.min(30, Math.max(0, day - 1));
    } else if (month.startsWith('sep')) {
      return 62 + Math.min(29, Math.max(0, day - 1));
    }
    return 0;
  };

  const totalDays = 92;
  const todayOffset = 58;
  const todayPct = (todayOffset / totalDays) * 100;

  return (
    <div className="space-y-4">
      {/* Gantt Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-2.5 rounded-3xl glass-card">
        <div>
          <h3 className="text-xs font-semibold text-white flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-blue-400" />
            Roadmap Timeline (July - September 2026)
          </h3>
          <p className="text-[11px] text-[#86868b]">
            Deliverable duration bars with milestone diamond markers.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="flex items-center text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 mr-1.5 shadow-[0_0_8px_#30d158]"></span> Done
          </span>
          <span className="flex items-center text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-400 mr-1.5 shadow-[0_0_8px_#2997ff]"></span> Active
          </span>
          <span className="flex items-center text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400 mr-1.5 shadow-[0_0_8px_#ff453a]"></span> Delayed
          </span>
          <span className="flex items-center text-[#86868b]">
            <span className="w-2 h-2 rounded-full bg-[#86868b] mr-1.5"></span> Upcoming
          </span>
        </div>
      </div>

      {/* Gantt Timeline Container */}
      <div className="glass-card rounded-3xl overflow-x-auto shadow-2xl p-5">
        <div className="min-w-[850px]">
          
          {/* Months Header */}
          <div className="grid grid-cols-12 gap-0 border-b border-white/[0.08] pb-2 mb-3 text-[11px] font-medium">
            <div className="col-span-4 text-[#86868b] uppercase tracking-wider pl-2 text-[10px]">
              Deliverable / Lead
            </div>
            <div className="col-span-8 grid grid-cols-3 text-center border-l border-white/[0.08] text-[#86868b]">
              <div className="border-r border-white/[0.06] py-0.5">July 2026</div>
              <div className="border-r border-white/[0.06] py-0.5">August 2026</div>
              <div className="py-0.5">September 2026</div>
            </div>
          </div>

          {/* Rows */}
          <div className="space-y-2.5 relative">
            {filteredItems.map(item => {
              const startDay = parseDateToDayOffset(item.startDate);
              const endDay = parseDateToDayOffset(item.endDate);
              const duration = Math.max(4, endDay - startDay);
              
              const leftPct = (startDay / totalDays) * 100;
              const widthPct = Math.min(100 - leftPct, (duration / totalDays) * 100);

              const streamStyle = WORKSTREAM_COLORS[item.stream] || {
                bar: 'bg-blue-500',
                dot: 'bg-blue-400'
              };

              const milestones = [
                { key: 'milestone1' as const, data: item.milestone1 },
                { key: 'milestone2' as const, data: item.milestone2 },
                { key: 'milestone3' as const, data: item.milestone3 }
              ].filter(m => m.data && m.data.status !== 'not-applicable' && m.data.name !== 'N/A');

              return (
                <div 
                  key={item.id}
                  className="grid grid-cols-12 gap-0 items-center py-2 px-2 rounded-2xl hover:bg-white/[0.04] transition-all group"
                >
                  {/* Left info */}
                  <div className="col-span-4 pr-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-left font-semibold text-xs text-[#f5f5f7] group-hover:text-blue-400 transition-colors truncate max-w-[180px]"
                        title={item.title}
                      >
                        {item.title}
                      </button>
                      <span className="text-[10px] font-mono text-[#86868b]">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] text-[#86868b]">
                      <span>{item.owner}</span>
                      <span>•</span>
                      <span>{item.stream}</span>
                    </div>
                  </div>

                  {/* Right Bar */}
                  <div className="col-span-8 relative h-8 bg-white/[0.02] backdrop-blur-md rounded-xl border border-white/[0.06] flex items-center px-1 shadow-inner">
                    
                    {/* Grid Guideline Marks */}
                    <div className="absolute inset-0 grid grid-cols-3 pointer-events-none">
                      <div className="border-r border-white/[0.04] h-full"></div>
                      <div className="border-r border-white/[0.04] h-full"></div>
                      <div className="h-full"></div>
                    </div>

                    {/* Today Line */}
                    <div 
                      className="absolute top-0 bottom-0 w-[2px] bg-blue-400 z-10 pointer-events-none shadow-[0_0_8px_#2997ff]"
                      style={{ left: `${todayPct}%` }}
                    >
                      <span className="absolute -top-3 -translate-x-1/2 text-[8px] font-mono text-blue-300 bg-black/80 backdrop-blur-md px-1.5 py-0.2 rounded-full border border-blue-500/40 shadow-sm">
                        Today
                      </span>
                    </div>

                    {/* Duration Bar */}
                    <div
                      className={`h-4 rounded-full opacity-85 hover:opacity-100 transition-all ${streamStyle.bar} relative cursor-pointer shadow-[0_0_12px_rgba(41,151,255,0.25)]`}
                      style={{
                        left: `${leftPct}%`,
                        width: `${Math.max(6, widthPct)}%`
                      }}
                      onClick={() => setEditingItem(item)}
                      title={`${item.title}: ${item.startDate} to ${item.endDate}`}
                    >
                      <div className="absolute inset-0 flex items-center px-2 text-[9px] font-bold text-white/95 truncate">
                        {item.startDate} → {item.endDate}
                      </div>
                    </div>

                    {/* Milestones Diamonds */}
                    {milestones.map((mObj, idx) => {
                      const mDay = parseDateToDayOffset(mObj.data.targetDate);
                      const mPct = (mDay / totalDays) * 100;
                      const isCompleted = mObj.data.status === 'completed';
                      const isInProgress = mObj.data.status === 'in-progress';
                      const isDelayed = mObj.data.status === 'delayed';

                      return (
                        <div
                          key={mObj.key}
                          onClick={(e) => {
                            e.stopPropagation();
                            cycleMilestoneStatus(item.id, mObj.key);
                          }}
                          className={`absolute z-20 -translate-x-1/2 cursor-pointer transition-all hover:scale-125 ${
                            isCompleted 
                              ? 'text-emerald-400' 
                              : isInProgress 
                              ? 'text-blue-400' 
                              : isDelayed 
                              ? 'text-rose-400' 
                              : 'text-[#86868b]'
                          }`}
                          style={{ left: `${mPct}%` }}
                          title={`Milestone: ${mObj.data.name} (${mObj.data.targetDate})`}
                        >
                          <div className={`w-4 h-4 rounded-md rotate-45 flex items-center justify-center border shadow-md backdrop-blur-md ${
                            isCompleted 
                              ? 'bg-emerald-500 border-emerald-300 text-black shadow-[0_0_8px_#30d158]' 
                              : isInProgress 
                              ? 'bg-blue-500 border-blue-300 text-white shadow-[0_0_8px_#2997ff]' 
                              : isDelayed 
                              ? 'bg-rose-500 border-rose-300 text-white shadow-[0_0_8px_#ff453a]' 
                              : 'bg-white/10 border-white/25 text-[#86868b]'
                          }`}>
                            <span className="-rotate-45 text-[8px] font-bold">
                              {idx + 1}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};
