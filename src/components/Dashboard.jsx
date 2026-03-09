import React from 'react';
import { Plus, Mail, Database, Settings, ChevronRight, TrendingUp } from 'lucide-react';

export const COMPANY_CONFIG = {
  Blindspace:   { dot: 'bg-blue-400',    badge: 'bg-blue-50 text-blue-700',    card: 'from-blue-50 to-blue-100/60',   border: 'border-blue-200' },
  GrantsBlinds: { dot: 'bg-emerald-400', badge: 'bg-emerald-50 text-emerald-700', card: 'from-emerald-50 to-emerald-100/60', border: 'border-emerald-200' },
  Fablereads:   { dot: 'bg-purple-400',  badge: 'bg-purple-50 text-purple-700', card: 'from-purple-50 to-purple-100/60', border: 'border-purple-200' },
};

export const TYPE_ICONS = {
  'Newsletter':          Mail,
  'CRM Update':          Database,
  'Website Automation':  Settings,
};

export const STATUS_STYLES = {
  'Draft':          'bg-gray-100 text-gray-600',
  'In Progress':    'bg-amber-50 text-amber-700',
  'Completed':      'bg-blue-50 text-blue-700',
  'Sent/Published': 'bg-emerald-50 text-emerald-700',
};

function getThisWeekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function formatWeek(date) {
  return new Date(date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[status] || STATUS_STYLES['Draft']}`}>
      {status}
    </span>
  );
}

export default function Dashboard({ entries, onAddEntry, onViewAll }) {
  const weekStart = getThisWeekStart();
  const thisWeek = entries.filter(e => new Date(e.weekStart) >= weekStart);

  const companies = ['Blindspace', 'GrantsBlinds', 'Fablereads'];
  const types = ['Newsletter', 'CRM Update', 'Website Automation'];

  const recentEntries = [...entries]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
          <p className="text-gray-500 text-sm mt-1">Week of {formatWeek(weekStart)}</p>
        </div>
        <button
          onClick={onAddEntry}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={15} />
          Add Entry
        </button>
      </div>

      {/* Company Cards */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {companies.map(company => {
          const cfg = COMPANY_CONFIG[company];
          const total = entries.filter(e => e.company === company).length;
          const week  = thisWeek.filter(e => e.company === company).length;
          return (
            <div key={company} className={`bg-gradient-to-br ${cfg.card} border ${cfg.border} rounded-xl p-5`}>
              <div className="flex items-center gap-2 mb-4">
                <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                <span className="font-semibold text-gray-800 text-sm">{company}</span>
              </div>
              <div className="flex items-end gap-4">
                <div>
                  <p className="text-3xl font-bold text-gray-900">{week}</p>
                  <p className="text-xs text-gray-500 mt-0.5">this week</p>
                </div>
                <div className="mb-1">
                  <p className="text-xl font-semibold text-gray-400">{total}</p>
                  <p className="text-xs text-gray-400">all time</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Type Breakdown */}
      <div className="grid grid-cols-3 gap-5 mb-6">
        {types.map(type => {
          const Icon = TYPE_ICONS[type];
          const total = entries.filter(e => e.type === type).length;
          const week  = thisWeek.filter(e => e.type === type).length;
          return (
            <div key={type} className="bg-white border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
                  <Icon size={15} className="text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">{type}</span>
              </div>
              <p className="text-3xl font-bold text-gray-900">{week}</p>
              <p className="text-xs text-gray-400 mt-1">{total} total entries</p>
            </div>
          );
        })}
      </div>

      {/* Recent Entries */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900 text-sm">Recent Entries</h3>
          <button
            onClick={onViewAll}
            className="text-indigo-600 text-xs hover:underline flex items-center gap-1"
          >
            View all <ChevronRight size={12} />
          </button>
        </div>
        <div>
          {recentEntries.length === 0 ? (
            <div className="py-12 text-center text-gray-400 text-sm">
              No entries yet. Click <span className="font-medium">Add Entry</span> to get started!
            </div>
          ) : (
            recentEntries.map(entry => {
              const cfg = COMPANY_CONFIG[entry.company] || {};
              const Icon = TYPE_ICONS[entry.type] || Mail;
              return (
                <div key={entry.id} className="flex items-center gap-4 px-6 py-3.5 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                  <div className={`w-8 h-8 rounded-lg ${cfg.badge} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={13} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{entry.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{entry.type}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>
                      {entry.company}
                    </span>
                    <StatusBadge status={entry.status} />
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
