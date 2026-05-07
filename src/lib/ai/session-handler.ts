import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic();

export type AssistantMode =
  | 'coaching_companion'
  | 'personal_change_coach'
  | 'workplace_skills_tutor'
  | 'quiz_facilitator'
  | 'learning_plan_generator'
  | 'information_assistant'
  | 'dashboard_assistant';

export interface LMSUserContext {
  userId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  department: string;
  overdueCourses: string[];
  enrolledCourses: Array<{ title: string; status: string; progressPct: number }>;
  completedCourses: string[];
  objectives: string[];
  difficultyProfile: Record<string, 'easy' | 'medium' | 'hard'>;
  catalogueSummary?: string;
  mandatoryComplete?: number;
  overdueCourseCount?: number;
  cpdHoursThisYear?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export function detectMode(message: string, explicit?: string): AssistantMode {
  if (explicit) return explicit as AssistantMode;
  const m = message.toLowerCase();
  if (m.includes('coaching companion') || m.includes('coach me')) return 'coaching_companion';
  if (m.includes('change coach') || m.includes('behaviour') || m.includes('behavior')) return 'personal_change_coach';
  if (m.includes('people skills') || m.includes('tutor') || m.includes('communication')) return 'workplace_skills_tutor';
  if (m.includes('learning plan') || m.includes('my goal is') || m.includes('i want to learn')) return 'learning_plan_generator';
  if (m.includes('quiz') || m.includes('assessment') || m.includes('test')) return 'quiz_facilitator';
  if (m.includes('am i ready for placement') || m.includes('placement ready')) return 'dashboard_assistant';
  if (m.includes('how do i') || m.includes('where') || m.includes('help')) return 'information_assistant';
  return 'coaching_companion';
}

export function buildSystemPrompt(mode: AssistantMode, ctx: LMSUserContext): string {
  const base = `Platform: MedLocum Academy | academy.medlocumjobs.com
Learner: ${ctx.firstName} ${ctx.lastName} | ${ctx.jobTitle} | ${ctx.department}
Overdue courses: ${ctx.overdueCourses.join(', ') || 'None'}
Objectives: ${ctx.objectives.join(', ') || 'None'}
M.E.D.I.C values: Mastery · Empathy · Diligence · Integrity · Confidence
Today: ${new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`;

  const modePrompts: Record<AssistantMode, string> = {
    coaching_companion: `${base}

You are the Coaching Companion for MedLocum Academy. Use GROW model. One question per turn. Guide through reflection. Apply M.E.D.I.C values. Never give unsolicited advice. As a locum professional, your learning is central to your placement readiness and your patients' safety.
Open with: "Hi ${ctx.firstName}! Welcome to MedLocum Academy. As a locum professional, your learning is central to your placement readiness and your patients' safety. What would you like to focus on today — compliance, clinical skills, or something on your mind?"`,

    personal_change_coach: `${base}

You are the Personal Change Coach for MedLocum Academy. Use Motivational Interviewing. Explore, Scale, Barriers, Strengths, Plan, Courses, Commit. Never lecture. Ask permission before advice. Roll with resistance.
Open with: "Welcome, ${ctx.firstName}. MedLocum Academy is your space to develop as a locum professional. What specific skill or behaviour brought you here today?"`,

    workplace_skills_tutor: `${base}
Difficulty profile: ${JSON.stringify(ctx.difficultyProfile)}

You are the Workplace People Skills Tutor for MedLocum Academy. Teach via scenarios. Loop: Hook, Concept, Check, Respond, Scenario, Debrief, Link. Adapt difficulty based on answers. Context: UK healthcare locum environment.`,

    quiz_facilitator: `${base}

You are the quiz facilitator for MedLocum Academy. One question at a time. Never reveal answers early. Track score. Give feedback with clinical context. Be encouraging throughout. Adapt tone to difficulty level.`,

    learning_plan_generator: `${base}
Catalogue: ${ctx.catalogueSummary || 'See catalogue API'}

You are the Learning Plan AI for MedLocum Academy. Output a JSON plan. Match courses from catalogue. Include mandatory compliance modules if incomplete. Assume 2–4 hours per week available. Fill gaps with external resources. Be precise. Include at least one mandatory compliance module if any are incomplete, and at least one clinical skills module relevant to the learner's speciality.`,

    information_assistant: `${base}

You are the MedLocum Academy help desk. Answer navigation and platform questions precisely. Use the platform map. Be brief. Always point to exact menu item or action. Support email: academy@medlocumjobs.com`,

    dashboard_assistant: `${base}
Mandatory compliance: ${ctx.mandatoryComplete ?? 0} of 12 complete
Overdue: ${ctx.overdueCourseCount ?? 0}
CPD hours this year: ${ctx.cpdHoursThisYear ?? 0}
Completed: ${ctx.completedCourses.join(', ')}
Enrolled: ${ctx.enrolledCourses.map(c => `${c.title}(${c.status}/${c.progressPct}%)`).join(', ')}

You are presenting the personalised dashboard for MedLocum Academy. Greet by time of day. Show placement readiness status. Highlight overdue items first. If asked "am I ready for placement?", output a Placement Readiness Report with READY or NOT READY status.`
  };

  return modePrompts[mode];
}

export async function chat(
  history: Message[],
  newMessage: string,
  ctx: LMSUserContext,
  mode?: AssistantMode
): Promise<{ reply: string; detectedMode: AssistantMode }> {
  const activeMode = mode || detectMode(newMessage);
  const systemPrompt = buildSystemPrompt(activeMode, ctx);

  const response = await client.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1024,
    system: systemPrompt,
    messages: [...history, { role: 'user', content: newMessage }]
  });

  const reply = response.content
    .filter(b => b.type === 'text')
    .map(b => b.text)
    .join('');

  return { reply, detectedMode: activeMode };
}

export function summariseSession(messages: Message[]): string {
  const recent = messages.slice(-20);
  const summary = recent.map(m => `${m.role}: ${m.content.substring(0, 200)}`).join('\n');
  return `Session summary (previous context):\n${summary}\n--- Continue above session ---`;
}
