import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { DeliverableItem, FilterState, MilestoneStatus, ViewMode } from '../types/gtm';
import { INITIAL_GTM_DATA, INITIAL_WORKSTREAMS, INITIAL_OWNERS } from '../data/initialData';
import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';

interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface GTMContextType {
  items: DeliverableItem[];
  filteredItems: DeliverableItem[];
  streams: string[];
  owners: string[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  
  // Deadline & Cycle Management
  deadline: string;
  setDeadline: (deadline: string) => void;
  cycleTitle: string;
  setCycleTitle: (title: string) => void;
  isDeadlineModalOpen: boolean;
  setIsDeadlineModalOpen: (open: boolean) => void;
  startNextTrackerCycle: (newDeadline: string, newCycleTitle: string, resetStatuses: boolean) => void;

  editingItem: DeliverableItem | null;
  setEditingItem: (item: DeliverableItem | null) => void;
  isAddModalOpen: boolean;
  setIsAddModalOpen: (open: boolean) => void;
  isDataModalOpen: boolean;
  setIsDataModalOpen: (open: boolean) => void;
  selectedItemId: string | null;
  setSelectedItemId: (id: string | null) => void;
  
  // Actions
  cycleMilestoneStatus: (itemId: string, milestoneKey: 'milestone1' | 'milestone2' | 'milestone3') => void;
  setMilestoneStatus: (itemId: string, milestoneKey: 'milestone1' | 'milestone2' | 'milestone3', status: MilestoneStatus) => void;
  updateDeliverable: (updatedItem: DeliverableItem) => void;
  addDeliverable: (item: Omit<DeliverableItem, 'id'>) => void;
  deleteDeliverable: (id: string) => void;
  duplicateDeliverable: (id: string) => void;
  resetToDefault: () => void;
  importData: (importedItems: DeliverableItem[]) => boolean;
  exportDataJSON: () => void;
  exportDataExcel: () => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  removeToast: (id: string) => void;
  
  // Stats
  stats: {
    totalItems: number;
    totalMilestones: number;
    completedMilestones: number;
    inProgressMilestones: number;
    delayedMilestones: number;
    overallProgress: number;
    workstreamProgress: Record<string, { total: number; completed: number; progress: number }>;
  };
}

const STORAGE_KEY = 'gtm_tracker_items_v3';
const THEME_KEY = 'gtm_tracker_theme';
const DEADLINE_KEY = 'gtm_tracker_deadline';
const CYCLE_KEY = 'gtm_tracker_cycle';

// Strict helper to calculate item progress: Completed Milestones / Total Valid Milestones
export const calculateItemProgress = (item: DeliverableItem): number => {
  const milestones = [item.milestone1, item.milestone2, item.milestone3].filter(
    m => m && m.status !== 'not-applicable' && m.name && m.name.trim() !== '' && m.name.trim() !== 'N/A'
  );
  if (milestones.length === 0) return 0;
  
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  return Math.round((completedCount / milestones.length) * 100);
};

const GTMContext = createContext<GTMContextType | undefined>(undefined);

export const GTMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<DeliverableItem[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: DeliverableItem[] = JSON.parse(stored);
        return parsed.map(item => ({
          ...item,
          progress: calculateItemProgress(item)
        }));
      }
    } catch (e) {
      console.error('Failed to parse stored GTM data', e);
    }
    return INITIAL_GTM_DATA.map(item => ({
      ...item,
      progress: calculateItemProgress(item)
    }));
  });

  const [deadline, setDeadlineState] = useState<string>(() => {
    return localStorage.getItem(DEADLINE_KEY) || '30-Sep';
  });

  const [cycleTitle, setCycleTitleState] = useState<string>(() => {
    return localStorage.getItem(CYCLE_KEY) || 'Q3 2026 Strategy';
  });

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const storedTheme = localStorage.getItem(THEME_KEY);
    return storedTheme === 'light' ? 'light' : 'dark';
  });

  const [viewMode, setViewMode] = useState<ViewMode>('matrix');
  const [editingItem, setEditingItem] = useState<DeliverableItem | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState<boolean>(false);
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState<boolean>(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    stream: 'all',
    owner: 'all',
    status: 'all',
    priority: 'all'
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save GTM data to localStorage', e);
    }
  }, [items]);

  const setDeadline = (newDeadline: string) => {
    setDeadlineState(newDeadline);
    localStorage.setItem(DEADLINE_KEY, newDeadline);
    showToast(`Deadline updated to "${newDeadline}"`, 'info');
  };

  const setCycleTitle = (newCycleTitle: string) => {
    setCycleTitleState(newCycleTitle);
    localStorage.setItem(CYCLE_KEY, newCycleTitle);
  };

  // Start next tracker cycle (reuse structure, update deadline, optionally reset statuses)
  const startNextTrackerCycle = (newDeadline: string, newCycleTitle: string, resetStatuses: boolean) => {
    setDeadlineState(newDeadline);
    localStorage.setItem(DEADLINE_KEY, newDeadline);
    setCycleTitleState(newCycleTitle);
    localStorage.setItem(CYCLE_KEY, newCycleTitle);

    if (resetStatuses) {
      setItems(prevItems =>
        prevItems.map(item => {
          const resetMilestone = (m: any) => {
            if (!m || m.status === 'not-applicable' || m.name === 'N/A') return m;
            return { ...m, status: 'upcoming' as MilestoneStatus };
          };

          const updated = {
            ...item,
            endDate: newDeadline,
            milestone1: resetMilestone(item.milestone1),
            milestone2: resetMilestone(item.milestone2),
            milestone3: resetMilestone(item.milestone3),
            progress: 0,
            updatedAt: new Date().toISOString()
          };
          updated.progress = calculateItemProgress(updated);
          return updated;
        })
      );
      showToast(`Started new cycle "${newCycleTitle}" with deadline ${newDeadline}! 🎉`, 'success');
    } else {
      showToast(`Updated tracker cycle to "${newCycleTitle}" (Deadline: ${newDeadline})`, 'success');
    }
    setIsDeadlineModalOpen(false);
  };

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
    localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#2997ff', '#30d158', '#ffd60a', '#bf5af2', '#ffffff']
      });
    } catch (e) {
      console.log('Confetti error', e);
    }
  };

  // Cycle Milestone Status: upcoming -> in-progress -> completed -> delayed -> not-applicable -> upcoming
  const cycleMilestoneStatus = (itemId: string, milestoneKey: 'milestone1' | 'milestone2' | 'milestone3') => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id !== itemId) return item;

        const currentStatus = item[milestoneKey]?.status || 'upcoming';
        let nextStatus: MilestoneStatus = 'in-progress';

        if (currentStatus === 'upcoming') nextStatus = 'in-progress';
        else if (currentStatus === 'in-progress') nextStatus = 'completed';
        else if (currentStatus === 'completed') nextStatus = 'delayed';
        else if (currentStatus === 'delayed') nextStatus = 'not-applicable';
        else if (currentStatus === 'not-applicable') nextStatus = 'upcoming';

        if (nextStatus === 'completed') {
          triggerConfetti();
          showToast(`Milestone marked Completed for "${item.title}"! 🎉`, 'success');
        }

        const updatedMilestone = {
          ...item[milestoneKey],
          status: nextStatus
        };

        const newItem = {
          ...item,
          [milestoneKey]: updatedMilestone,
          updatedAt: new Date().toISOString()
        };

        newItem.progress = calculateItemProgress(newItem);
        return newItem;
      })
    );
  };

  const setMilestoneStatus = (itemId: string, milestoneKey: 'milestone1' | 'milestone2' | 'milestone3', status: MilestoneStatus) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id !== itemId) return item;

        if (status === 'completed' && item[milestoneKey]?.status !== 'completed') {
          triggerConfetti();
          showToast(`Milestone marked Completed for "${item.title}"! 🎉`, 'success');
        }

        const updatedMilestone = {
          ...item[milestoneKey],
          status
        };

        const newItem = {
          ...item,
          [milestoneKey]: updatedMilestone,
          updatedAt: new Date().toISOString()
        };

        newItem.progress = calculateItemProgress(newItem);
        return newItem;
      })
    );
  };

  const updateDeliverable = (updatedItem: DeliverableItem) => {
    const itemWithProgress = {
      ...updatedItem,
      progress: calculateItemProgress(updatedItem),
      updatedAt: new Date().toISOString()
    };
    setItems(prev => prev.map(item => (item.id === updatedItem.id ? itemWithProgress : item)));
    showToast(`Updated "${updatedItem.title}" successfully`, 'success');
    setEditingItem(null);
  };

  const addDeliverable = (newItem: Omit<DeliverableItem, 'id'>) => {
    const id = 'custom-' + Date.now();
    const itemToAdd: DeliverableItem = {
      ...newItem,
      id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: 0
    };
    itemToAdd.progress = calculateItemProgress(itemToAdd);
    setItems(prev => [itemToAdd, ...prev]);
    showToast(`Added new deliverable "${newItem.title}"`, 'success');
    setIsAddModalOpen(false);
  };

  const deleteDeliverable = (id: string) => {
    const target = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));
    showToast(`Deleted "${target?.title || 'Deliverable'}"`, 'info');
    if (editingItem?.id === id) setEditingItem(null);
  };

  const duplicateDeliverable = (id: string) => {
    const target = items.find(i => i.id === id);
    if (!target) return;
    const duplicated: DeliverableItem = {
      ...JSON.parse(JSON.stringify(target)),
      id: 'copy-' + Date.now(),
      title: `${target.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    duplicated.progress = calculateItemProgress(duplicated);
    setItems(prev => [duplicated, ...prev]);
    showToast(`Duplicated "${target.title}"`, 'info');
  };

  const resetToDefault = () => {
    const fresh = INITIAL_GTM_DATA.map(item => ({
      ...item,
      progress: calculateItemProgress(item)
    }));
    setItems(fresh);
    setDeadlineState('30-Sep');
    setCycleTitleState('Q3 2026 Strategy');
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(DEADLINE_KEY);
    localStorage.removeItem(CYCLE_KEY);
    showToast('Dashboard reset to baseline GTM strategy data', 'info');
    setIsDataModalOpen(false);
  };

  const importData = (importedItems: DeliverableItem[]): boolean => {
    if (!Array.isArray(importedItems) || importedItems.length === 0) {
      showToast('Invalid data format. Please upload valid GTM JSON.', 'error');
      return false;
    }
    const withProg = importedItems.map(item => ({
      ...item,
      progress: calculateItemProgress(item)
    }));
    setItems(withProg);
    showToast(`Successfully imported ${importedItems.length} deliverables!`, 'success');
    setIsDataModalOpen(false);
    return true;
  };

  const exportDataJSON = () => {
    const exportPayload = {
      deadline,
      cycleTitle,
      exportedAt: new Date().toISOString(),
      items
    };
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportPayload, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GTM_Strategy_Tracker_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Exported GTM strategy dataset as JSON', 'success');
  };

  const exportDataExcel = () => {
    const rows = items.map(item => ({
      'Line Items': item.stream,
      'Sub-Items': item.title,
      'Start Date': item.startDate,
      'End Date': item.endDate,
      'Milestone-1 (Target)': item.milestone1?.targetDate || 'N/A',
      'Milestone-1 (Deliverable)': item.milestone1?.name || '',
      'Milestone-1 (Status)': item.milestone1?.status || 'N/A',
      'Milestone-2 (Target)': item.milestone2?.targetDate || 'N/A',
      'Milestone-2 (Deliverable)': item.milestone2?.name || '',
      'Milestone-2 (Status)': item.milestone2?.status || 'N/A',
      'Milestone-3 (Target)': item.milestone3?.targetDate || 'N/A',
      'Milestone-3 (Deliverable)': item.milestone3?.name || '',
      'Milestone-3 (Status)': item.milestone3?.status || 'N/A',
      'Overall Progress %': `${item.progress}%`,
      'Owners': item.owner,
      'Priority': item.priority,
      'Notes': item.notes || ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "GTM Tracker");
    XLSX.writeFile(workbook, `GTM_Strategy_Matrix_${new Date().toISOString().slice(0, 10)}.xlsx`);
    showToast('Exported GTM Strategy Matrix as Excel (.xlsx)', 'success');
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      stream: 'all',
      owner: 'all',
      status: 'all',
      priority: 'all'
    });
  };

  // Distinct streams and owners
  const streams = useMemo(() => {
    const sSet = new Set(INITIAL_WORKSTREAMS);
    items.forEach(i => sSet.add(i.stream));
    return Array.from(sSet);
  }, [items]);

  const owners = useMemo(() => {
    const oSet = new Set(INITIAL_OWNERS);
    items.forEach(i => {
      if (i.owner) oSet.add(i.owner);
    });
    return Array.from(oSet);
  }, [items]);

  // Filtered items
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesStream = item.stream.toLowerCase().includes(q);
        const matchesOwner = item.owner.toLowerCase().includes(q);
        const matchesM1 = item.milestone1?.name?.toLowerCase().includes(q);
        const matchesM2 = item.milestone2?.name?.toLowerCase().includes(q);
        const matchesM3 = item.milestone3?.name?.toLowerCase().includes(q);
        const matchesNotes = item.notes?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesStream && !matchesOwner && !matchesM1 && !matchesM2 && !matchesM3 && !matchesNotes) {
          return false;
        }
      }

      if (filters.stream !== 'all' && item.stream !== filters.stream) {
        return false;
      }

      if (filters.owner !== 'all' && item.owner !== filters.owner) {
        return false;
      }

      if (filters.priority !== 'all' && item.priority !== filters.priority) {
        return false;
      }

      if (filters.status !== 'all') {
        const milestones = [item.milestone1, item.milestone2, item.milestone3].filter(
          m => m && m.status !== 'not-applicable' && m.name && m.name !== 'N/A'
        );
        if (filters.status === 'completed' && item.progress < 100) return false;
        if (filters.status === 'in-progress' && (item.progress === 0 || item.progress === 100)) return false;
        if (filters.status === 'not-started' && item.progress > 0) return false;
        if (filters.status === 'delayed' && !milestones.some(m => m.status === 'delayed')) return false;
      }

      return true;
    });
  }, [items, filters]);

  // Calculate strict accurate stats based on completed milestones
  const stats = useMemo(() => {
    let totalMilestones = 0;
    let completedMilestones = 0;
    let inProgressMilestones = 0;
    let delayedMilestones = 0;

    const streamMap: Record<string, { total: number; completed: number; progress: number }> = {};

    items.forEach(item => {
      if (!streamMap[item.stream]) {
        streamMap[item.stream] = { total: 0, completed: 0, progress: 0 };
      }

      [item.milestone1, item.milestone2, item.milestone3].forEach(m => {
        if (m && m.status !== 'not-applicable' && m.name && m.name.trim() !== '' && m.name.trim() !== 'N/A') {
          totalMilestones += 1;
          streamMap[item.stream].total += 1;

          if (m.status === 'completed') {
            completedMilestones += 1;
            streamMap[item.stream].completed += 1;
          } else if (m.status === 'in-progress') {
            inProgressMilestones += 1;
          } else if (m.status === 'delayed') {
            delayedMilestones += 1;
          }
        }
      });
    });

    // Workstream progress percentage: (completed in stream / total in stream) * 100
    Object.keys(streamMap).forEach(st => {
      const stTotal = streamMap[st].total;
      const stCompleted = streamMap[st].completed;
      streamMap[st].progress = stTotal > 0 ? Math.round((stCompleted / stTotal) * 100) : 0;
    });

    // Overall GTM Readiness: (completedMilestones / totalMilestones) * 100
    const overallProgress = totalMilestones > 0
      ? Math.round((completedMilestones / totalMilestones) * 100)
      : 0;

    return {
      totalItems: items.length,
      totalMilestones,
      completedMilestones,
      inProgressMilestones,
      delayedMilestones,
      overallProgress,
      workstreamProgress: streamMap
    };
  }, [items]);

  return (
    <GTMContext.Provider
      value={{
        items,
        filteredItems,
        streams,
        owners,
        filters,
        setFilters,
        resetFilters,
        viewMode,
        setViewMode,
        theme,
        toggleTheme,
        deadline,
        setDeadline,
        cycleTitle,
        setCycleTitle,
        isDeadlineModalOpen,
        setIsDeadlineModalOpen,
        startNextTrackerCycle,
        editingItem,
        setEditingItem,
        isAddModalOpen,
        setIsAddModalOpen,
        isDataModalOpen,
        setIsDataModalOpen,
        selectedItemId,
        setSelectedItemId,
        cycleMilestoneStatus,
        setMilestoneStatus,
        updateDeliverable,
        addDeliverable,
        deleteDeliverable,
        duplicateDeliverable,
        resetToDefault,
        importData,
        exportDataJSON,
        exportDataExcel,
        toasts,
        showToast,
        removeToast,
        stats
      }}
    >
      {children}
    </GTMContext.Provider>
  );
};

export const useGTM = () => {
  const context = useContext(GTMContext);
  if (!context) {
    throw new Error('useGTM must be used within a GTMProvider');
  }
  return context;
};
