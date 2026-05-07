'use client';

import { useState, useEffect } from 'react';

export default function WhosWhoPage() {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/experts')
      .then(res => res.json())
      .then(data => setExperts(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-heading">Who's Who</h1>
        <p className="text-sm text-muted">Connect with our subject matter experts and clinical leads.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-muted">Loading profiles…</div>
        ) : experts.length === 0 ? (
          <div className="col-span-full card py-12 text-center">
             <p className="text-gray-400">Our expert database is currently being updated. Please check back soon.</p>
          </div>
        ) : (
          experts.map(expert => (
            <div key={expert.id} className="card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="h-14 w-14 rounded-full bg-primary-light flex items-center justify-center text-xl font-bold text-primary">
                  {expert.firstName[0]}{expert.lastName[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">{expert.firstName} {expert.lastName}</h3>
                  <p className="text-[10px] font-medium text-gray-500 uppercase tracking-wider">{expert.jobTitle}</p>
                </div>
              </div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">Speciality: {expert.speciality}</p>
              <p className="text-xs text-gray-600 leading-relaxed line-clamp-4">{expert.bio}</p>
              <button className="mt-4 w-full rounded-full border border-primary px-4 py-2 text-[10px] font-bold text-primary hover:bg-primary-light transition-colors">
                Contact Expert
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-12 card bg-amber-50 border-none p-6 flex items-center gap-6">
        <div className="text-3xl">💡</div>
        <div>
          <h2 className="text-sm font-bold text-amber-900">Become an Expert</h2>
          <p className="text-xs text-amber-700 mt-1">
            Are you a specialist clinical lead? Share your knowledge with the MedLocum Academy community.
          </p>
          <button className="mt-3 text-[10px] font-bold text-amber-800 underline">Apply to become an SME</button>
        </div>
      </div>
    </div>
  );
}
