import React from 'react';
import { useGTM } from '../../context/GTMContext';
import { WORKSTREAM_COLORS } from '../../data/initialData';
import { Calendar } from 'lucide-react';

export const GanttView: React.FC = () => {
  const { filteredItems, setEditingItem, cycleMilestoneStatus } = useGTM();

  const parseDateToDayOffset = (dateStr: string): number => {
    if (!dateStr || dateStr === 'N/A') return 0;
    const cleanStr = dateStr.trim();
    
    // Check ISO format YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(cleanStr)) {
      const parts = cleanStr.split('-');
      const monthNum = parseInt(parts[1], 10);
      const dayNum = parseInt(parts[2], 10) || 1;
      if (monthNum === 7) return Math.min(30, Math.max(0, dayNum - 1));
      if (monthNum === 8) return 31 + Math.min(30, Math.max(0, dayNum - 1));
      if (monthNum === 9) return 62 + Math.min(29, Math.max(0, dayNum - 1));
      if (monthNum > 9) return 91;
      return 0;
    }

    const parts = cleanStr.split('-');
    if (parts.length < 2) return 0;
    const day = parseInt(parts[0], 10) || 1;
    const month = parts[1].toLowerCase();

    if (month.startsWith('jul')) {
      return Math.min(30, Math.max(0, day - 1));
    } else if (month.startsWith('aug')) {
      return 31 + Math.min(30, Math.max(0, day - 1));
    } else if (month.startsWith('sep')) {
      return 62 + Math.min(29, Math.max(0, day - 1));
    } else if (month.startsWith('oct') || month.startsWith('nov') || month.startsWith('dec')) {
      return 91;
    }
    return 0;
  };

  const totalDays = 92;
  const currentMonth = new Date().getMonth(); // 0-indexed: 6 = Jul, 7 = Aug, 8 = Sep
  const currentDay = new Date().getDate();
  const calculatedTodayOffset = currentMonth === 6
    ? Math.min(30, currentDay - 1)
    : currentMonth === 7
    ? 31 + Math.min(30, currentDay - 1)
    : currentMonth === 8
    ? 62 + Math.min(29, currentDay - 1)
    : 58;
  const todayPct = Math.min(100, Math.max(0, (calculatedTodayOffset / totalDays) * 100));

  return (
    <div className="space-y-4">
      {/* Gantt Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-2.5 rounded-2xl sm:rounded-3xl glass-card">
        <div>
          <h3 className="text-xs font-bold text-black flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-[#DE3A1E]" />
            Roadmap Timeline (July - September 2026)
          </h3>
          <p className="text-[11px] text-[#4b5563]">
            Initiative duration bars with milestone diamond pins.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-[11px] font-mono">
          <span className="flex items-center text-emerald-700 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 mr-1.5 shadow-sm"></span> Done
          </span>
          <span className="flex items-center text-[#DE3A1E] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#DE3A1E] mr-1.5 shadow-sm"></span> Active
          </span>
          <span className="flex items-center text-[#9E1B1E] font-bold">
            <span className="w-2 h-2 rounded-full bg-[#9E1B1E] mr-1.5 shadow-sm"></span> Delayed
          </span>
          <span className="flex items-center text-[#6b7280] font-medium">
            <span className="w-2 h-2 rounded-full bg-[#9ca3af] mr-1.5"></span> Upcoming
          </span>
        </div>
      </div>

      {/* Gantt Timeline Container */}
      <div className="glass-card rounded-3xl overflow-x-auto shadow-md p-4 sm:p-5">
        <div className="min-w-[850px]">
          
          {/* Months Header */}
          <div className="grid grid-cols-12 gap-0 border-b border-[#9E1B1E]/15 pb-2 mb-3 text-[11px] font-bold">
            <div className="col-span-4 text-[#4b5563] uppercase tracking-wider pl-2 text-[10px]">
              Initiative / Lead
            </div>
            <div className="col-span-8 grid grid-cols-3 text-center border-l border-stone-200 text-[#4b5563]">
              <div className="border-r border-stone-200 py-0.5">July 2026</div>
              <div className="border-r border-stone-200 py-0.5">August 2026</div>
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
                bar: 'bg-gradient-to-r from-[#9E1B1E] to-[#DE3A1E]',
                dot: 'bg-[#9E1B1E]'
              };

              const milestones = [
                { key: 'milestone1' as const, data: item.milestone1 },
                { key: 'milestone2' as const, data: item.milestone2 },
                { key: 'milestone3' as const, data: item.milestone3 }
              ].filter(m => m.data && m.data.status !== 'not-applicable' && m.data.name !== 'N/A');

              return (
                <div 
                  key={item.id}
                  className="grid grid-cols-12 gap-0 items-center py-2 px-2 rounded-2xl hover:bg-red-50/40 transition-all group"
                >
                  {/* Left info */}
                  <div className="col-span-4 pr-3">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="text-left font-bold text-xs text-black group-hover:text-[#9E1B1E] transition-colors truncate max-w-[180px]"
                        title={item.title}
                      >
                        {item.title}
                      </button>
                      <span className="text-[10px] font-mono font-bold text-black">
                        {item.progress}%
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5 mt-0.5 text-[10px] text-[#4b5563]">
                      <span className="font-semibold text-black">{item.owner}</span>
                      <span>•</span>
                      <span>{item.stream}</span>
                    </div>
                  </div>

                  {/* Right Bar */}
                  <div className="col-span-8 relative h-8 bg-stone-50 rounded-xl border border-stone-200 flex items-center px-1 shadow-inner">
                    
                    {/* Grid Guideline Marks */}
                    <div className="absolute inset-0 grid grid-cols-3 pointer-events-none">
                      <div className="border-r border-stone-200/80 h-full"></div>
                      <div className="border-r border-stone-200/80 h-full"></div>
                      <div className="h-full"></div>
                    </div>

                    {/* Today Line */}
                    <div 
                      className="absolute top-0 bottom-0 w-[2px] bg-[#9E1B1E] z-10 pointer-events-none shadow-sm"
                      style={{ left: `${todayPct}%` }}
                    >
                      <span className="absolute -top-3 -translate-x-1/2 text-[8px] font-mono font-bold text-white bg-[#9E1B1E] px-1.5 py-0.2 rounded-full shadow-sm">
                        Today
                      </span>
                    </div>

                    {/* Duration Bar */}
                    <div
                      className={`h-4 rounded-full opacity-90 hover:opacity-100 transition-all ${streamStyle.bar} relative cursor-pointer shadow-sm`}
                      style={{
                        left: `${leftPct}%`,
                        width: `${Math.max(6, widthPct)}%`
                      }}
                      onClick={() => setEditingItem(item)}
                      title={`${item.title}: ${item.startDate} to ${item.endDate}`}
                    >
                      <div className="absolute inset-0 flex items-center px-2 text-[9px] font-bold text-white truncate">
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
                          className={`absolute z-20 -translate-x-1/2 cursor-pointer transition-all hover:scale-125`}
                          style={{ left: `${mPct}%` }}
                          title={`Milestone: ${mObj.data.name} (${mObj.data.targetDate})`}
                        >
                          <div className={`w-4 h-4 rounded-md rotate-45 flex items-center justify-center border shadow-sm ${
                            isCompleted 
                              ? 'bg-emerald-600 border-emerald-400 text-white' 
                              : isInProgress 
                              ? 'bg-[#DE3A1E] border-orange-300 text-white' 
                              : isDelayed 
                              ? 'bg-[#9E1B1E] border-red-300 text-white' 
                              : 'bg-white border-stone-300 text-[#4b5563]'
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
