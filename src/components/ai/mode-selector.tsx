'use client';

import { AssistantMode } from '@/lib/ai/session-handler';

interface ModeSelectorProps {
  currentMode: AssistantMode;
  onModeChange: (mode: AssistantMode) => void;
}

const MODES: { id: AssistantMode; label: string; icon: string }[] = [
  { id: 'coaching_companion', label: 'Coaching', icon: '🧭' },
  { id: 'personal_change_coach', label: 'Change', icon: '🌱' },
  { id: 'workplace_skills_tutor', label: 'Tutor', icon: '👥' },
  { id: 'learning_plan_generator', label: 'Planner', icon: '📅' },
  { id: 'information_assistant', label: 'Help', icon: '❓' },
];

export default function ModeSelector({ currentMode, onModeChange }: ModeSelectorProps) {
  return (
    <div className="tab-container mb-4">
      {MODES.map(mode => (
        <button
          key={mode.id}
          onClick={() => onModeChange(mode.id)}
          className={`tab-item ${currentMode === mode.id ? 'active' : ''}`}
        >
          <span className="mr-2">{mode.icon}</span>
          {mode.label}
        </button>
      ))}
    </div>
  );
}
