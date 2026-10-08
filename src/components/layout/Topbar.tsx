import { Bell, CalendarDays, ChevronDown, Search } from 'lucide-react'

type TopbarProps = {
  searchValue?: string
  onSearchChange?: (value: string) => void
  currentDate?: Date
  onDateSelect?: () => void
  onNotificationsClick?: () => void
  onProfileClick?: () => void
  userName?: string
  userInitials?: string
}

function Topbar({
  searchValue,
  onSearchChange,
  currentDate = new Date(),
  onDateSelect,
  onNotificationsClick,
  onProfileClick,
  userName = 'Abdullah Zahid',
  userInitials = 'AZ',
}: TopbarProps) {
  const dateLabel = new Intl.DateTimeFormat('en', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(currentDate)

  return (
    <header className="flex h-[68px] w-full shrink-0 items-center justify-between gap-4 border-b border-slate-200/80 bg-white px-5 shadow-[0_2px_10px_rgba(15,23,42,0.025)] sm:px-7">
      <label className="relative flex min-w-0 max-w-md flex-1 items-center">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3.5 size-[17px] text-slate-400"
          strokeWidth={1.9}
        />
        <span className="sr-only">Search employees</span>
        <input
          type="search"
          placeholder="Search employees..."
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          className="h-10 w-full rounded-lg border border-slate-200 bg-slate-50/70 pl-10 pr-4 text-[13px] text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
        />
      </label>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onDateSelect}
          aria-label={`Select date, ${dateLabel}`}
          className="hidden h-10 items-center gap-2 rounded-lg px-3 text-[13px] font-medium text-slate-600 outline-none transition-colors hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500 sm:flex"
        >
          <CalendarDays aria-hidden="true" className="size-[17px] text-sky-600" strokeWidth={1.8} />
          <span>{dateLabel}</span>
          <ChevronDown aria-hidden="true" className="ml-0.5 size-3.5 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={onNotificationsClick}
          aria-label="Notifications"
          className="relative flex size-10 items-center justify-center rounded-lg text-slate-500 outline-none transition-colors hover:bg-sky-50 hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <Bell aria-hidden="true" className="size-[19px]" strokeWidth={1.8} />
          <span
            aria-label="Unread notifications"
            className="absolute right-[9px] top-[8px] size-2 rounded-full border-2 border-white bg-sky-500"
          />
        </button>

        <span aria-hidden="true" className="mx-1 hidden h-8 w-px bg-slate-200 sm:block" />

        <button
          type="button"
          onClick={onProfileClick}
          aria-label={`Profile for ${userName}`}
          className="group flex items-center gap-2.5 rounded-lg py-1.5 pl-1.5 pr-1 outline-none transition-colors hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-500 sm:gap-3 sm:pr-2"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold tracking-wide text-sky-700 ring-1 ring-inset ring-sky-200/70">
            {userInitials}
          </span>
          <span className="hidden text-left sm:block">
            <span className="block max-w-40 truncate text-[13px] font-semibold text-slate-800">
              {userName}
            </span>
            <span className="mt-0.5 block text-[11px] text-slate-500">Administrator</span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className="hidden size-4 text-slate-400 transition-colors group-hover:text-slate-600 sm:block"
          />
        </button>
      </div>
    </header>
  )
}

export default Topbar