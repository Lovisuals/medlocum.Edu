'use client';

import { useState, useEffect } from 'react';

export default function NewsPage() {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Placeholder fetch until API is fully wired
    setLoading(false);
    setNews([
      {
        id: '1',
        title: 'MDCN Updates CME Requirements for 2026 License Renewal',
        excerpt: 'The Medical and Dental Council of Nigeria (MDCN) has announced revised credit hour requirements for clinical practitioners...',
        publishedAt: '2026-04-15',
        thumbnailUrl: '/news-1.jpg'
      },
      {
        id: '2',
        title: 'MedLocum Academy Launches AI Coaching for Residency Exams',
        excerpt: 'Our new AI-powered professional development tools now support preparation for Nigerian postgraduate medical exams...',
        publishedAt: '2026-04-10',
        thumbnailUrl: '/news-2.jpg'
      },
      {
        id: '3',
        title: 'FMoH Strategic Workforce Update: Spring 2026',
        excerpt: 'A summary of the latest workforce trends and placement opportunities across the Nigerian healthcare sector...',
        publishedAt: '2026-03-28',
        thumbnailUrl: '/news-3.jpg'
      }
    ]);
  }, []);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-heading">News & Updates</h1>
        <p className="text-sm text-muted">Stay informed about MedLocum Academy and the healthcare sector.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 text-center text-muted">Loading news…</div>
        ) : (
          news.map(article => (
            <div key={article.id} className="card overflow-hidden p-0">
              <div className="h-40 bg-surface-subtle flex items-center justify-center text-3xl">📰</div>
              <div className="p-5">
                <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2">
                  {new Date(article.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                </p>
                <h3 className="text-sm font-bold text-gray-900 leading-tight mb-3">{article.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed line-clamp-3 mb-4">{article.excerpt}</p>
                <button className="text-[10px] font-bold text-primary uppercase hover:underline">Read Article</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
