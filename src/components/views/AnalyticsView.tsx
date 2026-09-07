import React from 'react';
import { useGTM } from '../../context/GTMContext';
import { WORKSTREAM_COLORS, OWNER_AVATARS } from '../../data/initialData';
import { 
  BarChart3, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  PieChart,
  Award
} from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { items, stats, streams, owners } = useGTM();

  const highPriority = items.filter(i => i.priority === 'high');
  const medPriority = items.filter(i => i.priority === 'medium');

  const highProg = highPriority.length > 0
    ? Math.round(highPriority.reduce((acc, i) => acc + i.progress, 0) / highPriority.length)
    : 0;

  return (
    <div className="space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-3xl glass-card">
        <div>
          <h3 className="text-xs font-bold text-black flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-[#DE3A1E]" />
            Executive GTM Insights & Velocity
          </h3>
          <p className="text-[11px] text-[#4b5563]">
            Workstream completion, milestone health, and critical path analysis.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm flex items-center gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          {stats.completedMilestones}/{stats.totalMilestones} Done ({stats.overallProgress}%)
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Stream Readiness */}
        <div className="glass-card rounded-3xl p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h4 className="font-extrabold text-black text-xs flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#DE3A1E]" />
                Workstream Readiness
              </h4>
              <p className="text-[10px] text-[#4b5563]">
                Weighted progress across workstreams
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-black">
              {stats.overallProgress}% Overall
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {streams.map(st => {
              const stData = stats.workstreamProgress[st] || { total: 0, completed: 0, progress: 0 };
              const style = WORKSTREAM_COLORS[st] || {
                bar: 'bg-gradient-to-r from-[#9E1B1E] to-[#DE3A1E]',
                dot: 'bg-[#9E1B1E]'
              };

              return (
                <div key={st} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-black font-bold">{st}</span>
                    <div className="flex items-center space-x-2 text-[11px] font-mono">
                      <span className="text-[#4b5563] font-medium">{stData.completed}/{stData.total} done</span>
                      <span className="font-bold text-black">{stData.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                    <div
                      className={`h-full ${style.bar} rounded-full transition-all duration-700 shadow-sm`}
                      style={{ width: `${stData.progress}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestone Distribution */}
        <div className="glass-card rounded-3xl p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div>
              <h4 className="font-extrabold text-black text-xs flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-[#9E1B1E]" />
                Milestones Distribution ({stats.totalMilestones})
              </h4>
              <p className="text-[10px] text-[#4b5563]">
                Breakdown of discrete milestone statuses
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 font-bold">
              {stats.completedMilestones} Done
            </span>
          </div>

          {/* Progress Bar */}
          <div className="pt-1">
            <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden flex border border-stone-200 shadow-inner">
              {stats.totalMilestones > 0 && (
                <>
                  <div
                    className="bg-emerald-600 h-full shadow-sm"
                    style={{ width: `${(stats.completedMilestones / stats.totalMilestones) * 100}%` }}
                  ></div>
                  <div
                    className="bg-[#DE3A1E] h-full shadow-sm"
                    style={{ width: `${(stats.inProgressMilestones / stats.totalMilestones) * 100}%` }}
                  ></div>
                  <div
                    className="bg-[#9E1B1E] h-full shadow-sm"
                    style={{ width: `${(stats.delayedMilestones / stats.totalMilestones) * 100}%` }}
                  ></div>
                </>
              )}
            </div>

            {/* Chips */}
            <div className="grid grid-cols-4 gap-2 mt-3.5 text-center">
              <div className="bg-emerald-50 rounded-2xl p-2 border border-emerald-200 shadow-xs">
                <div className="text-base font-bold text-emerald-700 font-mono">{stats.completedMilestones}</div>
                <div className="text-[9px] text-emerald-800 font-bold">Done</div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-2 border border-orange-200 shadow-xs">
                <div className="text-base font-bold text-[#DE3A1E] font-mono">{stats.inProgressMilestones}</div>
                <div className="text-[9px] text-[#DE3A1E] font-bold">Active</div>
              </div>
              <div className="bg-red-50 rounded-2xl p-2 border border-red-200 shadow-xs">
                <div className="text-base font-bold text-[#9E1B1E] font-mono">{stats.delayedMilestones}</div>
                <div className="text-[9px] text-[#9E1B1E] font-bold">Delayed</div>
              </div>
              <div className="bg-stone-50 rounded-2xl p-2 border border-stone-200 shadow-xs">
                <div className="text-base font-bold text-black font-mono">
                  {Math.max(0, stats.totalMilestones - stats.completedMilestones - stats.inProgressMilestones - stats.delayedMilestones)}
                </div>
                <div className="text-[9px] text-[#4b5563] font-medium">Upcoming</div>
              </div>
            </div>

            <div className="mt-3.5 p-3 rounded-2xl bg-red-50/50 border border-[#9E1B1E]/15 text-[11px] text-[#4b5563] flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-[#DE3A1E] shrink-0 mt-0.5" />
              <span>
                <strong className="text-black">Velocity:</strong> 3 critical milestones in Email & GTM Whitepapers completed on 15-Aug.
              </span>
            </div>
          </div>
        </div>

        {/* Priority Matrix */}
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h4 className="font-extrabold text-black text-xs flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#DE3A1E]" />
              Priority Critical Path
            </h4>
            <span className="text-xs text-[#9E1B1E] font-bold font-mono">{highPriority.length} High</span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-black">High Priority ({highPriority.length})</span>
                <p className="text-[10px] text-[#4b5563] mt-0.5 font-medium">Core GTM whitepapers, playbooks, and website</p>
              </div>
              <span className="text-xs font-mono font-bold text-black">{highProg}%</span>
            </div>

            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-black">Medium Priority ({medPriority.length})</span>
                <p className="text-[10px] text-[#4b5563] mt-0.5 font-medium">Webinars, events, and operational kits</p>
              </div>
              <span className="text-xs font-mono font-bold text-black">
                {medPriority.length > 0 ? Math.round(medPriority.reduce((a, b) => a + b.progress, 0) / medPriority.length) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Workload Capacity */}
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <h4 className="font-extrabold text-black text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#9E1B1E]" />
              Workload Allocation
            </h4>
            <span className="text-xs text-[#4b5563] font-bold font-mono">{owners.length} Leads</span>
          </div>

          <div className="space-y-2">
            {owners.map(oName => {
              const oItems = items.filter(i => i.owner === oName);
              const avatar = OWNER_AVATARS[oName];
              const pct = (oItems.length / items.length) * 100;

              return (
                <div key={oName} className="flex items-center space-x-2.5 text-xs">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[8px] shrink-0 ${avatar?.bg || 'bg-[#9E1B1E] text-white'}`}>
                    {avatar?.initial || '?'}
                  </div>
                  <span className="text-black w-24 truncate text-xs font-bold">{oName}</span>
                  <div className="flex-1 h-1.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                    <div
                      className="h-full bg-gradient-to-r from-[#9E1B1E] to-[#DE3A1E] rounded-full"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="font-mono text-[10px] text-[#4b5563] shrink-0 w-12 text-right font-semibold">
                    {oItems.length} items
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
