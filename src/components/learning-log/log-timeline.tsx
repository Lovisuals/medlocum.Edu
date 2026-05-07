'use client';

interface LogEntry {
  id: string;
  title: string;
  description: string;
  category: string;
  durationMins: number;
  learnedDate: string;
  entryType: string;
}

interface LogTimelineProps {
  entries: LogEntry[];
  onDelete: (id: string) => void;
}

export default function LogTimeline({ entries, onDelete }: LogTimelineProps) {
  if (entries.length === 0) return (
    <div className="py-12 text-center text-gray-400 italic">No entries for this period.</div>
  );

  return (
    <div className="space-y-4">
      {entries.map((entry) => (
        <div key={entry.id} className="card flex items-start justify-between gap-4 p-4">
          <div className="flex gap-4">
            <div className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-subtle text-lg">
              {entry.entryType === 'manual' ? '✍️' : '🎓'}
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900">{entry.title}</h3>
              <p className="mt-1 text-xs text-gray-500">{entry.category} · {entry.durationMins} mins · {new Date(entry.learnedDate).toLocaleDateString()}</p>
              {entry.description && <p className="mt-2 text-xs text-gray-600 leading-relaxed">{entry.description}</p>}
            </div>
          </div>
          <button 
            onClick={() => onDelete(entry.id)}
            className="text-gray-300 hover:text-red-500 transition-colors p-1"
            title="Delete entry"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
