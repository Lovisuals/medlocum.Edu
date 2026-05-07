import os
import json
import psycopg2
from datetime import datetime, timedelta

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://lms:password@localhost:5432/medlocum_lms")

def check_cooldowns():
    """
    Worker to check for users who are blocked by cooldowns and notify if now available.
    """
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    # Simple logic: Find last failed attempt and see if cooldown passed
    cur.execute("""
        SELECT qa.user_id, qa.quiz_id, u.email, qz.title
        FROM quiz_attempts qa
        JOIN users u ON u.id = qa.user_id
        JOIN quizzes qz ON qz.id = qa.quiz_id
        WHERE qa.passed = FALSE 
        AND qa.completed_at > NOW() - INTERVAL '25 hours'
        AND qa.completed_at < NOW() - INTERVAL '24 hours'
    """)
    
    ready_users = cur.fetchall()
    for user_id, quiz_id, email, title in ready_users:
        print(f"[WORKER] User {email} is now ready to re-attempt {title}")
        # In a real app, send a push or email notification here
        
    cur.close()
    conn.close()

if __name__ == "__main__":
    print("[WORKER] Quiz Engine Python Worker Started")
    check_cooldowns()
