import React, { useState, useEffect } from 'react';
import { useGTM } from '../../context/GTMContext';
import { DeliverableItem, Milestone, PriorityLevel } from '../../types/gtm';
import { 
  X, 
  Trash2, 
  Calendar, 
  Layers, 
  User, 
  Flame
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  item: DeliverableItem | null;
  isNew?: boolean;
}

export const ItemEditModal: React.FC<Props> = ({ isOpen, onClose, item, isNew = false }) => {
  const { 
    streams, 
    owners, 
    updateDeliverable, 
    addDeliverable, 
    deleteDeliverable 
  } = useGTM();

  const [formData, setFormData] = useState<DeliverableItem>({
    id: '',
    stream: 'Branding & Marketing',
    title: '',
    startDate: '20-Aug',
    endDate: '30-Sep',
    milestone1: { id: 'm1', name: '', targetDate: '27-Aug', status: 'upcoming', notes: '' },
    milestone2: { id: 'm2', name: '', targetDate: '15-Sep', status: 'upcoming', notes: '' },
    milestone3: { id: 'm3', name: '', targetDate: '30-Sep', status: 'upcoming', notes: '' },
    owner: 'Sai',
    priority: 'medium',
    progress: 0,
    notes: '',
    tags: []
  });

  const [customStream, setCustomStream] = useState('');
  const [customOwner, setCustomOwner] = useState('');

  useEffect(() => {
    if (item && !isNew) {
      setFormData(JSON.parse(JSON.stringify(item)));
    } else {
      setFormData({
        id: '',
        stream: streams[0] || 'Branding & Marketing',
        title: '',
        startDate: '20-Aug',
        endDate: '30-Sep',
        milestone1: { id: 'm1', name: 'Milestone 1 Deliverable', targetDate: '27-Aug', status: 'upcoming', notes: '' },
        milestone2: { id: 'm2', name: 'Milestone 2 Deliverable', targetDate: '15-Sep', status: 'upcoming', notes: '' },
        milestone3: { id: 'm3', name: 'Milestone 3 Deliverable', targetDate: '30-Sep', status: 'upcoming', notes: '' },
        owner: owners[0] || 'Sai',
        priority: 'medium',
        progress: 0,
        notes: '',
        tags: []
      });
    }
  }, [item, isNew, isOpen, streams, owners]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a deliverable title');
      return;
    }

    const finalStream = customStream.trim() || formData.stream;
    const finalOwner = customOwner.trim() || formData.owner;

    const dataToSave = {
      ...formData,
      stream: finalStream,
      owner: finalOwner
    };

    if (isNew) {
      addDeliverable(dataToSave);
    } else {
      updateDeliverable(dataToSave);
    }
    onClose();
  };

  const handleMilestoneChange = (
    key: 'milestone1' | 'milestone2' | 'milestone3',
    field: keyof Milestone,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value
      }
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl glass-modal rounded-2xl sm:rounded-3xl overflow-hidden my-auto animate-slide-up max-h-[90vh] flex flex-col border border-kaar-deepRed/20 shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 sm:py-4 border-b border-gray-100 bg-white/60 shrink-0">
          <div className="min-w-0 pr-2">
            <h3 className="text-xs sm:text-sm font-bold text-gray-900 truncate">
              {isNew ? 'New GTM Deliverable' : `Edit: ${formData.title}`}
            </h3>
            <p className="text-[10px] sm:text-[11px] text-gray-500 truncate">
              Configure parameters and milestone deliverables
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-kaar-deepRed hover:bg-kaar-deepRed/5 transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-3.5 sm:space-y-4 overflow-y-auto flex-1 bg-white/40">
          
          {/* Main Info */}
          <div className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                Deliverable Title *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. AI Consulting Services Pack, PR Campaign..."
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-2xl glass-input text-gray-900 placeholder-gray-400 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
              {/* Workstream */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Layers className="w-3 h-3 text-kaar-deepRed" />
                  Workstream
                </label>
                <select
                  value={formData.stream}
                  onChange={e => setFormData({ ...formData, stream: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl sm:rounded-2xl glass-input text-gray-900 focus:outline-none"
                >
                  {streams.map(s => (
                    <option key={s} value={s} className="bg-white text-gray-900">{s}</option>
                  ))}
                  <option value="__custom" className="bg-white text-gray-900 font-semibold">+ Custom Workstream...</option>
                </select>
                {formData.stream === '__custom' && (
                  <input
                    type="text"
                    placeholder="New workstream name..."
                    value={customStream}
                    onChange={e => setCustomStream(e.target.value)}
                    className="mt-1.5 w-full px-3 py-1.5 text-xs rounded-xl glass-input text-gray-900"
                  />
                )}
              </div>

              {/* Owner */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <User className="w-3 h-3 text-kaar-orangeRed" />
                  Owner / Lead
                </label>
                <select
                  value={formData.owner}
                  onChange={e => setFormData({ ...formData, owner: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl sm:rounded-2xl glass-input text-gray-900 focus:outline-none"
                >
                  {owners.map(o => (
                    <option key={o} value={o} className="bg-white text-gray-900">{o}</option>
                  ))}
                  <option value="__custom" className="bg-white text-gray-900 font-semibold">+ Custom Owner...</option>
                </select>
                {formData.owner === '__custom' && (
                  <input
                    type="text"
                    placeholder="New owner name..."
                    value={customOwner}
                    onChange={e => setCustomOwner(e.target.value)}
                    className="mt-1.5 w-full px-3 py-1.5 text-xs rounded-xl glass-input text-gray-900"
                  />
                )}
              </div>
            </div>

            {/* Dates & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-kaar-deepRed" />
                  Start Date
                </label>
                <input
                  type="text"
                  placeholder="20-Aug"
                  value={formData.startDate}
                  onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl sm:rounded-2xl glass-input text-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-kaar-orangeRed" />
                  End Date
                </label>
                <input
                  type="text"
                  placeholder="30-Sep"
                  value={formData.endDate}
                  onChange={e => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl sm:rounded-2xl glass-input text-gray-900 font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-gray-700 mb-1 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-500" />
                  Priority
                </label>
                <select
                  value={formData.priority}
                  onChange={e => setFormData({ ...formData, priority: e.target.value as PriorityLevel })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl sm:rounded-2xl glass-input text-gray-900"
                >
                  <option value="high" className="bg-white text-rose-600 font-semibold">High Priority</option>
                  <option value="medium" className="bg-white text-amber-600 font-semibold">Medium Priority</option>
                  <option value="low" className="bg-white text-slate-600 font-semibold">Low Priority</option>
                </select>
              </div>
            </div>
          </div>

          {/* Milestones Sections */}
          <div className="space-y-2.5 sm:space-y-3 pt-2.5 sm:pt-3 border-t border-gray-200/80">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
              Milestones Setup
            </span>

            {/* M1 */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-kaar-deepRed/15 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-kaar-deepRed font-mono">Milestone 1</span>
                <select
                  value={formData.milestone1.status}
                  onChange={e => handleMilestoneChange('milestone1', 'status', e.target.value)}
                  className="px-2.5 py-0.5 text-xs rounded-full glass-input text-gray-900 font-medium"
                >
                  <option value="upcoming" className="bg-white text-gray-700">Upcoming</option>
                  <option value="in-progress" className="bg-white text-kaar-orangeRed">Active</option>
                  <option value="completed" className="bg-white text-emerald-600">Done</option>
                  <option value="delayed" className="bg-white text-rose-600">Delayed</option>
                  <option value="not-applicable" className="bg-white text-gray-400">N/A</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Milestone 1 title"
                    value={formData.milestone1.name}
                    onChange={e => handleMilestoneChange('milestone1', 'name', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl glass-input text-gray-900"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Target (27-Aug)"
                    value={formData.milestone1.targetDate}
                    onChange={e => handleMilestoneChange('milestone1', 'targetDate', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl glass-input text-gray-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* M2 */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-kaar-deepRed/15 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-kaar-deepRed font-mono">Milestone 2</span>
                <select
                  value={formData.milestone2.status}
                  onChange={e => handleMilestoneChange('milestone2', 'status', e.target.value)}
                  className="px-2.5 py-0.5 text-xs rounded-full glass-input text-gray-900 font-medium"
                >
                  <option value="upcoming" className="bg-white text-gray-700">Upcoming</option>
                  <option value="in-progress" className="bg-white text-kaar-orangeRed">Active</option>
                  <option value="completed" className="bg-white text-emerald-600">Done</option>
                  <option value="delayed" className="bg-white text-rose-600">Delayed</option>
                  <option value="not-applicable" className="bg-white text-gray-400">N/A</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Milestone 2 title (or N/A)"
                    value={formData.milestone2.name}
                    onChange={e => handleMilestoneChange('milestone2', 'name', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl glass-input text-gray-900"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Target (15-Sep or N/A)"
                    value={formData.milestone2.targetDate}
                    onChange={e => handleMilestoneChange('milestone2', 'targetDate', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl glass-input text-gray-900 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* M3 */}
            <div className="p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-white border border-kaar-deepRed/15 shadow-sm space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-kaar-deepRed font-mono">Milestone 3</span>
                <select
                  value={formData.milestone3.status}
                  onChange={e => handleMilestoneChange('milestone3', 'status', e.target.value)}
                  className="px-2.5 py-0.5 text-xs rounded-full glass-input text-gray-900 font-medium"
                >
                  <option value="upcoming" className="bg-white text-gray-700">Upcoming</option>
                  <option value="in-progress" className="bg-white text-kaar-orangeRed">Active</option>
                  <option value="completed" className="bg-white text-emerald-600">Done</option>
                  <option value="delayed" className="bg-white text-rose-600">Delayed</option>
                  <option value="not-applicable" className="bg-white text-gray-400">N/A</option>
                </select>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="sm:col-span-2">
                  <input
                    type="text"
                    placeholder="Milestone 3 title (or N/A)"
                    value={formData.milestone3.name}
                    onChange={e => handleMilestoneChange('milestone3', 'name', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl glass-input text-gray-900"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="Target (30-Sep or N/A)"
                    value={formData.milestone3.targetDate}
                    onChange={e => handleMilestoneChange('milestone3', 'targetDate', e.target.value)}
                    className="w-full px-3 py-1.5 text-xs rounded-xl glass-input text-gray-900 font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="pt-1.5">
            <label className="block text-[11px] font-semibold text-gray-700 mb-1">
              Context Notes
            </label>
            <textarea
              rows={2}
              placeholder="Strategic context..."
              value={formData.notes || ''}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3.5 py-2 text-xs rounded-xl sm:rounded-2xl glass-input text-gray-900 placeholder-gray-400 focus:outline-none"
            ></textarea>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 sticky bottom-0 bg-white/90 backdrop-blur-md -mx-4 sm:-mx-6 -mb-4 sm:-mb-6 px-4 sm:px-6 py-3">
            {!isNew ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this deliverable?')) {
                    deleteDeliverable(formData.id);
                    onClose();
                  }
                }}
                className="inline-flex items-center px-3 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-full transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1" />
                Delete
              </button>
            ) : <div />}

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 sm:px-4 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-900 glass-btn rounded-full transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 sm:px-5 py-1.5 text-xs font-semibold rounded-full glass-btn-primary"
              >
                {isNew ? 'Create Deliverable' : 'Save Changes'}
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
