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
    <div className="glass-card rounded-2xl sm:rounded-3xl p-3 border border-[#9E1B1E]/10 shadow-sm">
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
        
        {/* Search Input */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#DE3A1E]" />
          <input
            type="text"
            placeholder="Search deliverables, owners, milestones..."
            value={filters.search}
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-full glass-input text-[#111827] placeholder-[#6b7280] focus:outline-none"
          />
          {filters.search && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#6b7280] hover:text-[#9E1B1E]"
            >
              ✕
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-1.5 sm:gap-2">
          
          {/* Workstream filter */}
          <div className="relative">
            <select
              value={filters.stream}
              onChange={(e) => setFilters(prev => ({ ...prev, stream: e.target.value }))}
              className="w-full sm:w-auto appearance-none pl-7 pr-7 py-1.5 text-xs rounded-full glass-input text-[#111827] font-medium cursor-pointer truncate"
            >
              <option value="all">All Streams</option>
              {streams.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <Layers className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#DE3A1E] pointer-events-none" />
          </div>

          {/* Owner filter */}
          <div className="relative">
            <select
              value={filters.owner}
              onChange={(e) => setFilters(prev => ({ ...prev, owner: e.target.value }))}
              className="w-full sm:w-auto appearance-none pl-7 pr-7 py-1.5 text-xs rounded-full glass-input text-[#111827] font-medium cursor-pointer truncate"
            >
              <option value="all">All Owners</option>
              {owners.map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
            <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#9E1B1E] pointer-events-none" />
          </div>

          {/* Status filter */}
          <div className="relative">
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              className="w-full sm:w-auto appearance-none pl-7 pr-7 py-1.5 text-xs rounded-full glass-input text-[#111827] font-medium cursor-pointer truncate"
            >
              <option value="all">All Statuses</option>
              <option value="in-progress">Active</option>
              <option value="completed">Done (100%)</option>
              <option value="delayed">Delayed</option>
              <option value="not-started">Not Started</option>
            </select>
            <CheckCircle2 className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-emerald-600 pointer-events-none" />
          </div>

          {/* Priority filter */}
          <div className="relative">
            <select
              value={filters.priority}
              onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
              className="w-full sm:w-auto appearance-none pl-7 pr-7 py-1.5 text-xs rounded-full glass-input text-[#111827] font-medium cursor-pointer truncate"
            >
              <option value="all">All Priorities</option>
              <option value="high">High Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="low">Low Priority</option>
            </select>
            <Flame className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-[#DE3A1E] pointer-events-none" />
          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="col-span-2 sm:col-span-1 inline-flex items-center justify-center px-3 py-1.5 text-xs font-semibold rounded-full glass-btn text-[#9E1B1E] hover:bg-red-50"
              title="Reset filters"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Reset
            </button>
          )}
        </div>

        {/* Counter indicator */}
        <div className="text-[11px] text-[#4b5563] whitespace-nowrap text-center lg:text-right font-mono pt-1 lg:pt-0">
          <span className="text-black font-bold">{filteredItems.length}</span> of {items.length} Deliverables
        </div>

      </div>
    </div>
  );
};
