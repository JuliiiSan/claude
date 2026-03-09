import React from 'react';
import { LayoutDashboard, List, Plus } from 'lucide-react';

const COMPANY_DOTS = [
  { name: 'Blindspace', color: 'bg-blue-400' },
  { name: 'GrantsBlinds', color: 'bg-emerald-400' },
  { name: 'Fablereads', color: 'bg-purple-400' },
];

export default function Sidebar({ view, setView, onAddEntry, entries }) {
  const thisWeekCount = entries.filter(e => {
    const entryWeek = new Date(e.weekStart);
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(now);
    weekStart.setDate(diff);
    weekStart.setHours(0, 0, 0, 0);
    return entryWeek >= weekStart;
  }).length;

  return (
    <aside className="w-60 bg-gray-900 text-white flex flex-col h-full flex-shrink-0">
      {/* Logo / Brand */}
      <div className="px-5 py-6 border-b border-gray-800">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">W</div>
          <h1 className="text-base font-bold text-white">Weekly Tracker</h1>
        </div>
        <p className="text-xs text-gray-500 pl-9">Content & Automation Log</p>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        <button
          onClick={() => setView('dashboard')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            view === 'dashboard'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <LayoutDashboard size={16} />
          Dashboard
        </button>
        <button
          onClick={() => setView('log')}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            view === 'log'
              ? 'bg-indigo-600 text-white'
              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
          }`}
        >
          <List size={16} />
          Weekly Log
          {entries.length > 0 && (
            <span className="ml-auto text-xs bg-gray-700 text-gray-300 px-1.5 py-0.5 rounded-full">
              {entries.length}
            </span>
          )}
        </button>
      </nav>

      {/* Companies */}
      <div className="px-5 py-4 border-t border-gray-800">
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-600 mb-3">Companies</p>
        <div className="space-y-2.5">
          {COMPANY_DOTS.map(({ name, color }) => {
            const count = entries.filter(e => e.company === name).length;
            return (
              <div key={name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-gray-400 text-xs">{name}</span>
                </div>
                <span className="text-xs text-gray-600">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* This Week Badge */}
      <div className="px-5 pb-2">
        <div className="bg-gray-800 rounded-lg px-3 py-2 flex justify-between items-center">
          <span className="text-xs text-gray-500">This week</span>
          <span className="text-sm font-semibold text-white">{thisWeekCount} entries</span>
        </div>
      </div>

      {/* Add Button */}
      <div className="px-3 py-4 border-t border-gray-800">
        <button
          onClick={onAddEntry}
          className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Plus size={15} />
          Add Entry
        </button>
      </div>
    </aside>
  );
}
