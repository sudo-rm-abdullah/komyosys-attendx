import {
  Camera,
  Clock,
  UserMinus,
  Users,
  UsersRound,
  Video,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type MetricTone = 'green' | 'red' | 'orange' | 'blue'

type Metric = {
  label: string
  value: string
  supportingText: string
  tone: MetricTone
  icon: LucideIcon
}

type AttendanceEventType = 'Checked in' | 'Checked out' | 'Late arrival'

type AttendanceEvent = {
  initials: string
  name: string
  department: string
  type: AttendanceEventType
  time: string
}

type AttendanceTrendPoint = {
  day: string
  present: number
  late: number
}

type DepartmentAttendance = {
  department: string
  percentage: number
  supportingText: string
}

const metrics: Metric[] = [
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
    label: 'Total Employees',
    value: '60',
    supportingText: '3 departments',
    tone: 'blue',
    icon: UsersRound,
  },
]

const attendanceTrend: AttendanceTrendPoint[] = [
  { day: 'Mon', present: 38, late: 4 },
  { day: 'Tue', present: 40, late: 3 },
  { day: 'Wed', present: 41, late: 6 },
  { day: 'Thu', present: 39, late: 5 },
  { day: 'Fri', present: 42, late: 5 },
]

const departmentAttendance: DepartmentAttendance[] = [
  {
    department: 'Engineering',
    percentage: 92,
    supportingText: '23 of 25 present',
  },
  {
    department: 'Operations',
    percentage: 86,
    supportingText: '12 of 14 present',
  },
  {
    department: 'Human Resources',
    percentage: 78,
    supportingText: '7 of 9 present',
  },
]

const attendanceEvents: AttendanceEvent[] = [
  {
    initials: 'SA',
    name: 'Sarah Ahmed',
    department: 'Operations',
    type: 'Checked in',
    time: '09:02 AM',
  },
  {
    initials: 'MK',
    name: 'Michael Khan',
    department: 'Engineering',
    type: 'Checked in',
    time: '08:57 AM',
  },
  {
    initials: 'FN',
    name: 'Fatima Noor',
    department: 'Human Resources',
    type: 'Late arrival',
    time: '09:18 AM',
  },
  {
    initials: 'ZA',
    name: 'Zain Ali',
    department: 'Sales',
    type: 'Checked out',
    time: '08:46 AM',
  },
  {
    initials: 'UR',
    name: 'Usman Raza',
    department: 'Engineering',
    type: 'Checked in',
    time: '08:41 AM',
  },
]

const toneStyles: Record<MetricTone, { icon: string; indicator: string }> = {
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

const eventStyles: Record<AttendanceEventType, { label: string; avatar: string }> = {
  'Checked in': {
    label: 'text-emerald-700',
    avatar: 'bg-sky-50 text-sky-700',
  },
  'Checked out': {
    label: 'text-slate-500',
    avatar: 'bg-slate-100 text-slate-600',
  },
  'Late arrival': {
    label: 'text-orange-700',
    avatar: 'bg-orange-50 text-orange-700',
  },
}

function Dashboard() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Today&apos;s attendance and workplace overview
          </p>
        </div>
        <div
          aria-label="Current date"
          className="inline-flex w-fit items-center rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-600 shadow-sm"
        >
          October 8, 2026
        </div>
      </header>

      <section
        aria-label="Today's attendance metrics"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {metrics.map(({ label, value, supportingText, tone, icon: Icon }) => (
          <article
            key={label}
            className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)] transition-shadow hover:shadow-[0_5px_18px_rgba(15,23,42,0.07)]"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[13px] font-medium text-slate-500">{label}</p>
                <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
                  {value}
                </p>
              </div>
              <span
                className={`flex size-10 items-center justify-center rounded-lg ${toneStyles[tone].icon}`}
              >
                <Icon aria-hidden="true" className="size-[19px]" strokeWidth={1.9} />
              </span>
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span
                aria-hidden="true"
                className={`size-1.5 rounded-full ${toneStyles[tone].indicator}`}
              />
              <p className="text-xs text-slate-500">{supportingText}</p>
            </div>
          </article>
        ))}
      </section>

      <section
        aria-label="Live monitoring and recent attendance"
        className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-5"
      >
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)] xl:col-span-3">
          <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">Live Entrance</h2>
              <p className="mt-1 text-xs text-slate-500">
                Main Entrance <span aria-hidden="true">•</span> Camera 01
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Camera Online
              </span>
              <span className="inline-flex items-center gap-1 rounded-md bg-rose-50 px-2 py-1 text-[10px] font-bold tracking-wide text-rose-600">
                <span className="size-1.5 rounded-full bg-rose-500" />
                LIVE
              </span>
            </div>
          </header>

          <div className="relative flex min-h-64 items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-slate-950 px-4 py-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:32px_32px]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_65%)]"
            />
            <div className="relative flex flex-col items-center text-center">
              <span className="mb-3 flex size-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-sky-400">
                <Video aria-hidden="true" className="size-6" strokeWidth={1.6} />
              </span>
              <p className="text-sm font-medium text-slate-200">
                Live camera preview
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Waiting for camera feed
              </p>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-slate-950/75 px-4 py-2.5 backdrop-blur-sm">
              <span className="text-[11px] text-slate-400">People detected</span>
              <span className="text-xs font-semibold text-white">3</span>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <Camera aria-hidden="true" className="size-3.5" />
            Demo preview only
          </div>
        </article>

        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)] lg:col-span-1 xl:col-span-2">
          <header className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Attendance
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Latest employee activity
              </p>
            </div>
            <button
              type="button"
              className="rounded-md px-2 py-1 text-xs font-medium text-sky-700 outline-none transition-colors hover:bg-sky-50 hover:text-sky-800 focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              View all
            </button>
          </header>

          <ul className="divide-y divide-slate-100">
            {attendanceEvents.map((event) => (
              <li
                key={`${event.name}-${event.time}`}
                className="flex items-center gap-3 py-3"
              >
                <span
                  aria-hidden="true"
                  className={`flex size-9 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${eventStyles[event.type].avatar}`}
                >
                  {event.initials}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-800">
                    {event.name}
                  </p>
                  <p className="mt-0.5 truncate text-[11px] text-slate-500">
                    {event.department}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`text-[11px] font-medium ${eventStyles[event.type].label}`}>
                    {event.type}
                  </p>
                  <p className="mt-0.5 text-[10px] text-slate-400">{event.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section
        aria-label="Attendance analytics"
        className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2"
      >
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
          <header className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Attendance Trend
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Employee attendance over the week
            </p>
          </header>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={attendanceTrend}
                margin={{ top: 8, right: 8, bottom: 0, left: -18 }}
              >
                <CartesianGrid
                  stroke="#e8eef5"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickMargin={10}
                />
                <YAxis
                  type="number"
                  domain={[0, 45]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  width={34}
                />
                <Tooltip
                  contentStyle={{
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.08)',
                    fontSize: 12,
                  }}
                  labelStyle={{ color: '#334155', fontWeight: 600 }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={28}
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: 11, color: '#64748b' }}
                />
                <Line
                  type="monotone"
                  dataKey="present"
                  name="Present"
                  stroke="#0284c7"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#0284c7', strokeWidth: 0 }}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="late"
                  name="Late"
                  stroke="#f97316"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#f97316', strokeWidth: 0 }}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
          <header className="mb-6">
            <h2 className="text-sm font-semibold text-slate-900">
              Attendance by Department
            </h2>
            <p className="mt-1 text-xs text-slate-500">
              Today&apos;s attendance rate
            </p>
          </header>
          <ul className="space-y-6">
            {departmentAttendance.map(
              ({ department, percentage, supportingText }) => (
                <li key={department}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-700">
                      {department}
                    </span>
                    <span className="text-xs font-semibold tabular-nums text-slate-700">
                      {percentage}%
                    </span>
                  </div>
                  <div
                    role="progressbar"
                    aria-label={`${department} attendance`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={percentage}
                    className="h-2 overflow-hidden rounded-full bg-slate-100"
                  >
                    <div
                      className="h-full rounded-full bg-sky-600 transition-[width]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <p className="mt-2 text-[11px] text-slate-500">
                    {supportingText}
                  </p>
                </li>
              ),
            )}
          </ul>
        </article>
      </section>
    </div>
  )
}

export default Dashboard