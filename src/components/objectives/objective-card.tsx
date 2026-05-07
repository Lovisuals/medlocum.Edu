'use client';

import { Badge } from '@/components/ui/badge';

interface Objective {
  id: string;
  title: string;
  description: string;
  status: string;
  targetDate: string;
}

interface ObjectiveCardProps {
  objective: Objective;
  onStatusChange: (id: string, newStatus: string) => void;
}

export default function ObjectiveCard({ objective, onStatusChange }: ObjectiveCardProps) {
  const isOverdue = new Date(objective.targetDate) < new Date() && objective.status === 'current';

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-sm font-bold text-gray-900">{objective.title}</h3>
            {isOverdue && <Badge variant="overdue">Overdue</Badge>}
            <Badge variant={objective.status === 'achieved' ? 'success' : 'info'}>
              {objective.status}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-gray-500">Target: {new Date(objective.targetDate).toLocaleDateString()}</p>
          <p className="mt-3 text-xs text-gray-600 leading-relaxed">{objective.description}</p>
        </div>
        <div className="flex flex-col gap-2">
          {objective.status === 'current' && (
            <button 
              onClick={() => onStatusChange(objective.id, 'achieved')}
              className="rounded-full bg-success-bg px-3 py-1 text-[10px] font-bold text-success hover:bg-green-100 transition-colors"
            >
              Mark Achieved
            </button>
          )}
          <button 
            className="rounded-full bg-surface-subtle px-3 py-1 text-[10px] font-bold text-gray-500 hover:bg-gray-200 transition-colors"
          >
            Coach AI
          </button>
        </div>
      </div>
    </div>
  );
}
