import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { DeliverableItem } from '../types/gtm';

const STORAGE_URL_KEY = 'gtm_supabase_url';
const STORAGE_KEY_KEY = 'gtm_supabase_anon_key';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
}

// Get active configuration (Priority: localStorage override -> import.meta.env)
export const getActiveSupabaseConfig = (): SupabaseConfig => {
  const localUrl = localStorage.getItem(STORAGE_URL_KEY);
  const localKey = localStorage.getItem(STORAGE_KEY_KEY);

  const envUrl = import.meta.env.VITE_SUPABASE_URL || '';
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

  return {
    url: (localUrl || envUrl).trim(),
    anonKey: (localKey || envKey).trim()
  };
};

export const isSupabaseConfigured = (): boolean => {
  const { url, anonKey } = getActiveSupabaseConfig();
  return Boolean(url && anonKey && url.startsWith('http'));
};

let clientInstance: SupabaseClient | null = null;
let currentClientKey = '';

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, anonKey } = getActiveSupabaseConfig();
  if (!url || !anonKey || !url.startsWith('http')) {
    clientInstance = null;
    currentClientKey = '';
    return null;
  }

  const keySignature = `${url}:${anonKey}`;
  if (!clientInstance || currentClientKey !== keySignature) {
    try {
      clientInstance = createClient(url, anonKey, {
        auth: { persistSession: false },
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
      currentClientKey = keySignature;
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      clientInstance = null;
    }
  }

  return clientInstance;
};

// Set custom credentials from the UI
export const setCustomSupabaseCredentials = (url: string, anonKey: string): void => {
  if (url && anonKey) {
    localStorage.setItem(STORAGE_URL_KEY, url.trim());
    localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  } else {
    localStorage.removeItem(STORAGE_URL_KEY);
    localStorage.removeItem(STORAGE_KEY_KEY);
  }
  clientInstance = null;
  currentClientKey = '';
};

export const clearCustomSupabaseCredentials = (): void => {
  localStorage.removeItem(STORAGE_URL_KEY);
  localStorage.removeItem(STORAGE_KEY_KEY);
  clientInstance = null;
  currentClientKey = '';
};

// Test Connection
export const testSupabaseConnection = async (): Promise<{ success: boolean; message: string; rowCount?: number }> => {
  const client = getSupabaseClient();
  if (!client) {
    return { success: false, message: 'Supabase URL or Anon Key is missing or invalid.' };
  }

  try {
    const { data, error, count } = await client
      .from('gtm_deliverables')
      .select('id', { count: 'exact', head: false })
      .limit(1);

    if (error) {
      if (error.code === 'PGRST116' || error.message.includes('relation "public.gtm_deliverables" does not exist')) {
        return {
          success: false,
          message: 'Connected to Supabase, but the "gtm_deliverables" table is missing. Run schema.sql in Supabase SQL editor.'
        };
      }
      return { success: false, message: `Database error: ${error.message}` };
    }

    return {
      success: true,
      message: 'Successfully connected to Supabase!',
      rowCount: count ?? (data ? data.length : 0)
    };
  } catch (err: any) {
    return { success: false, message: `Network error: ${err?.message || 'Failed to reach Supabase'}` };
  }
};

// Format Supabase row to DeliverableItem
export const formatRowToDeliverable = (row: any): DeliverableItem => {
  return {
    id: row.id,
    stream: row.stream,
    title: row.title,
    startDate: row.start_date || row.startDate || '20-Aug',
    endDate: row.end_date || row.endDate || '30-Sep',
    milestone1: row.milestone1 || { id: 'm1', name: '', targetDate: '27-Aug', status: 'upcoming', notes: '' },
    milestone2: row.milestone2 || { id: 'm2', name: '', targetDate: '15-Sep', status: 'upcoming', notes: '' },
    milestone3: row.milestone3 || { id: 'm3', name: '', targetDate: '30-Sep', status: 'upcoming', notes: '' },
    owner: row.owner || 'Sai',
    priority: row.priority || 'medium',
    progress: Number(row.progress) || 0,
    notes: row.notes || '',
    tags: Array.isArray(row.tags) ? row.tags : []
  };
};

// Format DeliverableItem to Supabase DB Row
export const formatDeliverableToRow = (item: DeliverableItem): any => {
  return {
    id: item.id,
    stream: item.stream,
    title: item.title,
    start_date: item.startDate,
    end_date: item.endDate,
    milestone1: item.milestone1,
    milestone2: item.milestone2,
    milestone3: item.milestone3,
    owner: item.owner,
    priority: item.priority,
    progress: item.progress,
    notes: item.notes || '',
    tags: item.tags || [],
    updated_at: new Date().toISOString()
  };
};

// Cloud CRUD Helpers
export const fetchCloudDeliverables = async (): Promise<DeliverableItem[] | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('gtm_deliverables')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.warn('Error fetching Supabase deliverables:', error);
      return null;
    }

    if (!data || data.length === 0) {
      return [];
    }

    return data.map(formatRowToDeliverable);
  } catch (e) {
    console.error('Network failure fetching deliverables from Supabase:', e);
    return null;
  }
};

export const fetchCloudSettings = async (): Promise<{ deadline?: string; cycleTitle?: string } | null> => {
  const client = getSupabaseClient();
  if (!client) return null;

  try {
    const { data, error } = await client.from('gtm_settings').select('*');
    if (error || !data) return null;

    const result: { deadline?: string; cycleTitle?: string } = {};
    for (const item of data) {
      if (item.key === 'tracker_deadline') result.deadline = item.value;
      if (item.key === 'tracker_cycle') result.cycleTitle = item.value;
    }
    return result;
  } catch (e) {
    return null;
  }
};

export const upsertCloudDeliverable = async (item: DeliverableItem): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const row = formatDeliverableToRow(item);
    const { error } = await client
      .from('gtm_deliverables')
      .upsert(row, { onConflict: 'id' });

    if (error) {
      console.error('Failed to upsert to Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase upsert network error:', e);
    return false;
  }
};

export const deleteCloudDeliverable = async (id: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const { error } = await client.from('gtm_deliverables').delete().eq('id', id);
    if (error) {
      console.error('Failed to delete from Supabase:', error);
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const updateCloudSettings = async (deadline?: string, cycleTitle?: string): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    if (deadline !== undefined) {
      await client.from('gtm_settings').upsert({
        key: 'tracker_deadline',
        value: deadline,
        updated_at: new Date().toISOString()
      });
    }
    if (cycleTitle !== undefined) {
      await client.from('gtm_settings').upsert({
        key: 'tracker_cycle',
        value: cycleTitle,
        updated_at: new Date().toISOString()
      });
    }
    return true;
  } catch (e) {
    return false;
  }
};

export const seedCloudDeliverables = async (items: DeliverableItem[]): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;

  try {
    const rows = items.map(formatDeliverableToRow);
    const { error } = await client
      .from('gtm_deliverables')
      .upsert(rows, { onConflict: 'id' });

    if (error) {
      console.error('Failed to seed Supabase deliverables:', error);
      return false;
    }
    return true;
  } catch (e) {
    console.error('Supabase bulk seed error:', e);
    return false;
  }
};
