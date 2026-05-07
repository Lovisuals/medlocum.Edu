'use client';

import { useState, useEffect } from 'react';
import ObjectiveCard from '@/components/objectives/objective-card';
import { Button } from '@/components/ui/button';
import { Tabs } from '@/components/ui/tabs';

export default function ObjectivesPage() {
  const [objectives, setObjectives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('current');
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');

  const fetchObjectives = async () => {
    setLoading(true);
    const res = await fetch(`/api/v1/objectives?status=${activeTab}`);
    const data = await res.json();
    setObjectives(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchObjectives();
  }, [activeTab]);

  const handleStatusChange = async (id: string, status: string) => {
    await fetch(`/api/v1/objectives/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    fetchObjectives();
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await fetch('/api/v1/objectives', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle, target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] })
    });
    setNewTitle('');
    setShowForm(false);
    fetchObjectives();
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-heading">Professional Objectives</h1>
          <p className="text-sm text-muted">Track and achieve your career milestones with AI coaching support.</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ New Objective'}
        </Button>
      </div>

      <div className="mb-8">
        <Tabs 
          activeTab={activeTab} 
          onChange={setActiveTab} 
          tabs={[
            { id: 'current', label: 'Current' },
            { id: 'achieved', label: 'Achieved' },
            { id: 'deferred', label: 'Deferred' }
          ]} 
        />
      </div>

      {showForm && (
        <div className="card mb-8 p-6 border-primary/20 bg-primary-light/20">
          <form onSubmit={handleCreate} className="flex gap-4">
            <input 
              type="text" 
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="What do you want to achieve?"
              className="input-field flex-1"
              autoFocus
            />
            <Button type="submit">Create Objective</Button>
          </form>
          <p className="mt-2 text-[10px] text-gray-400">Target date will be set to 30 days from now by default.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-muted">Loading objectives…</div>
        ) : objectives.length === 0 ? (
          <div className="col-span-full card py-12 text-center">
            <p className="text-gray-400">No {activeTab} objectives found.</p>
          </div>
        ) : (
          objectives.map(obj => (
            <ObjectiveCard key={obj.id} objective={obj} onStatusChange={handleStatusChange} />
          ))
        )}
      </div>

      <div className="mt-12 card bg-surface-subtle border-none">
        <div className="flex gap-6 items-center">
          <div className="text-4xl">🧭</div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Need help defining your objectives?</h2>
            <p className="text-xs text-gray-500 mt-1">
              Start a session with our Coaching Companion to identify your strengths and areas for growth.
            </p>
            <Button variant="secondary" className="mt-3 text-[10px] py-1.5 px-4">Talk to Coach</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
