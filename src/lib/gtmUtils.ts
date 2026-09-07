import type { DeliverableItem } from '../types/gtm';

/**
 * Strict helper to calculate item progress: Completed Milestones / Total Valid Milestones
 */
export const calculateItemProgress = (item: DeliverableItem): number => {
  const milestones = [item.milestone1, item.milestone2, item.milestone3].filter(
    m => m && m.status !== 'not-applicable' && m.name && m.name.trim() !== '' && m.name.trim() !== 'N/A'
  );
  if (milestones.length === 0) return 0;
  
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  return Math.round((completedCount / milestones.length) * 100);
};
