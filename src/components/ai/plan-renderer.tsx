'use client';

interface LearningPlanData {
  planTitle: string;
  goal: string;
  rationale: string;
  estimatedWeeks: number;
  recommendedCourses: Array<{
    title: string;
    category: string;
    reason: string;
    weekNumber: number;
  }>;
  externalResources: Array<{
    title: string;
    url: string;
    type: string;
    reason: string;
    weekNumber: number;
  }>;
  milestones: Array<{
    week: number;
    focus: string;
    actions: string[];
  }>;
}

interface PlanRendererProps {
  plan: LearningPlanData;
}

export default function PlanRenderer({ plan }: PlanRendererProps) {
  return (
    <div className="card space-y-6 bg-white p-6">
      <div className="border-b border-gray-100 pb-4">
        <h2 className="text-xl font-bold text-primary">{plan.planTitle}</h2>
        <p className="mt-2 text-sm font-medium text-gray-700">Goal: {plan.goal}</p>
        <p className="mt-1 text-xs text-gray-500 italic">{plan.rationale}</p>
      </div>

      <div>
        <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900">Milestones</h3>
        <div className="space-y-4">
          {plan.milestones.map((m, i) => (
            <div key={i} className="flex gap-4">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                W{m.week}
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{m.focus}</p>
                <ul className="mt-1 list-inside list-disc space-y-1 text-xs text-gray-600">
                  {m.actions.map((a, j) => <li key={j}>{a}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {plan.recommendedCourses.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900">Recommended Courses</h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {plan.recommendedCourses.map((c, i) => (
              <div key={i} className="rounded-lg border border-gray-100 p-3 shadow-sm">
                <p className="text-xs font-bold text-primary">{c.title}</p>
                <p className="text-[10px] text-gray-400">{c.category} · Week {c.weekNumber}</p>
                <p className="mt-1 text-[11px] text-gray-600 leading-relaxed">{c.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {plan.externalResources.length > 0 && (
        <div>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-gray-900">External Resources</h3>
          <div className="space-y-2">
            {plan.externalResources.map((r, i) => (
              <a key={i} href={r.url} target="_blank" rel="noopener noreferrer" className="block rounded-lg bg-surface-subtle p-3 hover:bg-gray-100">
                <p className="text-xs font-bold text-gray-900">{r.title}</p>
                <p className="text-[10px] text-gray-500 uppercase">{r.type} · Week {r.weekNumber}</p>
                <p className="mt-1 text-[11px] text-gray-600">{r.reason}</p>
              </a>
            ))}
          </div>
        </div>
      )}

      <p className="border-t border-gray-100 pt-4 text-[10px] text-gray-400 text-center">
        This plan is AI-generated. Please verify course availability with your L&D coordinator.
      </p>
    </div>
  );
}
