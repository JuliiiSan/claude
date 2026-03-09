import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import WeeklyLog from './components/WeeklyLog';
import EntryModal from './components/EntryModal';

export const COMPANIES = ['Blindspace', 'GrantsBlinds', 'Fablereads'];
export const TYPES = ['Newsletter', 'CRM Update', 'Website Automation'];
export const STATUSES = ['Draft', 'In Progress', 'Completed', 'Sent/Published'];

const generateId = () => Math.random().toString(36).substr(2, 9) + Date.now().toString(36);

const getWeekStart = (date = new Date()) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
};

const SAMPLE_DATA = [
  {
    id: generateId(),
    company: 'Blindspace',
    type: 'Newsletter',
    title: 'March Weekly Newsletter #1',
    description: 'Product highlights, spring sale promotions, and new arrivals',
    status: 'Sent/Published',
    weekStart: getWeekStart(),
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    company: 'GrantsBlinds',
    type: 'CRM Update',
    title: 'Q1 Customer Segment Refresh',
    description: 'Updated customer tags, segments, and lead scoring',
    status: 'Completed',
    weekStart: getWeekStart(),
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    company: 'Fablereads',
    type: 'Website Automation',
    title: 'Email Capture Flow Automation',
    description: 'New automation for email capture on landing page with drip sequence',
    status: 'In Progress',
    weekStart: getWeekStart(),
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    company: 'Blindspace',
    type: 'CRM Update',
    title: 'Klaviyo Segment Update',
    description: 'Synced new product interest segments from Shopify',
    status: 'Completed',
    weekStart: getWeekStart(),
    createdAt: new Date().toISOString(),
  },
  {
    id: generateId(),
    company: 'GrantsBlinds',
    type: 'Website Automation',
    title: 'Abandoned Cart Flow Update',
    description: 'Updated timing and copy for abandoned cart email sequence',
    status: 'Sent/Published',
    weekStart: getWeekStart(),
    createdAt: new Date().toISOString(),
  },
];

export default function App() {
  const [view, setView] = useState('dashboard');
  const [entries, setEntries] = useState(() => {
    try {
      const saved = localStorage.getItem('weeklyTracker_v1');
      return saved ? JSON.parse(saved) : SAMPLE_DATA;
    } catch {
      return SAMPLE_DATA;
    }
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [filterCompany, setFilterCompany] = useState('All');
  const [filterType, setFilterType] = useState('All');

  useEffect(() => {
    localStorage.setItem('weeklyTracker_v1', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry) => {
    setEntries(prev => [
      { ...entry, id: generateId(), createdAt: new Date().toISOString() },
      ...prev,
    ]);
  };

  const updateEntry = (id, updated) => {
    setEntries(prev =>
      prev.map(e =>
        e.id === id
          ? { ...updated, id, createdAt: e.createdAt, updatedAt: new Date().toISOString() }
          : e
      )
    );
  };

  const deleteEntry = (id) => {
    if (window.confirm('Delete this entry?')) {
      setEntries(prev => prev.filter(e => e.id !== id));
    }
  };

  const openAddModal = (defaults = {}) => {
    setEditingEntry(null);
    setIsModalOpen(true);
  };

  const openEditModal = (entry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleSave = (entry) => {
    if (editingEntry) {
      updateEntry(editingEntry.id, entry);
    } else {
      addEntry(entry);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar view={view} setView={setView} onAddEntry={openAddModal} entries={entries} />
      <main className="flex-1 overflow-auto">
        {view === 'dashboard' && (
          <Dashboard
            entries={entries}
            onAddEntry={openAddModal}
            onViewAll={() => setView('log')}
          />
        )}
        {view === 'log' && (
          <WeeklyLog
            entries={entries}
            onEdit={openEditModal}
            onDelete={deleteEntry}
            onAdd={openAddModal}
            filterCompany={filterCompany}
            setFilterCompany={setFilterCompany}
            filterType={filterType}
            setFilterType={setFilterType}
          />
        )}
      </main>
      {isModalOpen && (
        <EntryModal
          entry={editingEntry}
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}
