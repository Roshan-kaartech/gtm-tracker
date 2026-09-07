import React from 'react';
import { useGTM } from '../../context/GTMContext';
import { OWNER_AVATARS } from '../../data/initialData';
import { Users, ArrowRight } from 'lucide-react';

export const TeamView: React.FC = () => {
  const { items, owners, setFilters, setViewMode } = useGTM();

  const ownerStats = owners.map(ownerName => {
    const ownerItems = items.filter(i => i.owner === ownerName);
    
    let totalMilestones = 0;
    let completedMilestones = 0;
    let inProgressMilestones = 0;
    let delayedMilestones = 0;

    ownerItems.forEach(item => {
      [item.milestone1, item.milestone2, item.milestone3].forEach(m => {
        if (m && m.status !== 'not-applicable' && m.name && m.name !== 'N/A') {
          totalMilestones += 1;
          if (m.status === 'completed') completedMilestones += 1;
          else if (m.status === 'in-progress') inProgressMilestones += 1;
          else if (m.status === 'delayed') delayedMilestones += 1;
        }
      });
    });

    const avgProgress = ownerItems.length > 0
      ? Math.round(ownerItems.reduce((acc, i) => acc + i.progress, 0) / ownerItems.length)
      : 0;

    const avatar = OWNER_AVATARS[ownerName] || {
      bg: 'bg-[#9E1B1E] text-white',
      initial: ownerName.slice(0, 2).toUpperCase(),
      role: 'Strategy Contributor'
    };

    return {
      name: ownerName,
      avatar,
      items: ownerItems,
      totalItems: ownerItems.length,
      totalMilestones,
      completedMilestones,
      inProgressMilestones,
      delayedMilestones,
      avgProgress
    };
  });

  const handleFilterToOwner = (ownerName: string) => {
    setFilters(prev => ({ ...prev, owner: ownerName }));
    setViewMode('matrix');
  };

  return (
    <div className="space-y-3.5 sm:space-y-4">
      {/* Header banner */}
      <div className="flex items-center justify-between px-3.5 sm:px-4 py-2.5 rounded-2xl sm:rounded-3xl glass-card">
        <div>
          <h3 className="text-xs font-bold text-black flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-[#DE3A1E]" />
            Team Leadership ({owners.length} Leads)
          </h3>
          <p className="text-[10px] sm:text-[11px] text-[#4b5563]">
            Ownership, workload, and milestone velocity.
          </p>
        </div>
      </div>

      {/* Team Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
        {ownerStats.map(owner => (
          <div
            key={owner.name}
            className="glass-card rounded-2xl sm:rounded-3xl p-4 sm:p-5 flex flex-col justify-between border border-[#9E1B1E]/12"
          >
            <div>
              {/* Avatar & Role */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center space-x-2.5 sm:space-x-3">
                  <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center font-bold text-xs ${owner.avatar.bg} shadow-md shrink-0`}>
                    {owner.avatar.initial}
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-black text-xs truncate">
                      {owner.name}
                    </h4>
                    <p className="text-[10px] text-[#4b5563] font-medium truncate">
                      {owner.avatar.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Progress bar */}
              <div className="space-y-1 mb-3.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#4b5563] font-medium">Completion</span>
                  <span className="font-mono font-bold text-black">{owner.avgProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden p-0.5 border border-stone-200">
                  <div
                    className="h-full bg-gradient-to-r from-[#9E1B1E] to-[#DE3A1E] rounded-full transition-all duration-500 shadow-sm"
                    style={{ width: `${owner.avgProgress}%` }}
                  ></div>
                </div>
              </div>

              {/* Stats badges */}
              <div className="grid grid-cols-3 gap-1.5 text-center mb-3.5">
                <div className="bg-stone-50 rounded-xl p-1.5 sm:p-2 border border-stone-200 shadow-xs">
                  <div className="text-xs font-bold text-black font-mono">{owner.totalItems}</div>
                  <div className="text-[9px] text-[#4b5563] font-medium">Items</div>
                </div>
                <div className="bg-emerald-50 rounded-xl p-1.5 sm:p-2 border border-emerald-200 shadow-xs">
                  <div className="text-xs font-bold text-emerald-700 font-mono">{owner.completedMilestones}</div>
                  <div className="text-[9px] text-emerald-800 font-bold">Done</div>
                </div>
                <div className="bg-orange-50 rounded-xl p-1.5 sm:p-2 border border-orange-200 shadow-xs">
                  <div className="text-xs font-bold text-[#DE3A1E] font-mono">{owner.inProgressMilestones}</div>
                  <div className="text-[9px] text-[#DE3A1E] font-bold">Active</div>
                </div>
              </div>

              {/* Assigned List */}
              <div className="space-y-1 border-t border-stone-100 pt-2.5 mb-3.5">
                <div className="text-[9px] uppercase font-bold tracking-wider text-[#4b5563]">
                  Assigned Initiatives ({owner.items.length}):
                </div>
                <div className="space-y-1 max-h-24 overflow-y-auto pr-0.5">
                  {owner.items.map(i => (
                    <div
                      key={i.id}
                      className="text-[10px] p-1.5 rounded-lg bg-stone-50 border border-stone-100 flex items-center justify-between"
                    >
                      <span className="truncate pr-2 text-black font-semibold">
                        {i.title}
                      </span>
                      <span className="text-[10px] font-mono text-black shrink-0 font-bold">
                        {i.progress}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action */}
            <button
              onClick={() => handleFilterToOwner(owner.name)}
              className="w-full py-1.5 px-3 rounded-full text-xs font-bold glass-btn text-[#9E1B1E] hover:text-[#DE3A1E] hover:bg-red-50 transition-all flex items-center justify-center gap-1"
            >
              <span>View in Matrix</span>
              <ArrowRight className="w-3 h-3" />
            </button>

          </div>
        ))}
      </div>
    </div>
  );
};
