import {
  ArrowLeft,
  Camera,
  Check,
  CircleHelp,
  Clock3,
  MapPin,
  ScanFace,
  ShieldAlert,
  UserRoundSearch,
  Users,
  Video,
} from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CameraPreview from '../components/camera/CameraPreview'
import {
  cameraSourceLabels,
  cameras,
  type CameraConfig,
  type CameraPreviewState,
  type CameraStatus,
} from '../types/camera'

type ActivityEntry = {
  time: string
  action: string
}

const demoActivity: ActivityEntry[] = [
  { time: '03:02 PM', action: 'Camera started' },
  { time: '02:58 PM', action: 'Camera stopped' },
  { time: '02:45 PM', action: 'Camera permission checked' },
]

const previewStatus: Record<CameraPreviewState, CameraStatus> = {
  idle: 'ready',
  starting: 'starting',
  active: 'online',
  stopped: 'ready',
  'permission-denied': 'permission-denied',
  unavailable: 'unavailable',
  error: 'error',
}

const statusStyles: Record<CameraStatus, { label: string; className: string }> = {
  ready: {
    label: 'Ready',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  online: {
    label: 'Online',
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  offline: {
    label: 'Offline',
    className: 'border-orange-200 bg-orange-50 text-orange-700',
  },
  starting: {
    label: 'Starting',
    className: 'border-sky-200 bg-sky-50 text-sky-700',
  },
  'permission-denied': {
    label: 'Permission denied',
    className: 'border-orange-200 bg-orange-50 text-orange-700',
  },
  unavailable: {
    label: 'Unavailable',
    className: 'border-orange-200 bg-orange-50 text-orange-700',
  },
  error: {
    label: 'Error',
    className: 'border-rose-200 bg-rose-50 text-rose-700',
  },
}

const statusDotStyles: Record<CameraStatus, string> = {
  ready: 'bg-emerald-500',
  online: 'bg-emerald-500',
  offline: 'bg-orange-500',
  starting: 'bg-sky-500',
  'permission-denied': 'bg-orange-500',
  unavailable: 'bg-orange-500',
  error: 'bg-rose-500',
}

function getCamera(cameraId: string | undefined): CameraConfig | undefined {
  return cameras.find((camera) => camera.id === cameraId)
}

function CameraNotFound() {
  return (
    <div className="mx-auto flex min-h-[55vh] w-full max-w-7xl items-center justify-center">
      <section className="w-full max-w-md rounded-xl border border-slate-200/80 bg-white p-8 text-center shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
        <span className="mx-auto flex size-12 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
          <Camera aria-hidden="true" className="size-6" />
        </span>
        <h1 className="mt-4 text-lg font-semibold text-slate-900">
          Camera not found
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          This camera may have been removed or the ID is invalid.
        </p>
        <Link
          to="/cameras"
          className="mt-5 inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-sky-600 px-4 text-xs font-semibold text-white outline-none transition-colors hover:bg-sky-700 focus-visible:ring-4 focus-visible:ring-sky-200"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Cameras
        </Link>
      </section>
    </div>
  )
}

function CameraDetail() {
  const { cameraId } = useParams<{ cameraId: string }>()
  return <CameraDetailPage key={cameraId} cameraId={cameraId} />
}

function CameraDetailPage({ cameraId }: { cameraId: string | undefined }) {
  const camera = getCamera(cameraId)
  const [previewState, setPreviewState] = useState<CameraPreviewState>('idle')
  const [lastActivity, setLastActivity] = useState('Not started')

  if (!camera) {
    return <CameraNotFound />
  }

  const isWebcam = camera.sourceType === 'webcam'
  const cameraStatus = isWebcam ? previewStatus[previewState] : 'offline'
  const statusStyle = statusStyles[cameraStatus]
  const activity = isWebcam ? demoActivity : []

  const handlePreviewStateChange = (
    state: CameraPreviewState,
    activityLabel: string,
  ) => {
    setPreviewState(state)
    setLastActivity(activityLabel)
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <header className="mb-6">
        <Link
          to="/cameras"
          className="inline-flex items-center gap-1.5 rounded-md text-xs font-medium text-slate-500 outline-none transition-colors hover:text-sky-700 focus-visible:ring-2 focus-visible:ring-sky-500"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to Cameras
        </Link>
        <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
              {camera.name}
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              {camera.id} <span aria-hidden="true">•</span> {camera.location}
            </p>
          </div>
          <span
            className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold ${statusStyle.className}`}
          >
            <span
              aria-hidden="true"
              className={`size-1.5 rounded-full ${statusDotStyles[cameraStatus]}`}
            />
            {statusStyle.label}
          </span>
        </div>
      </header>

      <section
        aria-label="Camera preview and information"
        className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)]"
      >
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
          <header className="mb-4 flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Camera Preview
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                {camera.location} <span aria-hidden="true">•</span>{' '}
                {cameraSourceLabels[camera.sourceType]}
              </p>
            </div>
            {isWebcam && previewState === 'active' && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Camera Online
              </span>
            )}
          </header>
          <CameraPreview
            key={camera.id}
            camera={camera}
            onStateChange={handlePreviewStateChange}
          />
          <p className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-400">
            <ShieldAlert aria-hidden="true" className="size-3.5" />
            {isWebcam
              ? 'Local browser preview only. Video is not recorded or uploaded.'
              : 'This source adapter is not connected. No live stream is shown.'}
          </p>
        </article>

        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
          <header className="mb-4">
            <h2 className="text-sm font-semibold text-slate-900">
              Camera Information
            </h2>
          </header>
          <dl className="divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-xs text-slate-500">Camera ID</dt>
              <dd className="text-xs font-medium text-slate-700">{camera.id}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-xs text-slate-500">Name</dt>
              <dd className="text-right text-xs font-medium text-slate-700">
                {camera.name}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin aria-hidden="true" className="size-3.5" />
                Location
              </dt>
              <dd className="text-right text-xs font-medium text-slate-700">
                {camera.location}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-xs text-slate-500">Type</dt>
              <dd className="text-xs font-medium text-slate-700">{camera.type}</dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-xs text-slate-500">Source Type</dt>
              <dd className="text-xs font-medium text-slate-700">
                {cameraSourceLabels[camera.sourceType]}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-xs text-slate-500">Status</dt>
              <dd
                className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-semibold ${statusStyle.className}`}
              >
                <span
                  aria-hidden="true"
                  className={`size-1.5 rounded-full ${statusDotStyles[cameraStatus]}`}
                />
                {statusStyle.label}
              </dd>
            </div>
            <div className="flex items-center justify-between gap-4 py-3">
              <dt className="text-xs text-slate-500">Last Activity</dt>
              <dd className="text-right text-xs font-medium text-slate-700">
                {isWebcam ? lastActivity : camera.lastActivity}
              </dd>
            </div>
          </dl>
        </article>
      </section>

      <section
        aria-label="Monitoring and recent camera activity"
        className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2"
      >
        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
          <header className="mb-3">
            <h2 className="text-sm font-semibold text-slate-900">Monitoring</h2>
            <p className="mt-1 text-xs text-slate-500">
              Processing services are not connected
            </p>
          </header>
          <dl className="divide-y divide-slate-100">
            <div className="flex items-center justify-between gap-3 py-3">
              <dt className="flex items-center gap-2 text-xs text-slate-600">
                <UserRoundSearch
                  aria-hidden="true"
                  className="size-4 text-slate-400"
                />
                Person Detection
              </dt>
              <dd className="inline-flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                <CircleHelp aria-hidden="true" className="size-3.5" />
                Not connected
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <dt className="flex items-center gap-2 text-xs text-slate-600">
                <Users aria-hidden="true" className="size-4 text-slate-400" />
                Tracking
              </dt>
              <dd className="text-[11px] font-medium text-slate-500">
                Not connected
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <dt className="flex items-center gap-2 text-xs text-slate-600">
                <ScanFace aria-hidden="true" className="size-4 text-slate-400" />
                Face Recognition
              </dt>
              <dd className="text-[11px] font-medium text-slate-500">
                Not connected
              </dd>
            </div>
            <div className="flex items-center justify-between gap-3 py-3">
              <dt className="flex items-center gap-2 text-xs text-slate-600">
                <Video aria-hidden="true" className="size-4 text-slate-400" />
                Recording
              </dt>
              <dd className="text-[11px] font-medium text-slate-500">
                Disabled
              </dd>
            </div>
          </dl>
        </article>

        <article className="rounded-xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,0.035)]">
          <header className="mb-3 flex items-start justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Recent Activity
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Camera events and status updates
              </p>
            </div>
            {activity.length > 0 && (
              <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[10px] font-medium text-slate-500">
                Demo events
              </span>
            )}
          </header>
          {activity.length > 0 ? (
            <ul className="divide-y divide-slate-100">
              {activity.map((entry) => (
                <li
                  key={`${entry.time}-${entry.action}`}
                  className="flex items-start gap-3 py-3"
                >
                  <span className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                    <Clock3 aria-hidden="true" className="size-3.5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-slate-700">
                      {entry.action}
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-500">
                      {camera.name}
                    </p>
                  </div>
                  <time className="shrink-0 pt-0.5 text-[10px] tabular-nums text-slate-400">
                    {entry.time}
                  </time>
                </li>
              ))}
            </ul>
          ) : (
            <div className="flex min-h-36 flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60 px-4 text-center">
              <Check aria-hidden="true" className="size-5 text-slate-300" />
              <p className="mt-2 text-xs font-medium text-slate-600">
                No activity yet
              </p>
              <p className="mt-1 text-[11px] text-slate-400">
                Activity will appear when this source is connected.
              </p>
            </div>
          )}
          {activity.length > 0 && (
            <p className="mt-2 text-[10px] text-slate-400">
              Demo/UI events only; application logging is not configured.
            </p>
          )}
        </article>
      </section>
    </div>
  )
}

export default CameraDetail
