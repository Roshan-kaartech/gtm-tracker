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
      {/* Bento Grid Top Glass Metrics */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3">
        
        {/* Card 1: GTM Readiness */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 sm:w-28 h-24 sm:h-28 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all pointer-events-none"></div>
          
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
              GTM Readiness
            </span>
            <span className="text-[10px] sm:text-[11px] font-medium text-emerald-400 flex items-center bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25 shadow-[0_0_12px_rgba(48,209,88,0.15)]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse shadow-[0_0_6px_#30d158]"></span>
              Strict
            </span>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans drop-shadow-sm">
              {stats.overallProgress}%
            </div>
            <span className="text-[11px] sm:text-xs font-mono text-[#86868b]">
              {stats.completedMilestones}/{stats.totalMilestones} Met
            </span>
          </div>

          {/* Frosted Progress Bar */}
          <div className="mt-3 w-full h-1.5 sm:h-2 bg-white/[0.06] rounded-full overflow-hidden p-0.5 border border-white/[0.08] shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-emerald-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(41,151,255,0.4)]"
              style={{ width: `${Math.max(stats.overallProgress, 2)}%` }}
            ></div>
          </div>
        </div>

        {/* Card 2: Active Initiatives */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 sm:w-28 h-24 sm:h-28 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
              Initiatives
            </span>
            <span className="p-1 sm:p-1.5 rounded-xl bg-white/[0.06] text-[#86868b] border border-white/[0.1] shadow-inner">
              <Target className="w-3.5 h-3.5 text-blue-400" />
            </span>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans drop-shadow-sm">
              {stats.totalItems}
            </div>
            <span className="text-[11px] sm:text-xs text-[#86868b]">
              {streams.length} Streams
            </span>
          </div>

          <div className="mt-3 flex items-center gap-1.5 sm:gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-white/[0.08] text-[#f5f5f7] border border-white/[0.12] shadow-sm truncate max-w-[130px]">
              {cycleTitle}
            </span>
            <span className="text-[10px] sm:text-[11px] text-[#86868b]">Active</span>
          </div>
        </div>

        {/* Card 3: Milestone Pulse */}
        <div className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 sm:w-28 h-24 sm:h-28 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
              Milestone Pulse
            </span>
            <span className="p-1 sm:p-1.5 rounded-xl bg-white/[0.06] text-[#86868b] border border-white/[0.1] shadow-inner">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </span>
          </div>

          <div className="mt-3 sm:mt-4 grid grid-cols-3 gap-1.5 sm:gap-2 text-center">
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-sm">
              <div className="text-base sm:text-lg font-bold text-emerald-400 font-sans">{stats.completedMilestones}</div>
              <div className="text-[9px] sm:text-[10px] text-[#86868b] font-medium">Done</div>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-sm">
              <div className="text-base sm:text-lg font-bold text-blue-400 font-sans">{stats.inProgressMilestones}</div>
              <div className="text-[9px] sm:text-[10px] text-[#86868b] font-medium">Active</div>
            </div>
            <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-xl sm:rounded-2xl p-1.5 sm:p-2 shadow-sm">
              <div className="text-base sm:text-lg font-bold text-rose-400 font-sans">{stats.delayedMilestones}</div>
              <div className="text-[9px] sm:text-[10px] text-[#86868b] font-medium">Delayed</div>
            </div>
          </div>
        </div>

        {/* Card 4: Deadline (Click to edit or start next cycle) */}
        <div 
          onClick={() => setIsDeadlineModalOpen(true)}
          className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 relative overflow-hidden group cursor-pointer hover:border-amber-500/40 transition-all"
          title="Click to edit deadline or start next cycle"
        >
          <div className="absolute top-0 right-0 w-24 sm:w-28 h-24 sm:h-28 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/25 transition-all pointer-events-none"></div>

          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
              Deadline
            </span>
            <div className="flex items-center space-x-1">
              <span className="p-1 sm:p-1.5 rounded-xl bg-white/[0.06] text-[#86868b] group-hover:text-amber-400 border border-white/[0.1] shadow-inner transition-colors">
                <Edit3 className="w-3 h-3" />
              </span>
              <span className="p-1 sm:p-1.5 rounded-xl bg-white/[0.06] text-[#86868b] border border-white/[0.1] shadow-inner">
                <CalendarDays className="w-3.5 h-3.5 text-amber-400" />
              </span>
            </div>
          </div>

          <div className="mt-3 sm:mt-4 flex items-baseline justify-between">
            <div className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-sans drop-shadow-sm font-mono">
              {deadline}
            </div>
            <span className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/25 shadow-sm">
              Target
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between text-[10px] sm:text-[11px] text-[#86868b]">
            <span className="text-amber-300/80 group-hover:text-amber-300 transition-colors flex items-center gap-1 font-medium">
              <span>Edit / Cycle</span>
              <span className="text-[10px]">→</span>
            </span>
            <span className="text-[#f5f5f7] font-medium hidden xs:inline">Final Delivery</span>
          </div>
        </div>

      </div>

      {/* Glass Stream Filter Pills Bar */}
      <div className="glass-card rounded-2xl sm:rounded-3xl p-3 sm:p-4">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-[#86868b]">
            Workstreams (Tap to filter)
          </span>
          {filters.stream !== 'all' && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, stream: 'all' }))}
              className="text-[10px] sm:text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors"
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
          {streams.map(st => {
            const stData = stats.workstreamProgress[st] || { total: 0, completed: 0, progress: 0 };
            const style = WORKSTREAM_COLORS[st] || {
              badge: 'bg-white/[0.06] text-white border-white/[0.12]',
              bar: 'bg-blue-500',
              text: 'text-white',
              dot: 'bg-blue-400'
            };
            const isSelected = filters.stream === st;

            return (
              <button
                key={st}
                onClick={() => handleStreamClick(st)}
                className={`text-left p-2.5 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all ${
                  isSelected 
                    ? 'bg-white/[0.15] border-white/40 shadow-[0_4px_20px_rgba(255,255,255,0.1),inset_0_1px_1px_rgba(255,255,255,0.3)] ring-1 ring-white/30' 
                    : 'bg-white/[0.03] hover:bg-white/[0.07] border-white/[0.07] hover:border-white/[0.18]'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${style.dot} shrink-0 shadow-[0_0_8px_currentColor]`}></span>
                    <span className="text-[11px] sm:text-xs font-semibold text-[#f5f5f7] truncate">
                      {st}
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-[#f5f5f7] pl-1 shrink-0">
                    {stData.progress}%
                  </span>
                </div>
                
                <div className="w-full h-1 sm:h-1.5 bg-white/[0.08] rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                  <div 
                    className={`h-full ${style.bar} rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(41,151,255,0.3)]`}
                    style={{ width: `${stData.progress}%` }}
                  ></div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[9px] sm:text-[10px] text-[#86868b]">
                  <span>{stData.total} items</span>
                  <span>{stData.completed} done</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
