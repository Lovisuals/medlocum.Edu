'use client';

import { useState, useEffect } from 'react';
import LogTimeline from '@/components/learning-log/log-timeline';
import LogEntryForm from '@/components/learning-log/log-entry-form';
import { Button } from '@/components/ui/button';

export default function LearningLogPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [stats, setStats] = useState({ total_mins: 0 });

  const fetchEntries = async () => {
    setLoading(true);
    const res = await fetch('/api/v1/learning-log');
    const data = await res.json();
    setEntries(data.entries);
    setStats({ total_mins: data.total_mins });
    setLoading(false);
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id: string) => {
    await fetch(`/api/v1/learning-log/${id}`, { method: 'DELETE' });
    fetchEntries();
  };

  const totalHours = (stats.total_mins / 60).toFixed(1);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-heading">Learning Log</h1>
          <p className="text-sm text-muted">A comprehensive record of your professional development and CPD hours.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Add Manual Entry'}
        </Button>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-6">
        <div className="card text-center p-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">CPD Hours (YTD)</p>
          <p className="mt-1 text-3xl font-extrabold text-primary">{totalHours}</p>
          <p className="text-[10px] text-gray-500 mt-1">Target: 35.0h</p>
        </div>
        <div className="card text-center p-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Modules Completed</p>
          <p className="mt-1 text-3xl font-extrabold text-green-500">{entries.filter(e => e.entryType === 'automatic').length}</p>
          <p className="text-[10px] text-gray-500 mt-1">In-platform training</p>
        </div>
        <div className="card text-center p-6">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Manual Entries</p>
          <p className="mt-1 text-3xl font-extrabold text-amber-500">{entries.filter(e => e.entryType === 'manual').length}</p>
          <p className="text-[10px] text-gray-500 mt-1">External training</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-500">Activity Timeline</h2>
            <div className="flex gap-2">
              <select className="bg-transparent text-xs font-bold text-primary border-none outline-none cursor-pointer">
                <option>This Month</option>
                <option>Last Month</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
          {loading ? (
            <div className="text-center py-12 text-muted">Loading timeline…</div>
          ) : (
            <LogTimeline entries={entries} onDelete={handleDelete} />
          )}
        </div>

        <div>
          {showForm ? (
            <div className="card p-6 border-primary/20 bg-primary-light/30">
              <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-primary">New Manual Entry</h2>
              <LogEntryForm onSuccess={() => { setShowForm(false); fetchEntries(); }} />
            </div>
          ) : (
            <div className="card p-6 bg-surface-subtle border-none">
              <h2 className="mb-2 text-sm font-bold text-gray-900">Export CPD Record</h2>
              <p className="mb-4 text-xs text-gray-500 leading-relaxed">
                Download a PDF summary of your learning log for appraisal or professional registration.
              </p>
              <Button variant="secondary" className="w-full text-xs py-2">Download PDF Summary</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
