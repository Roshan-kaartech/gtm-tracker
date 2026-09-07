import React from 'react';
import { useGTM } from '../context/GTMContext';
import { ViewMode } from '../types/gtm';
import { 
  Table2, 
  GanttChartSquare, 
  Kanban, 
  Target, 
  Users, 
  BarChart3, 
  Plus, 
  Database, 
  FileSpreadsheet,
  CalendarDays
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    setIsAddModalOpen, 
    setIsDataModalOpen,
    setIsDeadlineModalOpen,
    setIsSupabaseModalOpen,
    isCloudConnected,
    deadline,
    cycleTitle,
    exportDataExcel
  } = useGTM();

  const navItems: { id: ViewMode; label: string; icon: React.ReactNode }[] = [
    { id: 'matrix', label: 'Matrix', icon: <Table2 className="w-3.5 h-3.5" /> },
    { id: 'gantt', label: 'Roadmap', icon: <GanttChartSquare className="w-3.5 h-3.5" /> },
    { id: 'kanban', label: 'Board', icon: <Kanban className="w-3.5 h-3.5" /> },
    { id: 'milestones', label: 'Milestones', icon: <Target className="w-3.5 h-3.5" /> },
    { id: 'team', label: 'Team', icon: <Users className="w-3.5 h-3.5" /> },
    { id: 'analytics', label: 'Insights', icon: <BarChart3 className="w-3.5 h-3.5" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-header transition-all">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* KaarTech Brand & Title */}
          <div className="flex items-center space-x-2.5 sm:space-x-3.5 min-w-0">
            {/* KaarTech Custom Logo Badge */}
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-[#9E1B1E] via-[#DE3A1E] to-[#9E1B1E] flex items-center justify-center shadow-[0_4px_14px_rgba(158,27,30,0.35),inset_0_1px_1px_rgba(255,255,255,0.4)] shrink-0 text-white font-extrabold text-sm sm:text-base tracking-tighter">
              KT
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="font-extrabold text-xs sm:text-sm text-black tracking-tight">
                  KaarTech
                </span>
                <span className="text-[#9E1B1E] font-bold text-xs sm:text-sm hidden xs:inline">•</span>
                <h1 className="text-xs sm:text-sm font-bold tracking-tight text-[#111827] truncate max-w-[120px] sm:max-w-none">
                  {cycleTitle}
                </h1>
                
                {/* Cloud Sync Status Badge */}
                <button
                  onClick={() => setIsSupabaseModalOpen(true)}
                  className={`hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold transition-all border shadow-xs ${
                    isCloudConnected
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                      : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                  }`}
                  title={isCloudConnected ? 'Supabase Real-Time Cloud Sync Active (Click to manage)' : 'Running on Local Storage (Click to connect Supabase)'}
                >
                  <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${isCloudConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`}></span>
                  <span>{isCloudConnected ? 'Cloud Sync' : 'Local Mode'}</span>
                </button>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#4b5563] flex items-center gap-1">
                <span className="hidden sm:inline">GTM Executive Strategy •</span>
                <button
                  onClick={() => setIsDeadlineModalOpen(true)}
                  className="text-[#9E1B1E] font-semibold hover:text-[#DE3A1E] flex items-center gap-1 transition-colors group cursor-pointer"
                  title="Click to edit deadline"
                >
                  <CalendarDays className="w-2.5 h-2.5 text-[#DE3A1E]" />
                  <span>{deadline} Deadline</span>
                </button>
              </p>
            </div>
          </div>

          {/* Frosted Glass Segmented Control View Switcher (Desktop) */}
          <div className="hidden md:flex items-center glass-segmented">
            {navItems.map(item => {
              const isActive = viewMode === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setViewMode(item.id)}
                  className={`flex items-center px-3.5 py-1.5 text-xs font-semibold glass-segmented-btn ${
                    isActive
                      ? 'active font-bold text-white'
                      : 'text-[#4b5563] hover:text-[#9E1B1E] hover:bg-white/60'
                  }`}
                >
                  <span className="mr-1.5 opacity-90">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Glass Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            {/* Cloud Sync Button (Mobile/Tablet) */}
            <button
              onClick={() => setIsSupabaseModalOpen(true)}
              className={`inline-flex sm:hidden p-1.5 text-xs font-semibold rounded-full border transition-all ${
                isCloudConnected
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-amber-50 text-amber-700 border-amber-300'
              }`}
              title="Cloud Sync"
            >
              <span className={`w-2 h-2 rounded-full ${isCloudConnected ? 'bg-emerald-600 animate-pulse' : 'bg-amber-500'}`}></span>
            </button>

            <button
              onClick={() => setIsDeadlineModalOpen(true)}
              className="hidden lg:inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full glass-btn text-[#9E1B1E] hover:text-[#DE3A1E] border-[#9E1B1E]/20"
              title="Change Deadline or Start Next Cycle"
            >
              <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-[#DE3A1E]" />
              {deadline}
            </button>

            <button
              onClick={exportDataExcel}
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-full glass-btn text-[#111827] hover:text-[#9E1B1E]"
              title="Download Excel spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
              Excel
            </button>

            <button
              onClick={() => setIsDataModalOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-semibold rounded-full glass-btn text-[#111827] hover:text-[#9E1B1E] flex items-center"
              title="Data Hub & Backups"
            >
              <Database className="w-3.5 h-3.5 sm:mr-1.5 text-[#DE3A1E]" />
              <span className="hidden sm:inline">Data Hub</span>
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-3 sm:px-4 py-1.5 text-xs font-bold rounded-full glass-btn-primary shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden xs:inline">New Item</span>
            </button>
          </div>

        </div>

        {/* Mobile View Switcher */}
        <div className="flex md:hidden items-center space-x-1.5 overflow-x-auto py-2 no-scrollbar border-t border-[#9E1B1E]/10 -mx-3 px-3">
          {navItems.map(item => {
            const isActive = viewMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setViewMode(item.id)}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-gradient-to-r from-[#9E1B1E] to-[#DE3A1E] text-white shadow-md'
                    : 'text-[#4b5563] hover:text-[#9E1B1E] bg-white border border-[#9E1B1E]/10'
                }`}
              >
                <span className="mr-1.5 opacity-90">{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
