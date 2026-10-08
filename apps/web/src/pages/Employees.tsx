import {
  Building2,
  Check,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MoreHorizontal,
  Plus,
  ScanFace,
  Search,
  UserCheck,
  UsersRound,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

type EmployeeMetricTone = 'blue' | 'green' | 'purple'

type EmployeeMetric = {
  label: string
  value: string
  supportingText: string
  tone: EmployeeMetricTone
  icon: LucideIcon
}

export type EmployeeStatus = 'Active' | 'Inactive'
export type FaceEnrollment = 'Enrolled' | 'Pending' | 'Not enrolled'

export type EmployeeRecord = {
  initials: string
  name: string
  employeeId: string
  department: string
  position: string
  status: EmployeeStatus
  faceEnrollment: FaceEnrollment
  joined: string
}

const employeeMetrics: EmployeeMetric[] = [
  {
    label: 'Total Employees',
    value: '60',
    supportingText: 'Across 3 departments',
    tone: 'blue',
    icon: UsersRound,
  },
  {
    label: 'Active Employees',
    value: '57',
    supportingText: '95% of employees',
    tone: 'green',
    icon: UserCheck,
  },
  {
    label: 'Departments',
    value: '3',
    supportingText: 'Engineering, Operations, HR',
    tone: 'blue',
    icon: Building2,
  },
  {
    label: 'Face Enrolled',
    value: '48',
    supportingText: '80% enrolled',
    tone: 'purple',
    icon: ScanFace,
  },
]

export const employees: EmployeeRecord[] = [
  {
    initials: 'SA',
    name: 'Sarah Ahmed',
    employeeId: 'EMP-001',
    department: 'Operations',
    position: 'Operations Specialist',
    status: 'Active',
    faceEnrollment: 'Enrolled',
    joined: 'Jan 12, 2025',
  },
  {
    initials: 'MK',
    name: 'Michael Khan',
    employeeId: 'EMP-002',
    department: 'Engineering',
    position: 'Software Engineer',
    status: 'Active',
    faceEnrollment: 'Enrolled',
    joined: 'Feb 03, 2025',
  },
  {
    initials: 'FN',
    name: 'Fatima Noor',
    employeeId: 'EMP-003',
    department: 'Human Resources',
    position: 'HR Coordinator',
    status: 'Active',
    faceEnrollment: 'Pending',
    joined: 'Mar 18, 2025',
  },
  {
    initials: 'ZA',
    name: 'Zain Ali',
    employeeId: 'EMP-004',
    department: 'Sales',
    position: 'Sales Executive',
    status: 'Active',
    faceEnrollment: 'Enrolled',
    joined: 'Apr 07, 2025',
  },
  {
    initials: 'UR',
    name: 'Usman Raza',
    employeeId: 'EMP-005',
    department: 'Engineering',
    position: 'Systems Engineer',
    status: 'Active',
    faceEnrollment: 'Enrolled',
    joined: 'Apr 22, 2025',
  },
  {
    initials: 'AM',
    name: 'Ayesha Malik',
    employeeId: 'EMP-006',
    department: 'Operations',
    position: 'Operations Analyst',
    status: 'Active',
    faceEnrollment: 'Pending',
    joined: 'May 11, 2025',
  },
  {
    initials: 'HT',
    name: 'Hamza Tariq',
    employeeId: 'EMP-007',
    department: 'Engineering',
    position: 'QA Engineer',
    status: 'Inactive',
    faceEnrollment: 'Not enrolled',
    joined: 'Jun 02, 2025',
  },
  {
    initials: 'MH',
    name: 'Maria Hassan',
    employeeId: 'EMP-008',
    department: 'Human Resources',
    position: 'People Operations Associate',
    status: 'Active',
    faceEnrollment: 'Enrolled',
    joined: 'Jun 19, 2025',
  },
]

const metricToneStyles: Record<EmployeeMetricTone, string> = {
  blue: 'bg-sky-50 text-sky-600',
  green: 'bg-emerald-50 text-emerald-600',
  purple: 'bg-violet-50 text-violet-600',
}

const employeeStatusStyles: Record<EmployeeStatus, string> = {
  Active: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  Inactive: 'border-slate-200 bg-slate-50 text-slate-600',
}

const faceEnrollmentStyles: Record<
  FaceEnrollment,
  { badge: string; icon: LucideIcon }
> = {
  Enrolled: {
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: Check,
  },
  Pending: {
    badge: 'border-orange-200 bg-orange-50 text-orange-700',
    icon: Clock3,
  },
  'Not enrolled': {
    badge: 'border-slate-200 bg-slate-50 text-slate-600',
    icon: ScanFace,
  },
}

function Employees() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Employees
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage employees and identity information
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-xs font-semibold text-white shadow-sm shadow-sky-200 outline-none transition-colors hover:bg-sky-700 focus-visible:ring-4 focus-visible:ring-sky-200"
        >
          <Plus aria-hidden="true" className="size-4" strokeWidth={2} />
          Add Employee
        </button>
      </header>

      <section
        aria-label="Employee summary"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {employeeMetrics.map(
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
                  className={`flex size-10 items-center justify-center rounded-lg ${metricToneStyles[tone]}`}
                >
                  <Icon
                    aria-hidden="true"
                    className="size-[19px]"
                    strokeWidth={1.9}
                  />
                </span>
              </div>
              <p className="mt-4 text-xs text-slate-500">{supportingText}</p>
            </article>
          ),
        )}
      </section>

      <section
        aria-label="Employee filters"
        className="mt-6 rounded-xl border border-slate-200/80 bg-white p-3 shadow-[0_2px_10px_rgba(15,23,42,0.035)] sm:p-3.5"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <label className="relative block min-w-0">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            />
            <span className="sr-only">Search employees by name or ID</span>
            <input
              type="search"
              placeholder="Search by name or employee ID..."
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
            <span className="sr-only">Filter by employee status</span>
            <select
              defaultValue=""
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              <option value="">All statuses</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </label>
        </div>
      </section>

      <section
        aria-labelledby="employee-directory-title"
        className="mt-6 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.035)]"
      >
        <header className="px-5 py-4">
          <h2
            id="employee-directory-title"
            className="text-sm font-semibold text-slate-900"
          >
            Employee Directory
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Employee profiles and identity enrollment
          </p>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[960px] border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Employee
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Employee ID
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Department
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Face ID
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Joined
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {employees.map((employee) => {
                const FaceIcon = faceEnrollmentStyles[employee.faceEnrollment].icon

                return (
                  <tr
                    key={employee.employeeId}
                    className="transition-colors hover:bg-slate-50/70"
                  >
                    <td className="whitespace-nowrap px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span
                          aria-hidden="true"
                          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-50 text-[11px] font-semibold text-sky-700"
                        >
                          {employee.initials}
                        </span>
                        <Link
                          to={`/employees/${employee.employeeId}`}
                          className="rounded-sm text-xs font-semibold text-slate-800 outline-none transition-colors hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500"
                        >
                          {employee.name}
                        </Link>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs font-medium tabular-nums text-slate-500">
                      {employee.employeeId}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                      {employee.department}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${employeeStatusStyles[employee.status]}`}
                      >
                        {employee.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${faceEnrollmentStyles[employee.faceEnrollment].badge}`}
                      >
                        <FaceIcon
                          aria-hidden="true"
                          className="size-3"
                          strokeWidth={2}
                        />
                        {employee.faceEnrollment}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
                      {employee.joined}
                    </td>
                    <td className="whitespace-nowrap px-5 py-3 text-right">
                      <button
                        type="button"
                        aria-label={`Actions for ${employee.name}`}
                        className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 outline-none transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-sky-500"
                      >
                        <MoreHorizontal
                          aria-hidden="true"
                          className="size-[18px]"
                        />
                      </button>
                    </td>
                  </tr>
                )
              })}
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

export default Employees
