import { db } from '@/lib/db';
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.REDIS_URL || '',
  token: process.env.REDIS_TOKEN || ''
});

async function processNotifications() {
  console.log('[WORKER] Checking for due notifications...');
  
  // 1. Overdue courses
  const overdue = await db.query(
    `SELECT u.email, u.first_name, c.title, a.due_date
     FROM enrolments e
     JOIN users u ON u.id = e.user_id
     JOIN courses c ON c.id = e.course_id
     JOIN user_course_assignments a ON a.user_id = u.id AND a.course_id = c.id
     WHERE e.status = 'overdue' AND a.due_date < NOW()`
  );

  for (const row of overdue.rows) {
    console.log(`[EMAIL] Sending reminder to ${row.email} for ${row.title}`);
    // nodemailer logic would go here
  }

  // 2. Expiring certifications (30 day warning)
  const expiring = await db.query(
    `SELECT u.email, u.first_name, c.title, e.completed_at
     FROM enrolments e
     JOIN users u ON u.id = e.user_id
     JOIN courses c ON c.id = e.course_id
     WHERE e.status = 'completed' AND e.completed_at < NOW() - INTERVAL '335 days'`
  );

  for (const row of expiring.rows) {
    console.log(`[EMAIL] Sending renewal warning to ${row.email} for ${row.title}`);
  }
}

// Simple loop for demonstration
if (require.main === module) {
  setInterval(processNotifications, 60000 * 60); // Every hour
}

export { processNotifications };
