import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
  UserMinus,
  Users,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type SummaryTone = 'green' | 'red' | 'orange' | 'blue'

type SummaryMetric = {
  label: string
  value: string
  supportingText: string
  tone: SummaryTone
  icon: LucideIcon
}

type AttendanceStatus =
  | 'Checked in'
  | 'Late arrival'
  | 'Checked out'
  | 'Absent'
  | 'On leave'

type AttendanceRecord = {
  initials: string
  name: string
  department: string
  checkIn: string
  checkOut: string
  status: AttendanceStatus
  totalHours: string
}

const summaryMetrics: SummaryMetric[] = [
  {
    label: 'Present',
    value: '42',
    supportingText: '70% of employees',
    tone: 'green',
    icon: Users,
  },
  {
    label: 'Absent',
    value: '8',
    supportingText: '13% of employees',
    tone: 'red',
    icon: UserMinus,
  },
  {
    label: 'Late',
    value: '5',
    supportingText: '8% of employees',
    tone: 'orange',
    icon: Clock,
  },
  {
    label: 'On Leave',
    value: '5',
    supportingText: '8% of employees',
    tone: 'blue',
    icon: CalendarDays,
  },
]

const attendanceRecords: AttendanceRecord[] = [
  {
    initials: 'SA',
    name: 'Sarah Ahmed',
    department: 'Operations',
    checkIn: '09:02 AM',
    checkOut: '—',
    status: 'Checked in',
    totalHours: '—',
  },
  {
    initials: 'MK',
    name: 'Michael Khan',
    department: 'Engineering',
    checkIn: '08:57 AM',
    checkOut: '—',
    status: 'Checked in',
    totalHours: '—',
  },
  {
    initials: 'FN',
    name: 'Fatima Noor',
    department: 'Human Resources',
    checkIn: '09:18 AM',
    checkOut: '—',
    status: 'Late arrival',
    totalHours: '—',
  },
  {
    initials: 'ZA',
    name: 'Zain Ali',
    department: 'Sales',
    checkIn: '08:12 AM',
    checkOut: '04:46 PM',
    status: 'Checked out',
    totalHours: '8h 34m',
  },
  {
    initials: 'UR',
    name: 'Usman Raza',
    department: 'Engineering',
    checkIn: '08:41 AM',
    checkOut: '—',
    status: 'Checked in',
    totalHours: '—',
  },
  {
    initials: 'AM',
    name: 'Ayesha Malik',
    department: 'Operations',
    checkIn: '—',
    checkOut: '—',
    status: 'Absent',
    totalHours: '—',
  },
  {
    initials: 'HT',
    name: 'Hamza Tariq',
    department: 'Engineering',
    checkIn: '08:30 AM',
    checkOut: '—',
    status: 'Checked in',
    totalHours: '—',
  },
  {
    initials: 'MH',
    name: 'Maria Hassan',
    department: 'Human Resources',
    checkIn: '—',
    checkOut: '—',
    status: 'On leave',
    totalHours: '—',
  },
]

const summaryToneStyles: Record<
  SummaryTone,
  { icon: string; indicator: string }
> = {
  green: {
    icon: 'bg-emerald-50 text-emerald-600',
    indicator: 'bg-emerald-500',
  },
  red: {
    icon: 'bg-rose-50 text-rose-600',
    indicator: 'bg-rose-500',
  },
  orange: {
    icon: 'bg-orange-50 text-orange-600',
    indicator: 'bg-orange-500',
  },
  blue: {
    icon: 'bg-sky-50 text-sky-600',
    indicator: 'bg-sky-500',
  },
}

const statusStyles: Record<AttendanceStatus, { badge: string; dot: string }> = {
  'Checked in': {
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  'Late arrival': {
    badge: 'border-orange-200 bg-orange-50 text-orange-700',
    dot: 'bg-orange-500',
  },
  'Checked out': {
    badge: 'border-slate-200 bg-slate-50 text-slate-600',
    dot: 'bg-slate-400',
  },
  Absent: {
    badge: 'border-rose-200 bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
  },
  'On leave': {
    badge: 'border-violet-200 bg-violet-50 text-violet-700',
    dot: 'bg-violet-500',
  },
}

function Attendance() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Attendance
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Employee attendance records and daily status
          </p>
        </div>
        <div
          aria-label="Current date"
          className="inline-flex w-fit items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm"
        >
          <CalendarDays aria-hidden="true" className="size-4 text-sky-600" />
          October 8, 2026
          <ChevronDown aria-hidden="true" className="size-3.5 text-slate-400" />
        </div>
      </header>

      <section
        aria-label="Attendance summary"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {summaryMetrics.map(
          ({ label, value, supportingText, tone, icon: Icon }) => (
            <article
              key={label}
              className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)] transition-shadow hover:shadow-[0_5px_18px_rgba(15,23,42,0.07)]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[13px] font-medium text-slate-500">
                    {label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                    {value}
                  </p>
                </div>
                <span
                  className={`flex size-10 items-center justify-center rounded-lg ${summaryToneStyles[tone].icon}`}
                >
                  <Icon
                    aria-hidden="true"
                    className="size-[19px]"
                    strokeWidth={1.9}
                  />
                </span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${summaryToneStyles[tone].indicator}`}
                />
                <p className="text-xs text-slate-500">{supportingText}</p>
              </div>
            </article>
          ),
        )}
      </section>

      <section
        aria-label="Attendance filters"
        className="mt-6 rounded-xl border border-slate-200/80 bg-white p-3 shadow-[0_2px_10px_rgba(15,23,42,0.035)] sm:p-3.5"
      >
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[2fr_1fr_1fr_1.35fr]">
          <label className="relative block min-w-0">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            />
            <span className="sr-only">Search employees</span>
            <input
              type="search"
              placeholder="Search employees..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <label className="min-w-0">
            <span className="sr-only">Filter by department</span>
            <select
              defaultValue=""
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              <option value="">All departments</option>
              <option>Engineering</option>
              <option>Operations</option>
              <option>Human Resources</option>
              <option>Sales</option>
            </select>
          </label>
          <label className="min-w-0">
            <span className="sr-only">Filter by status</span>
            <select
              defaultValue=""
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              <option value="">All statuses</option>
              <option>Checked in</option>
              <option>Late arrival</option>
              <option>Checked out</option>
              <option>Absent</option>
              <option>On leave</option>
            </select>
          </label>
          <button
            type="button"
            aria-label="Attendance date filter: October 8, 2026"
            className="flex h-10 min-w-0 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-500"
          >
            <span className="flex items-center gap-2">
              <CalendarDays
                aria-hidden="true"
                className="size-4 text-sky-600"
              />
              <span>
                <span className="text-slate-400">Date: </span>
                October 8, 2026
              </span>
            </span>
            <ChevronDown
              aria-hidden="true"
              className="size-3.5 text-slate-400"
            />
          </button>
        </div>
      </section>

      <section
        aria-labelledby="attendance-table-title"
        className="mt-6 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.035)]"
      >
        <header className="flex items-center justify-between gap-3 px-5 py-4">
          <div>
            <h2
              id="attendance-table-title"
              className="text-sm font-semibold text-slate-900"
            >
              Today&apos;s Attendance
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Daily employee check-in and status overview
            </p>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Employee
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Department
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Check-in
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Check-out
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Total Hours
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {attendanceRecords.map((record) => (
                <tr
                  key={record.name}
                  className="transition-colors hover:bg-slate-50/70"
                >
                  <td className="whitespace-nowrap px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[11px] font-semibold text-sky-700"
                      >
                        {record.initials}
                      </span>
                      <span className="text-xs font-semibold text-slate-800">
                        {record.name}
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
                    {record.department}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums text-slate-600">
                    {record.checkIn}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums text-slate-600">
                    {record.checkOut}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyles[record.status].badge}`}
                    >
                      <span
                        aria-hidden="true"
                        className={`size-1.5 rounded-full ${statusStyles[record.status].dot}`}
                      />
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

        <footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-700">8</span> of{' '}
            <span className="font-medium text-slate-700">60</span> employees
          </p>
          <div className="flex items-center gap-1.5 self-end sm:self-auto">
            <button
              type="button"
              aria-label="Previous page"
              className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 outline-none transition hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <ChevronLeft aria-hidden="true" className="size-4" />
            </button>
            <button
              type="button"
              aria-current="page"
              className="flex size-9 items-center justify-center rounded-lg border border-sky-200 bg-sky-50 text-xs font-semibold text-sky-700 outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              1
            </button>
            <button
              type="button"
              aria-label="Next page"
              className="flex size-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 outline-none transition hover:border-slate-300 hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              <ChevronRight aria-hidden="true" className="size-4" />
            </button>
          </div>
        </footer>
      </section>
    </div>
  )
}

export default Attendance
