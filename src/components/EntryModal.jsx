import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const COMPANIES = ['Blindspace', 'GrantsBlinds', 'Fablereads'];
const TYPES     = ['Newsletter', 'CRM Update', 'Website Automation'];
const STATUSES  = ['Draft', 'In Progress', 'Completed', 'Sent/Published'];

function getThisMonday() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString().split('T')[0];
}

const DEFAULT_FORM = {
  company: 'Blindspace',
  type: 'Newsletter',
  title: '',
  description: '',
  status: 'Draft',
  weekStart: getThisMonday(),
};

export default function EntryModal({ entry, onSave, onClose }) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (entry) {
      setForm({
        company:     entry.company,
        type:        entry.type,
        title:       entry.title,
        description: entry.description || '',
        status:      entry.status,
        weekStart:   entry.weekStart
          ? new Date(entry.weekStart).toISOString().split('T')[0]
          : getThisMonday(),
      });
    } else {
      setForm(DEFAULT_FORM);
    }
    setErrors({});
  }, [entry]);

  const set = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave({ ...form, weekStart: new Date(form.weekStart + 'T00:00:00').toISOString() });
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="font-semibold text-gray-900">{entry ? 'Edit Entry' : 'New Entry'}</h3>
            <p className="text-xs text-gray-400 mt-0.5">Track your weekly work</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {/* Company + Type */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Company *</label>
              <select
                value={form.company}
                onChange={e => set('company', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {COMPANIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Type *</label>
              <select
                value={form.type}
                onChange={e => set('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g., March Newsletter #2"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                errors.title ? 'border-red-400 bg-red-50' : 'border-gray-200'
              }`}
            />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              placeholder="Brief notes about what was done..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {/* Status + Week */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status *</label>
              <select
                value={form.status}
                onChange={e => set('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Week Starting</label>
              <input
                type="date"
                value={form.weekStart}
                onChange={e => set('weekStart', e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              {entry ? 'Save Changes' : 'Add Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
