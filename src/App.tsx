import React from 'react';
import { GTMProvider, useGTM } from './context/GTMContext';
import { Header } from './components/Header';
import { KPISummary } from './components/KPISummary';
import { FilterBar } from './components/FilterBar';
import { MatrixView } from './components/views/MatrixView';
import { GanttView } from './components/views/GanttView';
import { KanbanView } from './components/views/KanbanView';
import { MilestonesView } from './components/views/MilestonesView';
import { TeamView } from './components/views/TeamView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { ItemEditModal } from './components/modals/ItemEditModal';
import { DataManagementModal } from './components/modals/DataManagementModal';
import { DeadlineModal } from './components/modals/DeadlineModal';
import { Toast } from './components/Toast';
import { ArrowUp, Calendar } from 'lucide-react';

const DashboardContent: React.FC = () => {
  const { 
    viewMode, 
    editingItem, 
    setEditingItem, 
    isAddModalOpen, 
    setIsAddModalOpen,
    isDataModalOpen,
    setIsDataModalOpen,
    isDeadlineModalOpen,
    setIsDeadlineModalOpen,
    deadline,
    cycleTitle,
    theme
  } = useGTM();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#000000] text-[#f5f5f7]' : 'bg-[#f5f5f7] text-[#1d1d1f]'} flex flex-col font-sans transition-colors duration-200 glass-mesh-bg relative overflow-x-hidden`}>
      
      {/* Floating Refractive Ambient Glow Orbs for Glassmorphism */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Center Electric Blue Spotlight */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-[90px] animate-pulse-subtle"></div>
        
        {/* Top-Right Purple Glow */}
        <div className="absolute top-20 right-[-100px] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[110px]"></div>
        
        {/* Mid-Left Cyan Glow */}
        <div className="absolute top-[40%] left-[-150px] w-[600px] h-[600px] bg-cyan-500/12 rounded-full blur-[120px]"></div>
        
        {/* Bottom-Center Emerald Subtle Glow */}
        <div className="absolute bottom-[-100px] left-1/3 w-[650px] h-[450px] bg-emerald-500/10 rounded-full blur-[130px]"></div>
      </div>

      {/* Glass Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4 relative z-10">
        
        {/* Glass Bento Summary */}
        <KPISummary />

        {/* Glass Filter and Search Bar */}
        <FilterBar />

        {/* Dynamic Glass View */}
        <section className="transition-all duration-300">
          {viewMode === 'matrix' && <MatrixView />}
          {viewMode === 'gantt' && <GanttView />}
          {viewMode === 'kanban' && <KanbanView />}
          {viewMode === 'milestones' && <MilestonesView />}
          {viewMode === 'team' && <TeamView />}
          {viewMode === 'analytics' && <AnalyticsView />}
        </section>

      </main>

      {/* Frosted Glass Footer */}
      <footer className="mt-12 border-t border-white/[0.08] py-6 bg-black/40 backdrop-blur-2xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#86868b]">
          <div className="flex items-center space-x-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#30d158]"></span>
            <span>{cycleTitle} Executive Tracker</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDeadlineModalOpen(true)}
              className="flex items-center text-[#86868b] hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Calendar className="w-3 h-3 mr-1 text-amber-400" />
              Target Deadline: <strong className="text-white ml-1 font-mono">{deadline}</strong>
            </button>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-full glass-btn text-[#86868b] hover:text-white transition-colors"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Glass Modals & Overlays */}
      <ItemEditModal
        isOpen={Boolean(editingItem)}
        onClose={() => setEditingItem(null)}
        item={editingItem}
        isNew={false}
      />

      <ItemEditModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        item={null}
        isNew={true}
      />

      <DataManagementModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />

      <DeadlineModal
        isOpen={isDeadlineModalOpen}
        onClose={() => setIsDeadlineModalOpen(false)}
      />

      {/* Frosted Toast Notifications */}
      <Toast />

    </div>
  );
};

export function App() {
  return (
    <GTMProvider>
      <DashboardContent />
    </GTMProvider>
  );
}

export default App;
