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
          <h3 className="text-xs font-semibold text-white flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5 text-blue-400" />
            Executive GTM Insights & Velocity
          </h3>
          <p className="text-[11px] text-[#86868b]">
            Stream completion, milestone health, and critical path analysis.
          </p>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-[0_0_12px_rgba(48,209,88,0.15)] flex items-center gap-1.5 font-mono">
          <ShieldCheck className="w-3.5 h-3.5" />
          {stats.completedMilestones}/{stats.totalMilestones} Done ({stats.overallProgress}%)
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Stream Readiness */}
        <div className="glass-card rounded-3xl p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-blue-400" />
                Workstream Readiness
              </h4>
              <p className="text-[10px] text-[#86868b]">
                Weighted progress across workstreams
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-white">
              {stats.overallProgress}% Overall
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {streams.map(st => {
              const stData = stats.workstreamProgress[st] || { total: 0, completed: 0, progress: 0 };
              const style = WORKSTREAM_COLORS[st] || {
                bar: 'bg-blue-500',
                dot: 'bg-blue-400'
              };

              return (
                <div key={st} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#f5f5f7] font-medium">{st}</span>
                    <div className="flex items-center space-x-2 text-[11px] font-mono">
                      <span className="text-[#86868b]">{stData.completed}/{stData.total} done</span>
                      <span className="font-bold text-white">{stData.progress}%</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-white/[0.08] rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                    <div
                      className={`h-full ${style.bar} rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(41,151,255,0.3)]`}
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
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <div>
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
                <PieChart className="w-3.5 h-3.5 text-purple-400" />
                Milestones Distribution ({stats.totalMilestones})
              </h4>
              <p className="text-[10px] text-[#86868b]">
                Breakdown of all discrete milestone statuses
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold">
              {stats.completedMilestones} Done
            </span>
          </div>

          {/* Minimalist Bar */}
          <div className="pt-1">
            <div className="w-full h-3 bg-white/[0.06] rounded-full overflow-hidden flex border border-white/[0.08] shadow-inner">
              {stats.totalMilestones > 0 && (
                <>
                  <div
                    className="bg-emerald-400 h-full shadow-[0_0_8px_#30d158]"
                    style={{ width: `${(stats.completedMilestones / stats.totalMilestones) * 100}%` }}
                  ></div>
                  <div
                    className="bg-blue-400 h-full shadow-[0_0_8px_#2997ff]"
                    style={{ width: `${(stats.inProgressMilestones / stats.totalMilestones) * 100}%` }}
                  ></div>
                  <div
                    className="bg-rose-400 h-full shadow-[0_0_8px_#ff453a]"
                    style={{ width: `${(stats.delayedMilestones / stats.totalMilestones) * 100}%` }}
                  ></div>
                </>
              )}
            </div>

            {/* Chips */}
            <div className="grid grid-cols-4 gap-2 mt-3.5 text-center">
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-2 shadow-sm">
                <div className="text-base font-bold text-emerald-400 font-mono">{stats.completedMilestones}</div>
                <div className="text-[9px] text-[#86868b] mt-0.5">Done</div>
              </div>
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-2 shadow-sm">
                <div className="text-base font-bold text-blue-400 font-mono">{stats.inProgressMilestones}</div>
                <div className="text-[9px] text-[#86868b] mt-0.5">Active</div>
              </div>
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-2 shadow-sm">
                <div className="text-base font-bold text-rose-400 font-mono">{stats.delayedMilestones}</div>
                <div className="text-[9px] text-[#86868b] mt-0.5">Delayed</div>
              </div>
              <div className="bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl p-2 shadow-sm">
                <div className="text-base font-bold text-[#86868b] font-mono">
                  {Math.max(0, stats.totalMilestones - stats.completedMilestones - stats.inProgressMilestones - stats.delayedMilestones)}
                </div>
                <div className="text-[9px] text-[#86868b] mt-0.5">Upcoming</div>
              </div>
            </div>

            <div className="mt-3.5 p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-[11px] text-[#86868b] flex items-start gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Velocity:</strong> 3 critical milestones in Email & GTM Whitepapers completed on 15-Aug.
              </span>
            </div>
          </div>
        </div>

        {/* Priority Matrix */}
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              Priority Critical Path
            </h4>
            <span className="text-xs text-rose-400 font-mono">{highPriority.length} High</span>
          </div>

          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#f5f5f7]">High Priority ({highPriority.length})</span>
                <p className="text-[10px] text-[#86868b] mt-0.5">Core GTM whitepapers, playbooks, and website</p>
              </div>
              <span className="text-xs font-mono font-bold text-white">{highProg}%</span>
            </div>

            <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-[#f5f5f7]">Medium Priority ({medPriority.length})</span>
                <p className="text-[10px] text-[#86868b] mt-0.5">Webinars, events, and operational kits</p>
              </div>
              <span className="text-xs font-mono font-bold text-white">
                {medPriority.length > 0 ? Math.round(medPriority.reduce((a, b) => a + b.progress, 0) / medPriority.length) : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Workload Capacity */}
        <div className="glass-card rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Workload Allocation
            </h4>
            <span className="text-xs text-[#86868b] font-mono">{owners.length} Leads</span>
          </div>

          <div className="space-y-2">
            {owners.map(oName => {
              const oItems = items.filter(i => i.owner === oName);
              const avatar = OWNER_AVATARS[oName];
              const pct = (oItems.length / items.length) * 100;

              return (
                <div key={oName} className="flex items-center space-x-2.5 text-xs">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[8px] shrink-0 ${avatar?.bg || 'bg-white/10'} border border-white/20`}>
                    {avatar?.initial || '?'}
                  </div>
                  <span className="text-[#f5f5f7] w-24 truncate text-xs font-medium">{oName}</span>
                  <div className="flex-1 h-1.5 bg-white/[0.08] rounded-full overflow-hidden p-0.5 border border-white/[0.06]">
                    <div
                      className="h-full bg-white rounded-full shadow-[0_0_6px_rgba(255,255,255,0.4)]"
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="font-mono text-[10px] text-[#86868b] shrink-0 w-12 text-right">
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
