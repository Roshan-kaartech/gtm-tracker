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
import { SupabaseConnectModal } from './components/modals/SupabaseConnectModal';
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
    isSupabaseModalOpen,
    setIsSupabaseModalOpen,
    deadline,
    cycleTitle
  } = useGTM();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#111827] flex flex-col font-sans kaar-mesh-bg relative overflow-x-hidden">
      
      {/* KaarTech Ambient Red & Orange-Red Soft Glowing Spotlights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Top-Center KaarTech Deep Red Spotlight */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-b from-[#9E1B1E]/[0.09] via-[#DE3A1E]/[0.05] to-transparent rounded-full blur-[90px] animate-pulse-subtle"></div>
        
        {/* Top-Right Soft Orange-Red Glow */}
        <div className="absolute top-20 right-[-100px] w-[500px] h-[500px] bg-[#DE3A1E]/[0.06] rounded-full blur-[110px]"></div>
        
        {/* Mid-Left Soft Deep Red Glow */}
        <div className="absolute top-[40%] left-[-150px] w-[600px] h-[600px] bg-[#9E1B1E]/[0.05] rounded-full blur-[120px]"></div>
        
        {/* Bottom-Center Warm Glow */}
        <div className="absolute bottom-[-100px] left-1/3 w-[650px] h-[450px] bg-[#DE3A1E]/[0.04] rounded-full blur-[130px]"></div>
      </div>

      {/* KaarTech Glass Header */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 space-y-4 relative z-10">
        
        {/* Glass Bento Summary */}
        <KPISummary />

        {/* Glass Filter and Search Bar */}
        <FilterBar />

        {/* Dynamic KaarTech View */}
        <section className="transition-all duration-300">
          {viewMode === 'matrix' && <MatrixView />}
          {viewMode === 'gantt' && <GanttView />}
          {viewMode === 'kanban' && <KanbanView />}
          {viewMode === 'milestones' && <MilestonesView />}
          {viewMode === 'team' && <TeamView />}
          {viewMode === 'analytics' && <AnalyticsView />}
        </section>

      </main>

      {/* KaarTech Executive Footer */}
      <footer className="mt-12 border-t border-[#9E1B1E]/10 py-6 bg-white/80 backdrop-blur-2xl relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#4b5563]">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#9E1B1E] shadow-[0_0_8px_#9E1B1E]"></span>
            <span className="font-semibold text-black">KaarTech</span>
            <span>•</span>
            <span>{cycleTitle} Executive Tracker</span>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsDeadlineModalOpen(true)}
              className="flex items-center text-[#4b5563] hover:text-[#9E1B1E] transition-colors cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 mr-1 text-[#DE3A1E]" />
              Target Deadline: <strong className="text-black ml-1 font-mono">{deadline}</strong>
            </button>
            <button
              onClick={scrollToTop}
              className="p-1.5 rounded-full glass-btn text-[#4b5563] hover:text-[#9E1B1E] transition-colors"
              title="Scroll to top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </footer>

      {/* Modals & Overlays */}
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

      <SupabaseConnectModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      {/* Toast Notifications */}
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
