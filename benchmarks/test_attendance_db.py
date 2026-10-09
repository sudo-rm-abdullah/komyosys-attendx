import sqlite3
import tempfile
import unittest
from contextlib import contextmanager
from pathlib import Path
from unittest.mock import patch

from services.cv.app.core import attendance_db as db


class AttendanceDatabaseSmokeTest(unittest.TestCase):
    def test_attendance_workflow_uses_temporary_database(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            data_dir = Path(temp_dir)
            database_path = data_dir / "test_attendx.db"

            @contextmanager
            def temporary_connect():
                data_dir.mkdir(parents=True, exist_ok=True)
                connection = sqlite3.connect(database_path, timeout=10)
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

            with (
                patch.object(db, "DATA_DIR", data_dir),
                patch.object(db, "DB_PATH", database_path),
                patch.object(db, "connect", temporary_connect),
            ):
                db.initialize_database()
                db.register_employee(
                    "test_employee", "Test Employee", "Test"
                )

                first_check_in = db.record_attendance(
                    "test_employee", "check_in",
                    source="automated_test"
                )
                duplicate_check_in = db.record_attendance(
                    "test_employee", "check_in",
                    source="automated_test"
                )
                check_out = db.record_attendance(
                    "test_employee", "check_out",
                    source="automated_test"
                )
                duplicate_check_out = db.record_attendance(
                    "test_employee", "check_out",
                    source="automated_test"
                )

                self.assertTrue(first_check_in["recorded"])
                self.assertFalse(duplicate_check_in["recorded"])
                self.assertTrue(check_out["recorded"])
                self.assertFalse(duplicate_check_out["recorded"])

                history = db.list_attendance("test_employee")
                self.assertEqual(
                    [event["event_type"] for event in history],
                    ["check_out", "check_in"],
                )
                self.assertTrue(database_path.exists())


if __name__ == "__main__":
    unittest.main()
