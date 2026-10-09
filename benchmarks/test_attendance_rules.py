import sqlite3
import tempfile
import unittest
from contextlib import contextmanager
from pathlib import Path
from unittest.mock import patch

from services.cv.app.core import attendance_db as db


class AttendanceRulesTests(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp_dir.cleanup)

        self.data_dir = Path(self.temp_dir.name)
        self.db_path = self.data_dir / "test.db"

        self.patches = [
            patch.object(db, "DATA_DIR", self.data_dir),
            patch.object(db, "DB_PATH", self.db_path),
        ]

        for item in self.patches:
            item.start()
            self.addCleanup(item.stop)

        # Ensure every test connection is closed, including on Windows.
        @contextmanager
        def test_connect():
            self.data_dir.mkdir(parents=True, exist_ok=True)
            connection = sqlite3.connect(self.db_path, timeout=10)
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

        self.connect_patch = patch.object(db, "connect", test_connect)
        self.connect_patch.start()
        self.addCleanup(self.connect_patch.stop)

        db.initialize_database()
        db.register_employee(
            "employee_test", "Test Employee", "Tester"
        )

    def test_first_check_in_is_recorded(self):
        result = db.record_attendance("employee_test", "check_in")

        self.assertTrue(result["recorded"])
        self.assertEqual(result["event_type"], "check_in")

    def test_duplicate_check_in_is_rejected(self):
        db.record_attendance("employee_test", "check_in")

        result = db.record_attendance("employee_test", "check_in")

        self.assertFalse(result["recorded"])
        self.assertIn("Already has", result["reason"])
        self.assertEqual(len(db.list_attendance()), 1)

    def test_check_out_after_check_in_is_recorded(self):
        db.record_attendance("employee_test", "check_in")

        result = db.record_attendance("employee_test", "check_out")

        self.assertTrue(result["recorded"])
        self.assertEqual(result["event_type"], "check_out")

    def test_duplicate_check_out_is_rejected(self):
        db.record_attendance("employee_test", "check_in")
        db.record_attendance("employee_test", "check_out")

        result = db.record_attendance("employee_test", "check_out")

        self.assertFalse(result["recorded"])
        self.assertEqual(len(db.list_attendance()), 2)

    def test_unknown_employee_is_rejected(self):
        with self.assertRaises(ValueError):
            db.record_attendance("missing_employee", "check_in")

    def test_inactive_employee_is_rejected(self):
        with db.connect() as connection:
            connection.execute(
                "UPDATE employees SET active = 0 "
                "WHERE employee_id = ?",
                ("employee_test",),
            )

        with self.assertRaises(ValueError):
            db.record_attendance("employee_test", "check_in")

    def test_invalid_event_type_is_rejected(self):
        with self.assertRaises(ValueError):
            db.record_attendance("employee_test", "break_time")

    def test_attendance_history_is_returned_newest_first(self):
        db.record_attendance("employee_test", "check_in")
        db.record_attendance("employee_test", "check_out")

        history = db.list_attendance()

        self.assertEqual(len(history), 2)
        self.assertEqual(history[0]["event_type"], "check_out")
        self.assertEqual(history[1]["event_type"], "check_in")


    def test_check_out_without_check_in_is_rejected(self):
        result = db.record_attendance("employee_test", "check_out")

        self.assertFalse(result["recorded"])
        self.assertIn("check-in", result["reason"].lower())
        self.assertEqual(len(db.list_attendance()), 0)

    def test_registering_employee_does_not_reactivate_inactive_employee(self):
        with db.connect() as connection:
            connection.execute(
                "UPDATE employees SET active = 0 WHERE employee_id = ?",
                ("employee_test",),
            )

        db.register_employee(
            "employee_test", "Updated Test Employee", "Tester"
        )

        with db.connect() as connection:
            employee = connection.execute(
                "SELECT active, full_name FROM employees WHERE employee_id = ?",
                ("employee_test",),
            ).fetchone()

        self.assertEqual(employee["active"], 0)
        self.assertEqual(employee["full_name"], "Updated Test Employee")

if __name__ == "__main__":
    unittest.main(verbosity=2)
    def test_check_out_without_check_in_is_rejected(self):
        result = db.record_attendance("employee_test", "check_out")

        self.assertFalse(result["recorded"])
        self.assertIn("check-in", result["reason"].lower())
        self.assertEqual(len(db.list_attendance()), 0)
