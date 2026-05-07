import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromCookies } from '@/lib/auth';
import { cacheGet, cacheSet } from '@/lib/cache';
import { db } from '@/lib/db';
import { getLatestPlacementReadiness } from '@/lib/services/ComplianceService';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionFromCookies();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const uid = session.sub as string;
    const cached = await cacheGet<any>(`dashboard:${uid}`);
    if (cached) return NextResponse.json(cached);

    const [dueSoon, assigned, recommended, completed, lastVisited, events, compliance] = await Promise.all([
      db.query(
        `SELECT c.id, c.title, c.thumbnail_url as "thumbnailUrl", c.duration_mins as "durationMins",
                cat.name as category, cat.color_hex as "categoryColor",
                e.progress_pct as "progressPct", e.status, a.due_date as "dueDate"
         FROM enrolments e
         JOIN courses c ON c.id = e.course_id
         JOIN categories cat ON cat.id = c.category_id
         LEFT JOIN user_course_assignments a ON a.course_id = c.id AND a.user_id = $1
         WHERE e.user_id = $1 AND e.status IN ('in_progress', 'overdue')
         ORDER BY a.due_date ASC NULLS LAST LIMIT 10`,
        [uid]
      ),
      db.query(
        `SELECT c.id, c.title, c.thumbnail_url as "thumbnailUrl", c.duration_mins as "durationMins",
                cat.name as category, cat.color_hex as "categoryColor", a.due_date as "dueDate"
         FROM user_course_assignments a
         JOIN courses c ON c.id = a.course_id
         JOIN categories cat ON cat.id = c.category_id
         WHERE a.user_id = $1 LIMIT 10`,
        [uid]
      ),
      db.query(
        `SELECT c.id, c.title, c.thumbnail_url as "thumbnailUrl", c.duration_mins as "durationMins",
                cat.name as category, cat.color_hex as "categoryColor"
         FROM courses c
         JOIN categories cat ON cat.id = c.category_id
         WHERE c.id NOT IN (SELECT course_id FROM enrolments WHERE user_id = $1)
         AND c.is_published = TRUE
         ORDER BY RANDOM() LIMIT 6`,
        [uid]
      ),
      db.query(
        `SELECT c.id, c.title, cat.name as category, e.completed_at as "completedAt", e.score
         FROM enrolments e
         JOIN courses c ON c.id = e.course_id
         JOIN categories cat ON cat.id = c.category_id
         WHERE e.user_id = $1 AND e.status = 'completed'
         ORDER BY e.completed_at DESC LIMIT 4`,
        [uid]
      ),
      db.query(
        `SELECT c.id, c.title FROM enrolments e
         JOIN courses c ON c.id = e.course_id
         WHERE e.user_id = $1 ORDER BY e.last_accessed DESC LIMIT 1`,
        [uid]
      ),
      db.query(
        `SELECT id, title, location, starts_at as "startsAt", ends_at as "endsAt"
         FROM events WHERE starts_at > NOW() ORDER BY starts_at LIMIT 5`
      ),
      getLatestPlacementReadiness(uid)
    ]);

    const h = new Date().getHours();
    const greeting = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';

    const data = {
      greeting,
      dueSoon: dueSoon.rows,
      assigned: assigned.rows,
      recommended: recommended.rows,
      recentlyCompleted: completed.rows,
      lastVisited: lastVisited.rows[0] || null,
      upcomingEvents: events.rows,
      compliance: compliance || {
        isReady: false,
        blockers: ['Compliance assessment pending.'],
        mandatoryComplete: 0,
        roleModulesComplete: 0
      }
    };

    await cacheSet(`dashboard:${uid}`, data, 300);
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
