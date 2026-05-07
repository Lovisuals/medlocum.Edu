'use client';

import { useState } from 'react';

interface Resource {
  id: string;
  title: string;
  fileUrl: string;
  fileType: string;
  category: string;
  categoryColor: string;
}

interface ResourceAccordionProps {
  resources: Resource[];
}

export default function ResourceAccordion({ resources }: ResourceAccordionProps) {
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(resources.map(r => r.category)));

  return (
    <div className="space-y-3">
      {categories.map((cat) => {
        const catResources = resources.filter(r => r.category === cat);
        const isOpen = openCategory === cat;

        return (
          <div key={cat} className="overflow-hidden rounded-xl border border-gray-100 shadow-sm">
            <button
              onClick={() => setOpenCategory(isOpen ? null : cat)}
              className="flex w-full items-center justify-between bg-white p-4 text-left transition-colors hover:bg-surface-subtle"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="h-2 w-2 rounded-full" 
                  style={{ background: catResources[0]?.categoryColor || 'var(--color-primary)' }} 
                />
                <span className="text-sm font-bold text-gray-900">{cat}</span>
                <span className="text-[10px] font-medium text-gray-400">({catResources.length})</span>
              </div>
              <span className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            
            {isOpen && (
              <div className="bg-surface-subtle/30 px-4 py-2">
                <div className="divide-y divide-gray-100">
                  {catResources.map((res) => (
                    <a
                      key={res.id}
                      href={res.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between py-3 hover:translate-x-1 transition-transform"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">
                          {res.fileType === 'pdf' ? '📄' : res.fileType === 'video' ? '🎬' : '📁'}
                        </span>
                        <span className="text-xs font-medium text-gray-700">{res.title}</span>
                      </div>
                      <span className="text-[10px] font-bold text-primary uppercase">Download</span>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
