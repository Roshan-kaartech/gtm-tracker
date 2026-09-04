import React from 'react';
import { useGTM } from '../context/GTMContext';
import { Search, RotateCcw, User, Layers, CheckCircle2, Flame } from 'lucide-react';

export const FilterBar: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    resetFilters, 
    streams, 
    owners, 
    filteredItems, 
    items 
  } = useGTM();

  const hasActiveFilters = 
    filters.search !== '' || 
    filters.stream !== 'all' || 
    filters.owner !== 'all' || 
    filters.status !== 'all' || 
    filters.priority !== 'all';

  return (
    <div className="glass-card rounded-2xl sm:rounded-3xl p-3 border border-white/[0.1]">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        
        {/* Glass Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#86868b]" />
          <input
            type="text"
            placeholder="Search deliverables, owners, milestones..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-full glass-input text-[#f5f5f7] placeholder-[#86868b] focus:outline-none"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#86868b] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Glass Dropdowns (Responsive Grid on Mobile) */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2">
          
          {/* Workstream filter */}
          <div className="relative">
            <select
              value={filters.stream}
              onChange={(e) => setFilters(prev => ({ ...prev, stream: e.target.value }))}
              className="w-full sm:w-auto appearance-none pl-7 pr-7 py-1.5 text-xs rounded-full glass-input text-[#f5f5f7] cursor-pointer truncate"
            >
              <option value="all" className="bg-[#121215] text-white">All Streams</option>
              {streams.map(s => (
                <option key={s} value={s} className="bg-[#121215] text-white">{s}</option>
              ))}
            </select>
            <Layers className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#86868b] pointer-events-none" />
          </div>

          {/* Owner filter */}
          <div className="relative">
            <select
              value={filters.owner}
              onChange={(e) => setFilters(prev => ({ ...prev, owner: e.target.value }))}
              className="w-full sm:w-auto appearance-none pl-7 pr-7 py-1.5 text-xs rounded-full glass-input text-[#f5f5f7] cursor-pointer truncate"
            >
              <option value="all" className="bg-[#121215] text-white">All Owners</option>
              {owners.map(o => (
                <option key={o} value={o} className="bg-[#121215] text-white">{o}</option>
              ))}
            </select>
            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#86868b] pointer-events-none" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full sm:w-auto appearance-none pl-7 pr-7 py-1.5 text-xs rounded-full glass-input text-[#f5f5f7] cursor-pointer truncate"
            >
              <option value="all" className="bg-[#121215] text-white">All Statuses</option>
              <option value="in-progress" className="bg-[#121215] text-white">Active</option>
              <option value="completed" className="bg-[#121215] text-white">Done (100%)</option>
              <option value="delayed" className="bg-[#121215] text-white">Delayed</option>
              <option value="not-started" className="bg-[#121215] text-white">Not Started</option>
            </select>
            <CheckCircle2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#86868b] pointer-events-none" />
          </div>

          {/* Priority filter */}
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full sm:w-auto appearance-none pl-7 pr-7 py-1.5 text-xs rounded-full glass-input text-[#f5f5f7] cursor-pointer truncate"
            >
              <option value="all" className="bg-[#121215] text-white">All Priorities</option>
              <option value="high" className="bg-[#121215] text-white">High Priority</option>
              <option value="medium" className="bg-[#121215] text-white">Medium Priority</option>
              <option value="low" className="bg-[#121215] text-white">Low Priority</option>
            </select>
            <Flame className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#86868b] pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="col-span-2 sm:col-span-1 inline-flex items-center justify-center px-3 py-1.5 text-xs font-medium rounded-full glass-btn text-[#86868b] hover:text-white"
              title="Reset filters"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </button>
          )}
        </div>

        {/* Counter indicator */}
        <div className="text-[11px] text-[#86868b] whitespace-nowrap text-center lg:text-right font-mono pt-1 lg:pt-0">
          <span className="text-white font-semibold">{filteredItems.length}</span> of {items.length} Deliverables
        </div>

      </div>
    </div>
  );
};
