import React, { useState } from 'react';
import { Edit2, Trash2, Plus, Search } from 'lucide-react';
import { COMPANY_CONFIG, TYPE_ICONS, STATUS_STYLES } from './Dashboard';

const COMPANIES = ['All', 'Blindspace', 'GrantsBlinds', 'Fablereads'];
const TYPES     = ['All', 'Newsletter', 'Webpage', 'Automation', 'CRM', 'AI Integration', 'Processes', 'Analytics & Tracking'];
const STATUSES  = ['All', 'For Review', 'On Hold', 'Content Needed', 'For Testing', 'Active', 'Designing Phase', 'Completed', 'In-Progress', 'For Development'];

function StatusBadge({ status }) {
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[status] || STATUS_STYLES['Draft']}`}>
      {status}
    </span>
  );
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function WeeklyLog({
  entries, onEdit, onDelete, onAdd,
  filterCompany, setFilterCompany,
  filterType, setFilterType,
}) {
  const [search, setSearch]           = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [sortField, setSortField]     = useState('createdAt');
  const [sortDir, setSortDir]         = useState('desc');

  const filtered = entries
    .filter(e => {
      if (filterCompany !== 'All' && e.company !== filterCompany) return false;
      if (filterType    !== 'All' && e.type    !== filterType)    return false;
      if (filterStatus  !== 'All' && e.status  !== filterStatus)  return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          e.title.toLowerCase().includes(q) ||
          (e.description || '').toLowerCase().includes(q) ||
          e.company.toLowerCase().includes(q)
        );
      }
      return true;
    })
    .sort((a, b) => {
      const av = a[sortField] || '', bv = b[sortField] || '';
      const cmp = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDir === 'asc' ? cmp : -cmp;
    });

  const handleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('asc'); }
  };

  const clearFilters = () => {
    setFilterCompany('All');
    setFilterType('All');
    setFilterStatus('All');
    setSearch('');
  };

  const hasFilters = filterCompany !== 'All' || filterType !== 'All' || filterStatus !== 'All' || search;

  const SortTh = ({ label, field }) => (
    <th
      onClick={() => handleSort(field)}
      className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-gray-700 select-none whitespace-nowrap"
    >
      {label}
      {sortField === field && <span className="ml-1">{sortDir === 'asc' ? '↑' : '↓'}</span>}
    </th>
  );

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Weekly Log</h2>
          <p className="text-gray-500 text-sm mt-1">{filtered.length} of {entries.length} entries</p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
        >
          <Plus size={15} />
          Add Entry
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white w-44"
          />
        </div>

        {[
          { val: filterCompany, set: setFilterCompany, opts: COMPANIES, label: 'Company' },
          { val: filterType,    set: setFilterType,    opts: TYPES,     label: 'Type' },
          { val: filterStatus,  set: setFilterStatus,  opts: STATUSES,  label: 'Status' },
        ].map(({ val, set, opts, label }) => (
          <select
            key={label}
            value={val}
            onChange={e => set(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          >
            {opts.map(o => <option key={o} value={o}>{o === 'All' ? `All ${label}s` : o}</option>)}
          </select>
        ))}

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg bg-white"
          >
            Clear
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <SortTh label="Title"   field="title" />
                <SortTh label="Company" field="company" />
                <SortTh label="Type"    field="type" />
                <SortTh label="Status"  field="status" />
                <SortTh label="Week"    field="weekStart" />
                <SortTh label="Created" field="createdAt" />
                <th className="px-4 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">
                    No entries found.{' '}
                    {hasFilters ? (
                      <button onClick={clearFilters} className="text-indigo-600 hover:underline">Clear filters</button>
                    ) : (
                      <button onClick={onAdd} className="text-indigo-600 hover:underline">Add your first entry</button>
                    )}
                  </td>
                </tr>
              ) : (
                filtered.map(entry => {
                  const cfg  = COMPANY_CONFIG[entry.company] || {};
                  const Icon = TYPE_ICONS[entry.type] || (() => null);
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-4 py-3.5">
                        <p className="text-sm font-medium text-gray-900">{entry.title}</p>
                        {entry.description && (
                          <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs">{entry.description}</p>
                        )}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.badge}`}>
                          {entry.company}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600">
                          <Icon size={13} className="text-gray-400" />
                          {entry.type}
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={entry.status} />
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-500 whitespace-nowrap">
                        {formatDate(entry.weekStart)}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-gray-400 whitespace-nowrap">
                        {formatDate(entry.createdAt)}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                          <button
                            onClick={() => onEdit(entry)}
                            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit2 size={13} />
                          </button>
                          <button
                            onClick={() => onDelete(entry.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
