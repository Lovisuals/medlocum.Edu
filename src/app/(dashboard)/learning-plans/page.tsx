'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import PlanRenderer from '@/components/ai/plan-renderer';

export default function LearningPlansPage() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [goal, setGoal] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetch('/api/v1/learning-plans')
      .then(res => res.json())
      .then(data => setPlans(data))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    setCreating(true);
    try {
      const res = await fetch('/api/v1/learning-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal })
      });
      const newPlan = await res.json();
      setPlans(prev => [newPlan, ...prev]);
      setGoal('');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-heading">Learning Plans</h1>
        <p className="text-sm text-muted">Generate personalised pathways to achieve your professional goals.</p>
      </div>

      <div className="card mb-8">
        <form onSubmit={handleCreate}>
          <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-gray-500">
            What is your next career goal?
          </label>
          <div className="flex gap-4">
            <input
              type="text"
              value={goal}
              onChange={e => setGoal(e.target.value)}
              placeholder="e.g. Become a Senior Locum Nurse or Master Sepsis Management"
              className="input-field flex-1"
            />
            <Button type="submit" disabled={creating}>
              {creating ? 'Generating…' : 'Generate Plan'}
            </Button>
          </div>
          <p className="mt-2 text-[10px] text-gray-400">
            AI will analyze your profile and the course catalogue to create a structured plan.
          </p>
        </form>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-12 text-muted">Loading plans…</div>
        ) : plans.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-400">You haven't generated any learning plans yet.</p>
          </div>
        ) : (
          plans.map(plan => (
            <div key={plan.id} className="card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">{plan.title}</h3>
                  <p className="text-xs text-muted">Created on {new Date(plan.createdAt).toLocaleDateString()}</p>
                </div>
                <Badge variant={plan.status === 'active' ? 'info' : 'default'}>{plan.status}</Badge>
              </div>
              {plan.aiOutput && (
                <div className="mt-4">
                  <PlanRenderer plan={plan.aiOutput} />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
