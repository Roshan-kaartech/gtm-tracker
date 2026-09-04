export type MilestoneStatus = 'completed' | 'in-progress' | 'delayed' | 'upcoming' | 'not-applicable';

export type DeliverableStatus = 'not-started' | 'in-progress' | 'completed' | 'at-risk';

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface Milestone {
  id: string;
  name: string;
  targetDate: string; // e.g. "15-Aug" or "2026-08-15"
  status: MilestoneStatus;
  notes?: string;
  isCustom?: boolean;
}

export interface DeliverableItem {
  id: string;
  stream: string; // e.g. 'Branding & Marketing', 'GTM Solution', 'Sales Playbook', 'Sales Enablement', 'Webinar'
  title: string;
  startDate: string; // e.g. "20-Aug"
  endDate: string; // e.g. "30-Sep"
  milestone1: Milestone;
  milestone2: Milestone;
  milestone3: Milestone;
  owner: string;
  priority: PriorityLevel;
  progress: number; // 0 to 100
  tags?: string[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
}

export type ViewMode = 'matrix' | 'gantt' | 'kanban' | 'milestones' | 'team' | 'analytics';

export interface FilterState {
  search: string;
  stream: string;
  owner: string;
  status: string;
  priority: string;
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  itemTitle: string;
  details: string;
}
