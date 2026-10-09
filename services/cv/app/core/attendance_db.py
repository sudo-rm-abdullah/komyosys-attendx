from pathlib import Path
import sqlite3
from datetime import datetime, timezone
from contextlib import contextmanager

PROJECT_ROOT = Path(__file__).resolve().parents[4]
DATA_DIR = PROJECT_ROOT / "data" / "attendance"
DB_PATH = DATA_DIR / "attendx.db"


@contextmanager
def connect():
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(DB_PATH, timeout=10)
    connection.row_factory = sqlite3.Row
    connection.execute("PRAGMA foreign_keys = ON")

    try:
        yield connection
        connection.commit()
    except Exception:
        connection.rollback()
        raise
    finally:
        connection.close()


def initialize_database():
    with connect() as connection:
        connection.executescript("""
            CREATE TABLE IF NOT EXISTS employees (
                employee_id TEXT PRIMARY KEY,
                full_name TEXT NOT NULL,
                designation TEXT NOT NULL DEFAULT '',
                active INTEGER NOT NULL DEFAULT 1
                    CHECK (active IN (0, 1)),
                created_at TEXT NOT NULL
            );

            CREATE TABLE IF NOT EXISTS attendance_events (
                event_id INTEGER PRIMARY KEY AUTOINCREMENT,
                employee_id TEXT NOT NULL,
                event_type TEXT NOT NULL
                    CHECK (event_type IN ('check_in', 'check_out')),
                event_time TEXT NOT NULL,
                source TEXT NOT NULL DEFAULT 'manual_test',
                FOREIGN KEY (employee_id)
                    REFERENCES employees(employee_id)
            );

            CREATE INDEX IF NOT EXISTS idx_attendance_employee_time
                ON attendance_events(employee_id, event_time);
        """)


def register_employee(employee_id, full_name, designation=""):
    employee_id = employee_id.strip()
    full_name = full_name.strip()

    if not employee_id or not full_name:
        raise ValueError("Employee ID and full name are required.")

    with connect() as connection:
        connection.execute("""
            INSERT INTO employees
                (employee_id, full_name, designation, created_at)
            VALUES (?, ?, ?, ?)
            ON CONFLICT(employee_id) DO UPDATE SET
                full_name = excluded.full_name,
                designation = excluded.designation
        """, (
            employee_id,
            full_name,
            designation.strip(),
            datetime.now(timezone.utc).isoformat()
        ))


def record_attendance(employee_id, event_type, source="manual_test"):
    if event_type not in {"check_in", "check_out"}:
        raise ValueError("event_type must be check_in or check_out.")

    with connect() as connection:
        employee = connection.execute("""
            SELECT active FROM employees WHERE employee_id = ?
        """, (employee_id,)).fetchone()

        if employee is None or not employee["active"]:
            raise ValueError("Employee does not exist or is inactive.")

        latest = connection.execute("""
            SELECT event_type FROM attendance_events
            WHERE employee_id = ?
            ORDER BY event_id DESC LIMIT 1
        """, (employee_id,)).fetchone()

        if latest and latest["event_type"] == event_type:
            return {
                "recorded": False,
                "reason": f"Already has a latest {event_type} event."
            }

        if event_type == "check_out" and (
            latest is None or latest["event_type"] != "check_in"
        ):
            return {
                "recorded": False,
                "reason": "Cannot check out without an active check-in."
            }

        event_time = datetime.now(timezone.utc).isoformat()
        cursor = connection.execute("""
            INSERT INTO attendance_events
                (employee_id, event_type, event_time, source)
            VALUES (?, ?, ?, ?)
        """, (employee_id, event_type, event_time, source))

        return {
            "recorded": True,
            "event_id": cursor.lastrowid,
            "employee_id": employee_id,
            "event_type": event_type,
            "event_time": event_time
        }


def list_attendance(employee_id=None, limit=50):
    with connect() as connection:
        if employee_id:
            rows = connection.execute("""
                SELECT * FROM attendance_events
                WHERE employee_id = ?
                ORDER BY event_id DESC LIMIT ?
            """, (employee_id, limit)).fetchall()
        else:
            rows = connection.execute("""
                SELECT * FROM attendance_events
                ORDER BY event_id DESC LIMIT ?
            """, (limit,)).fetchall()

        return [dict(row) for row in rows]


if __name__ == "__main__":
    initialize_database()
    print(f"Database initialized: {DB_PATH}")
