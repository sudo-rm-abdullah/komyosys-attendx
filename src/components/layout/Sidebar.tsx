import {
  Activity,
  BarChart3,
  Camera,
  ChevronDown,
  Clock3,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  UsersRound,
} from 'lucide-react'

const navigationItems = [
  { label: 'Live Monitoring', href: '/monitoring', icon: Activity },
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Attendance', href: '/attendance', icon: Clock3 },
  { label: 'Employees', href: '/employees', icon: UsersRound },
  { label: 'Cameras', href: '/cameras', icon: Camera },
  { label: 'Reports', href: '/reports', icon: BarChart3 },
  { label: 'Settings', href: '/settings', icon: Settings },
] as const

export type SidebarItem = (typeof navigationItems)[number]['label']

type SidebarProps = {
  activeItem?: SidebarItem
  onNavigate?: (item: SidebarItem) => void
}

function Sidebar({ activeItem = 'Dashboard', onNavigate }: SidebarProps) {
  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200/80 bg-white px-4 py-5 shadow-[2px_0_12px_rgba(15,23,42,0.025)]">
      <a
        href="/"
        aria-label="Komyosys AttendX home"
        className="mb-8 flex items-center gap-3 rounded-xl px-2 py-1.5 outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-sky-600 text-white shadow-sm shadow-sky-200">
          <ShieldCheck aria-hidden="true" className="size-5" strokeWidth={2.1} />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-bold tracking-tight text-slate-900">
            Komyosys
          </span>
          <span className="mt-0.5 block text-[11px] font-semibold tracking-[0.13em] text-sky-700 uppercase">
            AttendX
          </span>
        </span>
      </a>

      <div className="mb-3 flex items-center justify-between px-3">
        <span className="text-[10px] font-bold tracking-[0.16em] text-slate-400 uppercase">
          Workspace
        </span>
        <button
          type="button"
          aria-label="Select workspace"
          className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <ChevronDown aria-hidden="true" className="size-3.5" />
        </button>
      </div>

      <nav aria-label="Main navigation" className="flex-1">
        <ul className="space-y-1">
          {navigationItems.map(({ label, href, icon: Icon }) => {
            const isActive = activeItem === label

            return (
              <li key={label}>
                <a
                  href={href}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => onNavigate?.(label)}
                  className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium outline-none transition-all focus-visible:ring-2 focus-visible:ring-sky-500 ${
                    isActive
                      ? 'bg-sky-50 text-sky-700 shadow-[inset_2px_0_0_#0284c7]'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon
                    aria-hidden="true"
                    className={`size-[18px] shrink-0 transition-colors ${
                      isActive
                        ? 'text-sky-600'
                        : 'text-slate-400 group-hover:text-slate-600'
                    }`}
                    strokeWidth={1.8}
                  />
                  <span>{label}</span>
                  {label === 'Live Monitoring' && (
                    <span
                      aria-label="Live"
                      className="ml-auto size-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"
                    />
                  )}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      <section
        aria-label="System status"
        className="mt-5 rounded-xl border border-sky-100 bg-sky-50/70 p-3.5"
      >
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
          </span>
          <span className="text-xs font-semibold text-slate-800">System Online</span>
        </div>
        <p className="mt-2 pl-[18px] text-[11px] leading-4 text-slate-500">
          All services are operational
        </p>
      </section>
    </aside>
  )
}

export default Sidebar