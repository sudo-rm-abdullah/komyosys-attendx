import {
  ArrowLeft,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  MapPin,
  ScanFace,
  UserMinus,
  Users,
  UsersRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import {
  employees,
  type EmployeeRecord,
  type FaceEnrollment,
} from './Employees'

type AttendanceMetricTone = 'green' | 'orange' | 'red' | 'blue'

type AttendanceMetric = {
  label: string
  value: string
  supportingText: string
  tone: AttendanceMetricTone
  icon: LucideIcon
}

type HistoryStatus = 'Checked in' | 'Completed' | 'Late arrival' | 'Checked out'

type AttendanceHistoryRecord = {
  date: string
  checkIn: string
  checkOut: string
  status: HistoryStatus
  totalHours: string
}

const attendanceMetrics: AttendanceMetric[] = [
  {
    label: 'Present',
    value: '18 days',
    supportingText: '90% attendance',
    tone: 'green',
    icon: Users,
  },
  {
    label: 'Late',
    value: '2 days',
    supportingText: '10% of working days',
    tone: 'orange',
    icon: Clock3,
  },
  {
    label: 'Absent',
    value: '0 days',
    supportingText: 'No absences',
    tone: 'red',
    icon: UserMinus,
  },
  {
    label: 'Average Hours',
    value: '8h 12m',
    supportingText: 'Daily average',
    tone: 'blue',
    icon: Clock3,
  },
]

const attendanceHistory: AttendanceHistoryRecord[] = [
  {
    date: 'Oct 8, 2026',
    checkIn: '09:02 AM',
    checkOut: '—',
    status: 'Checked in',
    totalHours: '—',
  },
  {
    date: 'Oct 7, 2026',
    checkIn: '08:54 AM',
    checkOut: '05:06 PM',
    status: 'Completed',
    totalHours: '8h 12m',
  },
  {
    date: 'Oct 6, 2026',
    checkIn: '09:14 AM',
    checkOut: '05:18 PM',
    status: 'Late arrival',
    totalHours: '8h 04m',
  },
  {
    date: 'Oct 5, 2026',
    checkIn: '08:49 AM',
    checkOut: '05:03 PM',
    status: 'Completed',
    totalHours: '8h 14m',
  },
  {
    date: 'Oct 2, 2026',
    checkIn: '09:02 AM',
    checkOut: '05:10 PM',
    status: 'Completed',
    totalHours: '8h 08m',
  },
]

const metricStyles: Record<AttendanceMetricTone, { icon: string; dot: string }> = {
  green: {
    icon: 'bg-emerald-50 text-emerald-600',
    dot: 'bg-emerald-500',
  },
  orange: {
    icon: 'bg-orange-50 text-orange-600',
    dot: 'bg-orange-500',
  },
  red: {
    icon: 'bg-rose-50 text-rose-600',
    dot: 'bg-rose-500',
  },
  blue: {
    icon: 'bg-sky-50 text-sky-600',
    dot: 'bg-sky-500',
  },
}

const enrollmentStyles: Record<
  FaceEnrollment,
  { badge: string; dot: string; label: string }
> = {
  Enrolled: {
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
    label: 'Ready for recognition',
  },
  Pending: {
    badge: 'border-orange-200 bg-orange-50 text-orange-700',
    dot: 'bg-orange-500',
    label: 'Pending enrollment',
  },
  'Not enrolled': {
    badge: 'border-slate-200 bg-slate-50 text-slate-600',
    dot: 'bg-slate-400',
    label: 'Not enrolled',
  },
}

const historyStatusStyles: Record<HistoryStatus, string> = {
  'Checked in': 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Completed: 'border-sky-200 bg-sky-50 text-sky-700',
  'Late arrival': 'border-orange-200 bg-orange-50 text-orange-700',
  'Checked out': 'border-slate-200 bg-slate-50 text-slate-600',
}

const joinedPrefix = 'Joined '

function getEmployee(employeeId: string | undefined): EmployeeRecord | undefined {
  return employees.find((employee) => employee.employeeId === employeeId)
}

function EmployeeNotFound() {
  return (
    <div className="mx-auto flex min-h-[55vh] w-full max-w-7xl items-center justify-center">
      <section className="w-full max-w-md rounded-xl border border-slate-200/80 bg-white p-8 text-center shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <UsersRound aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-slate-900">
          Employee not found
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          This employee profile may have been removed or the ID is invalid.
        </p>
        <Link
          to="/employees"
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-xs font-semibold text-white outline-none transition-colors hover:bg-sky-700 focus-visible:ring-4 focus-visible:ring-sky-200"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Employees
        </Link>
      </section>
    </div>
  )
}

function EmployeeDetail() {
  const { employeeId } = useParams<{ employeeId: string }>()
  const employee = getEmployee(employeeId)

  if (!employee) {
    return <EmployeeNotFound />
  }

  const enrollmentStyle = enrollmentStyles[employee.faceEnrollment]

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="mb-6">
        <Link
          to="/employees"
          className="inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-slate-500 outline-none transition-colors hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Employees
        </Link>
        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {employee.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {employee.employeeId} <span aria-hidden="true">•</span>{' '}
              {employee.department}
            </p>
          </div>
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
              employee.status === 'Active'
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                : 'border-slate-200 bg-slate-50 text-slate-600'
            }`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${
                employee.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
            {employee.status}
          </span>
        </div>
      </header>

      <section
        aria-label="Employee profile and today's presence"
        className="grid grid-cols-1 gap-5 lg:grid-cols-2"
      >
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
          <h2 className="text-sm font-semibold text-slate-900">
            Employee Profile
          </h2>
          <div className="mt-5 flex items-center gap-4">
            <span className="flex size-16 shrink-0 items-center justify-center rounded-2xl bg-sky-50 text-lg font-semibold tracking-wide text-sky-700 ring-1 ring-inset ring-sky-100">
              {employee.initials}
            </span>
            <div className="min-w-0">
              <h3 className="truncate text-base font-semibold text-slate-900">
                {employee.name}
              </h3>
              <p className="mt-1 text-xs text-slate-500">{employee.position}</p>
              <p className="mt-1 text-xs font-medium text-sky-700">
                {employee.employeeId}
              </p>
            </div>
          </div>
          <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
            <div>
              <dt className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Building2 aria-hidden="true" className="size-3.5" />
                Department
              </dt>
              <dd className="mt-1 text-xs font-medium text-slate-700">
                {employee.department}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <BriefcaseBusiness aria-hidden="true" className="size-3.5" />
                Position
              </dt>
              <dd className="mt-1 text-xs font-medium text-slate-700">
                {employee.position}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <CalendarDays aria-hidden="true" className="size-3.5" />
                Joined
              </dt>
              <dd className="mt-1 text-xs font-medium text-slate-700">
                {joinedPrefix}
                {employee.joined}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <UsersRound aria-hidden="true" className="size-3.5" />
                Current status
              </dt>
              <dd className="mt-1 text-xs font-medium text-slate-700">
                {employee.status}
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Today&apos;s Presence
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Current workplace attendance
            </p>
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/70 px-3 py-2.5">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-35" />
              <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </span>
            <span className="text-xs font-semibold text-emerald-800">
              At workplace
            </span>
          </div>
          <dl className="mt-4 divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-xs text-slate-500">Check-in</dt>
              <dd className="text-xs font-medium tabular-nums text-slate-800">
                09:02 AM
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-xs text-slate-500">Workplace</dt>
              <dd className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                <MapPin aria-hidden="true" className="size-3.5 text-sky-600" />
                Operations Floor
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-xs text-slate-500">Time present</dt>
              <dd className="text-xs font-medium tabular-nums text-slate-800">
                6h 48m
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-2.5">
              <dt className="text-xs text-slate-500">Check-out</dt>
              <dd className="text-xs font-medium tabular-nums text-slate-500">
                —
              </dd>
            </div>
          </dl>
        </article>
      </section>

      <section
        aria-label="Attendance summary"
        className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {attendanceMetrics.map(
          ({ label, value, supportingText, tone, icon: Icon }) => (
            <article
              key={label}
              className="rounded-xl border border-slate-200/80 bg-white p-4 shadow-[0_2px_10px_rgba(15,23,42,0.035)]"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-[12px] font-medium text-slate-500">
                    {label}
                  </p>
                  <p className="mt-2 text-xl font-semibold tracking-tight text-slate-900">
                    {value}
                  </p>
                </div>
                <span
                  className={`flex size-9 items-center justify-center rounded-lg ${metricStyles[tone].icon}`}
                >
                  <Icon aria-hidden="true" className="size-[17px]" />
                </span>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${metricStyles[tone].dot}`}
                />
                <p className="text-[11px] text-slate-500">{supportingText}</p>
              </div>
            </article>
          ),
        )}
      </section>

      <section
        aria-label="Identity and recent attendance"
        className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.5fr)]"
      >
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">Identity</h2>
            <p className="mt-1 text-xs text-slate-500">
              Computer vision identity status
            </p>
          </div>
          <div className="mt-5 flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
              <ScanFace aria-hidden="true" className="size-5" />
            </span>
            <div>
              <p className="text-xs font-semibold text-slate-800">Face ID</p>
              <span
                className={`mt-1 inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold ${enrollmentStyle.badge}`}
              >
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${enrollmentStyle.dot}`}
                />
                {employee.faceEnrollment === 'Pending'
                  ? 'Pending enrollment'
                  : employee.faceEnrollment}
              </span>
            </div>
          </div>
          <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">Identity status</span>
              <span className="text-right text-xs font-medium text-slate-700">
                {enrollmentStyle.label}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs text-slate-500">Enrollment date</span>
              <span className="text-xs font-medium text-slate-700">
                {employee.faceEnrollment === 'Enrolled'
                  ? 'Sep 18, 2026'
                  : '—'}
              </span>
            </div>
          </div>
          <button
            type="button"
            className="mt-5 inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 outline-none transition-colors hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <ScanFace aria-hidden="true" className="size-4" />
            Manage Face ID
          </button>
        </article>

        <article className="overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
          <header className="px-5 py-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Recent Attendance
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Latest attendance history for {employee.name}
            </p>
          </header>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-y border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                    Date
                  </th>
                  <th className="px-3 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                    Check-in
                  </th>
                  <th className="px-3 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                    Check-out
                  </th>
                  <th className="px-3 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                    Status
                  </th>
                  <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                    Total Hours
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendanceHistory.map((record) => (
                  <tr
                    key={record.date}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="whitespace-nowrap px-5 py-3 text-xs font-medium text-slate-700">
                      {record.date}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs tabular-nums text-slate-600">
                      {record.checkIn}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs tabular-nums text-slate-600">
                      {record.checkOut}
                    </td>
                    <td className="whitespace-nowrap px-3 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2 py-1 text-[10px] font-semibold ${historyStatusStyles[record.status]}`}
                      >
                        {record.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right text-xs tabular-nums text-slate-600">
                      {record.totalHours}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </div>
  )
}

export default EmployeeDetail
