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
  Sun, 
  Moon, 
  FileSpreadsheet,
  Command,
  CalendarDays
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    viewMode, 
    setViewMode, 
    theme, 
    toggleTheme, 
    setIsAddModalOpen, 
    setIsDataModalOpen,
    setIsDeadlineModalOpen,
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
          
          {/* Brand & Title */}
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-white/[0.08] backdrop-blur-xl border border-white/[0.18] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] shrink-0">
              <Command className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
            </div>
            <div className="truncate">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white font-sans drop-shadow-sm truncate max-w-[120px] sm:max-w-none">
                  {cycleTitle}
                </h1>
                <span className="hidden xs:inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(48,209,88,0.15)]">
                  <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-emerald-400 mr-1 animate-pulse shadow-[0_0_6px_#30d158]"></span>
                  Live Sync
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-[#86868b] flex items-center gap-1">
                <span className="hidden sm:inline">Executive Tracker •</span>
                <button
                  onClick={() => setIsDeadlineModalOpen(true)}
                  className="text-[#f5f5f7] font-medium hover:text-amber-400 flex items-center gap-1 transition-colors group cursor-pointer"
                  title="Click to edit deadline"
                >
                  <CalendarDays className="w-2.5 h-2.5 text-amber-400" />
                  <span>{deadline}</span>
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
                  className={`flex items-center px-3.5 py-1.5 text-xs font-medium glass-segmented-btn ${
                    isActive
                      ? 'active font-semibold text-white'
                      : 'text-[#86868b] hover:text-[#f5f5f7] hover:bg-white/[0.04]'
                  }`}
                >
                  <span className="mr-1.5 opacity-85">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Glass Actions */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 shrink-0">
            <button
              onClick={() => setIsDeadlineModalOpen(true)}
              className="hidden lg:inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full glass-btn text-amber-300 hover:text-amber-200 border-amber-500/30"
              title="Change Deadline or Start Next Cycle"
            >
              <CalendarDays className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
              {deadline}
            </button>

            <button
              onClick={exportDataExcel}
              className="hidden sm:inline-flex items-center px-3 py-1.5 text-xs font-medium rounded-full glass-btn text-[#86868b] hover:text-white"
              title="Download Excel spreadsheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
              Excel
            </button>

            <button
              onClick={() => setIsDataModalOpen(true)}
              className="p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium rounded-full glass-btn text-[#86868b] hover:text-white flex items-center"
              title="Data Hub"
            >
              <Database className="w-3.5 h-3.5 sm:mr-1.5 text-blue-400" />
              <span className="hidden sm:inline">Data Hub</span>
            </button>

            <button
              onClick={toggleTheme}
              className="p-1.5 sm:p-2 rounded-full glass-btn text-[#86868b] hover:text-white"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-blue-400" />}
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-3 sm:px-4 py-1.5 text-xs font-semibold rounded-full glass-btn-primary shadow-sm"
            >
              <Plus className="w-3.5 h-3.5 sm:mr-1" />
              <span className="hidden xs:inline">New Item</span>
            </button>
          </div>

        </div>

        {/* Mobile View Switcher (Scrollable Touch Pills) */}
        <div className="flex md:hidden items-center space-x-1.5 overflow-x-auto py-2 no-scrollbar border-t border-white/[0.06] -mx-3 px-3">
          {navItems.map(item => {
            const isActive = viewMode === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setViewMode(item.id)}
                className={`flex items-center px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isActive
                    ? 'bg-white/20 text-white font-semibold border border-white/25 shadow-[0_2px_10px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.3)]'
                    : 'text-[#86868b] hover:text-white bg-white/[0.03] border border-white/[0.05]'
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
