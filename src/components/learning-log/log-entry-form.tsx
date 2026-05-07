'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

interface LogEntryFormProps {
  onSuccess: (entry: any) => void;
}

export default function LogEntryForm({ onSuccess }: LogEntryFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Clinical Skills',
    duration_mins: 60,
    learned_date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/v1/learning-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      onSuccess(data);
      setFormData({
        title: '',
        description: '',
        category: 'Clinical Skills',
        duration_mins: 60,
        learned_date: new Date().toISOString().split('T')[0]
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-xs font-bold text-gray-500 uppercase">Training Title</label>
        <input 
          required
          type="text" 
          value={formData.title}
          onChange={e => setFormData({...formData, title: e.target.value})}
          placeholder="e.g. BLS Practical Session"
          className="input-field"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-500 uppercase">Date</label>
          <input 
            required
            type="date" 
            value={formData.learned_date}
            onChange={e => setFormData({...formData, learned_date: e.target.value})}
            className="input-field"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-bold text-gray-500 uppercase">Duration (Mins)</label>
          <input 
            required
            type="number" 
            value={formData.duration_mins}
            onChange={e => setFormData({...formData, duration_mins: parseInt(e.target.value)})}
            className="input-field"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold text-gray-500 uppercase">Category</label>
        <select 
          value={formData.category}
          onChange={e => setFormData({...formData, category: e.target.value})}
          className="input-field"
        >
          <option>Clinical Skills</option>
          <option>Mandatory Compliance</option>
          <option>Leadership & Management</option>
          <option>Professional Ethics</option>
          <option>Patient Safety</option>
        </select>
      </div>
      <div>
        <label className="mb-1 block text-xs font-bold text-gray-500 uppercase">Reflection / Notes</label>
        <textarea 
          value={formData.description}
          onChange={e => setFormData({...formData, description: e.target.value})}
          placeholder="What did you learn? How will it improve your practice?"
          className="input-field min-h-[100px] py-3 rounded-xl"
        />
      </div>
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Adding…' : 'Add Entry to Log'}
      </Button>
    </form>
  );
}
