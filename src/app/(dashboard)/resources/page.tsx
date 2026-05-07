'use client';

import { useState, useEffect } from 'react';
import ResourceAccordion from '@/components/resources/resource-accordion';

export default function ResourcesPage() {
  const [resources, setResources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/v1/resources')
      .then(res => res.json())
      .then(data => setResources(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = resources.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase()) || 
    r.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-heading">Resource Library</h1>
        <p className="text-sm text-muted">Access clinical guidelines, policy documents, and training materials.</p>
      </div>

      <div className="mb-8 max-w-md">
        <input 
          type="search" 
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Filter resources…"
          className="input-field"
        />
      </div>

      {loading ? (
        <div className="py-12 text-center text-muted">Loading library…</div>
      ) : filtered.length === 0 ? (
        <div className="card py-12 text-center">
          <p className="text-gray-400">No resources found matching your search.</p>
        </div>
      ) : (
        <div className="max-w-3xl">
          <ResourceAccordion resources={filtered} />
        </div>
      )}

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-5 bg-primary/5 border-primary/10">
          <h2 className="text-xs font-bold text-primary uppercase tracking-widest">Clinical Guidelines</h2>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed">
            Latest NICE guidelines and local trust protocols for locum staff.
          </p>
        </div>
        <div className="card p-5 bg-amber-50 border-amber-100">
          <h2 className="text-xs font-bold text-amber-600 uppercase tracking-widest">Platform Support</h2>
          <p className="mt-2 text-xs text-gray-600 leading-relaxed">
            User guides and video walkthroughs for MedLocum Academy.
          </p>
        </div>
      </div>
    </div>
  );
}
