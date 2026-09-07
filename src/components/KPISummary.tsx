import React from 'react';
import { useGTM } from '../context/GTMContext';
import { WORKSTREAM_COLORS } from '../data/initialData';
import { 
  CheckCircle2, 
  Target, 
  CalendarDays,
  Edit3
} from 'lucide-react';

export const KPISummary: React.FC = () => {
  const { 
    stats, 
    streams, 
    filters, 
    setFilters, 
    deadline, 
    cycleTitle,
    setIsDeadlineModalOpen 
  } = useGTM();

  const handleStreamClick = (stream: string) => {
    if (filters.stream === stream) {
      setFilters(prev => ({ ...prev, stream: 'all' }));
    } else {
      setFilters(prev => ({ ...prev, stream }));
    }
  };

  return (
    <section className="space-y-3.5">
      {/* Bento Grid Top KaarTech Metrics */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Card 1: GTM Readiness */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 sm:w-28 h-24 sm:h-28 bg-[#9E1B1E]/10 rounded-full blur-2xl group-hover:bg-[#9E1B1E]/20 transition-all pointer-events-none"></div>
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4b5563]">
              GTM Readiness
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 flex items-center bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mr-1 animate-pulse"></span>
              Strict Rate
            </span>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black font-sans">
              {stats.overallProgress}%
            </div>
            <span className="text-[11px] sm:text-xs font-mono font-medium text-[#4b5563]">
              {stats.completedMilestones}/{stats.totalMilestones} Met
            </span>
          </div>

          {/* Frosted KaarTech Progress Bar */}
          <div className="mt-3 w-full h-2 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-[#9E1B1E]/10 shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-[#9E1B1E] via-[#DE3A1E] to-[#ea580c] rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(222,58,30,0.4)]"
              style={{ width: `${Math.max(stats.overallProgress, 2)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Active Initiatives */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 sm:w-28 h-24 sm:h-28 bg-[#DE3A1E]/10 rounded-full blur-2xl group-hover:bg-[#DE3A1E]/20 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4b5563]">
              Active Initiatives
            </span>
            <span className="p-1 sm:p-1.5 rounded-xl bg-orange-50 text-[#DE3A1E] border border-orange-200 shadow-inner">
              <Target className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black font-sans">
              {stats.totalItems}
            </div>
            <span className="text-[11px] sm:text-xs font-medium text-[#4b5563]">
              Across {streams.length} Streams
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#9E1B1E]/10 text-[#9E1B1E] border border-[#9E1B1E]/20 shadow-sm truncate max-w-[130px]">
              {cycleTitle}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#4b5563]">In Flight</span>
          </div>
        </div>

        {/* Card 3: Milestone Pulse */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 sm:w-28 h-24 sm:h-28 bg-[#9E1B1E]/10 rounded-full blur-2xl group-hover:bg-[#9E1B1E]/20 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4b5563]">
              Milestone Pulse
            </span>
            <span className="p-1 sm:p-1.5 rounded-xl bg-red-50 text-[#9E1B1E] border border-red-200 shadow-inner">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-sm">
              <div className="text-base sm:text-lg font-bold text-emerald-700 font-sans">{stats.completedMilestones}</div>
              <div className="text-[9px] sm:text-[10px] text-emerald-800 font-bold">Done</div>
            </div>
            <div className="bg-orange-50/60 border border-orange-200 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-sm">
              <div className="text-base sm:text-lg font-bold text-[#DE3A1E] font-sans">{stats.inProgressMilestones}</div>
              <div className="text-[9px] sm:text-[10px] text-[#DE3A1E] font-bold">Active</div>
            </div>
            <div className="bg-red-50/60 border border-red-200 rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-sm">
              <div className="text-base sm:text-lg font-bold text-[#9E1B1E] font-sans">{stats.delayedMilestones}</div>
              <div className="text-[9px] sm:text-[10px] text-[#9E1B1E] font-bold">Delayed</div>
            </div>
          </div>
        </div>

        {/* Card 4: Deadline */}
        <div 
          onClick={() => setIsDeadlineModalOpen(true)}
          className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden group cursor-pointer hover:border-[#DE3A1E]/40 transition-all"
          title="Click to edit deadline or start next cycle"
        >
          <div className="absolute top-0 right-0 w-24 sm:w-28 h-24 sm:h-28 bg-[#DE3A1E]/10 rounded-full blur-2xl group-hover:bg-[#DE3A1E]/25 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4b5563]">
              Deadline
            </span>
            <div className="flex items-center space-x-1">
              <span className="p-1 sm:p-1.5 rounded-xl bg-orange-50 text-[#DE3A1E] group-hover:text-[#9E1B1E] border border-orange-200 shadow-inner transition-colors">
                <Edit3 className="w-3 h-3" />
              </span>
              <span className="p-1 sm:p-1.5 rounded-xl bg-red-50 text-[#9E1B1E] border border-red-200 shadow-inner">
                <CalendarDays className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-black font-sans font-mono">
              {deadline}
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[9px] sm:text-[10px] font-bold bg-[#DE3A1E]/10 text-[#DE3A1E] border border-[#DE3A1E]/25 shadow-sm">
              Target
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] sm:text-[11px]">
            <span className="text-[#9E1B1E] group-hover:text-[#DE3A1E] transition-colors flex items-center gap-1 font-bold">
              <span>Edit / Next Cycle</span>
              <span className="text-[10px]">→</span>
            </span>
            <span className="text-[#4b5563] font-medium hidden xs:inline">Final Delivery</span>
          </div>
        </div>

      </div>

      {/* KaarTech Workstream Filter Bar */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-3.5 sm:p-4.5">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4b5563]">
            Workstreams (Tap to filter)
          </span>
          {filters.stream !== 'all' && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, stream: 'all' }))}
              className="text-[10px] sm:text-[11px] text-[#9E1B1E] hover:text-[#DE3A1E] font-bold transition-colors"
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {streams.map(st => {
            const stData = stats.workstreamProgress[st] || { total: 0, completed: 0, progress: 0 };
            const style = WORKSTREAM_COLORS[st] || {
              badge: 'bg-red-50 text-[#9E1B1E] border-red-200',
              bar: 'bg-gradient-to-r from-[#9E1B1E] to-[#DE3A1E]',
              text: 'text-[#9E1B1E]',
              dot: 'bg-[#9E1B1E]'
            };
            const isSelected = filters.stream === st;

            return (
              <button
                key={st}
                onClick={() => handleStreamClick(st)}
                className={`text-left p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all ${
                  isSelected 
                    ? 'bg-gradient-to-br from-red-50 to-orange-50 border-[#9E1B1E]/40 shadow-md ring-2 ring-[#9E1B1E]/20' 
                    : 'bg-white hover:bg-stone-50 border-[#9E1B1E]/10 hover:border-[#DE3A1E]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className={`w-2 h-2 rounded-full ${style.dot} shrink-0 shadow-sm`}></span>
                    <span className="text-[11px] sm:text-xs font-bold text-black truncate">
                      {st}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-black pl-1 shrink-0">
                    {stData.progress}%
                  </span>
                </div>
                
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                  <div 
                    className={`h-full ${style.bar} rounded-full transition-all duration-500 shadow-sm`}
                    style={{ width: `${stData.progress}%` }}
                  ></div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[9px] sm:text-[10px] text-[#4b5563]">
                  <span>{stData.total} items</span>
                  <span className="font-semibold text-black">{stData.completed} done</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
