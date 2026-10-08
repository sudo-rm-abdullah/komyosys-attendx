import {
  Camera,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MoreHorizontal,
  Plus,
  Search,
  Users,
  Wifi,
  WifiOff,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  cameraSourceLabels,
  cameras,
  type CameraConfig,
  type CameraStatus,
} from '../types/camera'

type CameraMetricTone = 'blue' | 'green' | 'orange'

type CameraMetric = {
  label: string
  value: string
  supportingText: string
  tone: CameraMetricTone
  icon: LucideIcon
}

const cameraMetrics: CameraMetric[] = [
  {
    label: 'Total Cameras',
    value: '4',
    supportingText: 'Across 4 monitoring sources',
    tone: 'blue',
    icon: Camera,
  },
  {
    label: 'Online',
    value: '3',
    supportingText: '75% operational',
    tone: 'green',
    icon: Wifi,
  },
  {
    label: 'Offline',
    value: '1',
    supportingText: 'Needs attention',
    tone: 'orange',
    icon: WifiOff,
  },
  {
    label: 'People Detected',
    value: '16',
    supportingText: 'Across active cameras',
    tone: 'blue',
    icon: Users,
  },
]

const metricToneStyles: Record<CameraMetricTone, { icon: string; dot: string }> = {
  blue: { icon: 'bg-sky-50 text-sky-600', dot: 'bg-sky-500' },
  green: { icon: 'bg-emerald-50 text-emerald-600', dot: 'bg-emerald-500' },
  orange: { icon: 'bg-orange-50 text-orange-600', dot: 'bg-orange-500' },
}

const cameraStatusStyles: Record<
  CameraStatus,
  { label: string; badge: string; dot: string }
> = {
  ready: {
    label: 'Ready',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  online: {
    label: 'Online',
    badge: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    dot: 'bg-emerald-500',
  },
  offline: {
    label: 'Offline',
    badge: 'border-orange-200 bg-orange-50 text-orange-700',
    dot: 'bg-orange-500',
  },
  starting: {
    label: 'Starting',
    badge: 'border-sky-200 bg-sky-50 text-sky-700',
    dot: 'bg-sky-500',
  },
  'permission-denied': {
    label: 'Permission denied',
    badge: 'border-orange-200 bg-orange-50 text-orange-700',
    dot: 'bg-orange-500',
  },
  unavailable: {
    label: 'Unavailable',
    badge: 'border-orange-200 bg-orange-50 text-orange-700',
    dot: 'bg-orange-500',
  },
  error: {
    label: 'Error',
    badge: 'border-rose-200 bg-rose-50 text-rose-700',
    dot: 'bg-rose-500',
  },
}

function CameraMetricCard({
  label,
  value,
  supportingText,
  tone,
  icon: Icon,
}: CameraMetric) {
  return (
    <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)] transition-shadow hover:shadow-[0_5px_18px_rgba(15,23,42,0.07)]">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[13px] font-medium text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">
            {value}
          </p>
        </div>
        <span
          className={`flex size-10 items-center justify-center rounded-lg ${metricToneStyles[tone].icon}`}
        >
          <Icon aria-hidden="true" className="size-[19px]" strokeWidth={1.9} />
        </span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <span
          aria-hidden="true"
          className={`size-1.5 rounded-full ${metricToneStyles[tone].dot}`}
        />
        <p className="text-xs text-slate-500">{supportingText}</p>
      </div>
    </article>
  )
}

function CameraRow({ camera }: { camera: CameraConfig }) {
  const statusStyle = cameraStatusStyles[camera.status]

  return (
    <tr className="transition-colors hover:bg-slate-50/70">
      <td className="whitespace-nowrap px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <Camera aria-hidden="true" className="size-[17px]" />
          </span>
          <div>
            <Link
              to={`/cameras/${camera.id}`}
              className="rounded-sm text-xs font-semibold text-slate-800 outline-none transition-colors hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              {camera.name}
            </Link>
            <p className="mt-0.5 text-[10px] font-medium text-slate-400">
              {camera.id}
            </p>
          </div>
        </div>
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <span className="flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin aria-hidden="true" className="size-3.5 text-slate-400" />
          {camera.location}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-600">
        {camera.type}
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
          {cameraSourceLabels[camera.sourceType]}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${statusStyle.badge}`}
        >
          <span
            aria-hidden="true"
            className={`size-1.5 rounded-full ${statusStyle.dot}`}
          />
          {statusStyle.label}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3">
        <span className="flex items-center gap-1.5 text-xs tabular-nums text-slate-600">
          <Users aria-hidden="true" className="size-3.5 text-slate-400" />
          {camera.peopleDetected}
        </span>
      </td>
      <td className="whitespace-nowrap px-4 py-3 text-xs text-slate-500">
        {camera.lastActivity}
      </td>
      <td className="whitespace-nowrap px-5 py-3 text-right">
        <button
          type="button"
          aria-label={`Actions for ${camera.name}`}
          className="inline-flex size-8 items-center justify-center rounded-lg text-slate-400 outline-none transition-colors hover:bg-slate-100 hover:text-slate-700 focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <MoreHorizontal aria-hidden="true" className="size-[18px]" />
        </button>
      </td>
    </tr>
  )
}

function Cameras() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
            Cameras
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage camera sources and monitoring locations
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-fit items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-xs font-semibold text-white shadow-sm shadow-sky-200 outline-none transition-colors hover:bg-sky-700 focus-visible:ring-4 focus-visible:ring-sky-200"
        >
          <Plus aria-hidden="true" className="size-4" strokeWidth={2} />
          Add Camera
        </button>
      </header>

      <section
        aria-label="Camera summary"
        className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4"
      >
        {cameraMetrics.map((metric) => (
          <CameraMetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section
        aria-label="Camera filters"
        className="mt-6 rounded-xl border border-slate-200/80 bg-white p-3 shadow-[0_2px_10px_rgba(15,23,42,0.035)] sm:p-3.5"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          <label className="relative block min-w-0">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            />
            <span className="sr-only">Search cameras</span>
            <input
              type="search"
              placeholder="Search cameras..."
              className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            />
          </label>
          <label className="min-w-0">
            <span className="sr-only">Filter by location</span>
            <select
              defaultValue=""
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              <option value="">All locations</option>
              <option>Development Laptop</option>
              <option>Main Entrance</option>
              <option>Reception</option>
              <option>Engineering Floor</option>
            </select>
          </label>
          <label className="min-w-0">
            <span className="sr-only">Filter by camera status</span>
            <select
              defaultValue=""
              className="h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-xs text-slate-600 outline-none transition hover:border-slate-300 focus:border-sky-400 focus:ring-4 focus:ring-sky-100"
            >
              <option value="">All statuses</option>
              <option>Online</option>
              <option>Offline</option>
            </select>
          </label>
        </div>
      </section>

      <section
        aria-labelledby="camera-directory-title"
        className="mt-6 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,0.035)]"
      >
        <header className="px-5 py-4">
          <h2
            id="camera-directory-title"
            className="text-sm font-semibold text-slate-900"
          >
            Camera Directory
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Connected and available monitoring sources
          </p>
        </header>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px] border-collapse text-left">
            <thead>
              <tr className="border-y border-slate-100 bg-slate-50/70">
                <th className="px-5 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Camera
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Location
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Type
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Source
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  People Detected
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Last Activity
                </th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold tracking-[0.1em] text-slate-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {cameras.map((camera) => (
                <CameraRow key={camera.id} camera={camera} />
              ))}
            </tbody>
          </table>
        </div>
        <footer className="flex flex-col gap-3 border-t border-slate-100 px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-slate-500">
            Showing <span className="font-medium text-slate-700">4</span> of{' '}
            <span className="font-medium text-slate-700">4</span> cameras
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

export default Cameras
