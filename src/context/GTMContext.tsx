import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { DeliverableItem, FilterState, MilestoneStatus, ViewMode } from '../types/gtm';
import { INITIAL_GTM_DATA, INITIAL_WORKSTREAMS, INITIAL_OWNERS } from '../data/initialData';
import confetti from 'canvas-confetti';
import * as XLSX from 'xlsx';
import {
  getSupabaseClient,
  isSupabaseConfigured,
  fetchCloudDeliverables,
  fetchCloudSettings,
  upsertCloudDeliverable,
  deleteCloudDeliverable,
  updateCloudSettings,
  seedCloudDeliverables,
  formatRowToDeliverable
} from '../lib/supabase';
import { calculateItemProgress } from '../lib/gtmUtils';

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
  
  // Cloud & Supabase State
  isCloudConnected: boolean;
  isSupabaseModalOpen: boolean;
  setIsSupabaseModalOpen: (open: boolean) => void;
  reconnectCloud: () => Promise<void>;

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

const GTMContext = createContext<GTMContextType | undefined>(undefined);

export const GTMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local state initialized from localStorage
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

  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  const [isCloudConnected, setIsCloudConnected] = useState<boolean>(false);
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState<boolean>(false);

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

  const showToast = useCallback((message: string, type: 'success' | 'info' | 'warning' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to local storage as continuous fallback
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save GTM data to localStorage', e);
    }
  }, [items]);

  const [syncVersion, setSyncVersion] = useState<number>(0);

  // Initial Data Sync & Realtime Subscription
  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setIsCloudConnected(false);
      return;
    }

    const client = getSupabaseClient();
    if (!client) {
      setIsCloudConnected(false);
      return;
    }

    let isMounted = true;

    // 1. Initial Data Fetch
    const fetchInitialData = async () => {
      try {
        const [settings, cloudItems] = await Promise.all([
          fetchCloudSettings(),
          fetchCloudDeliverables()
        ]);

        if (!isMounted) return;

        if (settings?.deadline) {
          setDeadlineState(settings.deadline);
          localStorage.setItem(DEADLINE_KEY, settings.deadline);
        }
        if (settings?.cycleTitle) {
          setCycleTitleState(settings.cycleTitle);
          localStorage.setItem(CYCLE_KEY, settings.cycleTitle);
        }

        if (cloudItems !== null) {
          if (cloudItems.length > 0) {
            const withProgress = cloudItems.map(item => ({
              ...item,
              progress: calculateItemProgress(item)
            }));
            setItems(withProgress);
          } else {
            // If remote database is completely empty, seed with baseline data
            await seedCloudDeliverables(INITIAL_GTM_DATA);
          }
          setIsCloudConnected(true);
        }
      } catch (err) {
        console.warn('Initial Supabase fetch error:', err);
      }
    };

    fetchInitialData();

    // 2. Setup Realtime Channel
    const channelName = `gtm-realtime-${Date.now()}`;
    const channel = client
      .channel(channelName)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gtm_deliverables' },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            const newItem = formatRowToDeliverable(payload.new);
            newItem.progress = calculateItemProgress(newItem);
            setItems(prev => {
              if (prev.some(i => i.id === newItem.id)) {
                return prev.map(i => (i.id === newItem.id ? newItem : i));
              }
              return [newItem, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const updated = formatRowToDeliverable(payload.new);
            updated.progress = calculateItemProgress(updated);
            setItems(prev => prev.map(i => (i.id === updated.id ? updated : i)));
          } else if (payload.eventType === 'DELETE') {
            const oldId = payload.old?.id;
            if (oldId) {
              setItems(prev => prev.filter(i => i.id !== oldId));
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'gtm_settings' },
        (payload) => {
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            const row = payload.new;
            if (row.key === 'tracker_deadline') {
              setDeadlineState(row.value);
              localStorage.setItem(DEADLINE_KEY, row.value);
            }
            if (row.key === 'tracker_cycle') {
              setCycleTitleState(row.value);
              localStorage.setItem(CYCLE_KEY, row.value);
            }
          }
        }
      )
      .subscribe((status) => {
        if (!isMounted) return;
        if (status === 'SUBSCRIBED') {
          setIsCloudConnected(true);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setIsCloudConnected(false);
        }
      });

    return () => {
      isMounted = false;
      client.removeChannel(channel);
    };
  }, [syncVersion]);

  const reconnectCloud = async () => {
    setSyncVersion(v => v + 1);
  };

  const setDeadline = (newDeadline: string) => {
    setDeadlineState(newDeadline);
    localStorage.setItem(DEADLINE_KEY, newDeadline);
    if (isCloudConnected) {
      updateCloudSettings(newDeadline);
    }
    showToast(`Deadline updated to "${newDeadline}"`, 'info');
  };

  const setCycleTitle = (newCycleTitle: string) => {
    setCycleTitleState(newCycleTitle);
    localStorage.setItem(CYCLE_KEY, newCycleTitle);
    if (isCloudConnected) {
      updateCloudSettings(undefined, newCycleTitle);
    }
  };

  // Start next tracker cycle (reuse structure, update deadline, optionally reset statuses)
  const startNextTrackerCycle = (newDeadline: string, newCycleTitle: string, resetStatuses: boolean) => {
    setDeadlineState(newDeadline);
    localStorage.setItem(DEADLINE_KEY, newDeadline);
    setCycleTitleState(newCycleTitle);
    localStorage.setItem(CYCLE_KEY, newCycleTitle);

    if (isCloudConnected) {
      updateCloudSettings(newDeadline, newCycleTitle);
    }

    if (resetStatuses) {
      const resetItems = items.map(item => {
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
        if (isCloudConnected) {
          upsertCloudDeliverable(updated);
        }
        return updated;
      });

      setItems(resetItems);
      showToast(`Started new cycle "${newCycleTitle}" with deadline ${newDeadline}! 🎉`, 'success');
    } else {
      showToast(`Updated tracker cycle to "${newCycleTitle}" (Deadline: ${newDeadline})`, 'success');
    }
    setIsDeadlineModalOpen(false);
  };

  // Sync theme
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('light');
    root.classList.remove('dark');
    localStorage.setItem(THEME_KEY, 'light');
  }, [theme]);

  const toggleTheme = () => {
    setTheme('light');
  };

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#9E1B1E', '#DE3A1E', '#10b981', '#3b82f6', '#000000']
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
        
        // Push update to Supabase in background
        if (isCloudConnected) {
          upsertCloudDeliverable(newItem);
        }

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

        if (isCloudConnected) {
          upsertCloudDeliverable(newItem);
        }

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
    
    if (isCloudConnected) {
      upsertCloudDeliverable(itemWithProgress);
    }

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

    if (isCloudConnected) {
      upsertCloudDeliverable(itemToAdd);
    }

    showToast(`Added new deliverable "${newItem.title}"`, 'success');
    setIsAddModalOpen(false);
  };

  const deleteDeliverable = (id: string) => {
    const target = items.find(i => i.id === id);
    setItems(prev => prev.filter(i => i.id !== id));

    if (isCloudConnected) {
      deleteCloudDeliverable(id);
    }

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

    if (isCloudConnected) {
      upsertCloudDeliverable(duplicated);
    }

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

    if (isCloudConnected) {
      seedCloudDeliverables(fresh);
      updateCloudSettings('30-Sep', 'Q3 2026 Strategy');
    }

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

    if (isCloudConnected) {
      seedCloudDeliverables(withProg);
    }

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
        isCloudConnected,
        isSupabaseModalOpen,
        setIsSupabaseModalOpen,
        reconnectCloud,
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
