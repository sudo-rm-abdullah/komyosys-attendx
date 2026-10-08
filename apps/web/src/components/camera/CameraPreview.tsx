import { Camera, CircleStop, Play, Video } from 'lucide-react'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { CameraConfig, CameraPreviewState } from '../../types/camera'

type CameraPreviewProps = {
  camera: CameraConfig
  compact?: boolean
  peopleDetected?: number
  onStateChange?: (state: CameraPreviewState, lastActivity: string) => void
}

const futureSourceCopy = {
  usb: {
    title: 'USB camera support',
    description: 'Camera adapter not connected yet.',
  },
  rtsp: {
    title: 'RTSP camera',
    description: 'RTSP stream integration will be connected through the backend.',
  },
  http: {
    title: 'HTTP camera stream',
    description: 'HTTP stream integration is not configured yet.',
  },
  'video-file': {
    title: 'Video file',
    description: 'Video file testing will be supported later.',
  },
} as const

function getCameraError(error: unknown): {
  state: CameraPreviewState
  message: string
} {
  if (error instanceof DOMException) {
    if (error.name === 'NotAllowedError' || error.name === 'SecurityError') {
      return {
        state: 'permission-denied',
        message: 'Allow camera access in your browser to start the preview.',
      }
    }
    if (
      error.name === 'NotFoundError' ||
      error.name === 'DevicesNotFoundError' ||
      error.name === 'OverconstrainedError'
    ) {
      return {
        state: 'unavailable',
        message: 'No compatible camera device is available.',
      }
    }
  }

  return {
    state: 'error',
    message:
      error instanceof Error
        ? error.message
        : 'The camera preview could not be started.',
  }
}

function CameraPreview({
  camera,
  compact = false,
  peopleDetected,
  onStateChange,
}: CameraPreviewProps) {
  const [state, setState] = useState<CameraPreviewState>('idle')
  const [errorMessage, setErrorMessage] = useState('')
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mountedRef = useRef(false)

  const reportState = useCallback(
    (nextState: CameraPreviewState, lastActivity: string) => {
      if (!mountedRef.current) return
      setState(nextState)
      onStateChange?.(nextState, lastActivity)
    },
    [onStateChange],
  )

  const releaseStream = useCallback(() => {
    const stream = streamRef.current
    streamRef.current = null
    stream?.getTracks().forEach((track) => track.stop())

    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.srcObject = null
    }
  }, [])

  useLayoutEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      releaseStream()
    }
  }, [releaseStream])

  const startCamera = async () => {
    setErrorMessage('')
    reportState('starting', 'Starting camera')

    if (!navigator.mediaDevices?.getUserMedia) {
      setErrorMessage('Camera access is not available in this browser or context.')
      reportState('unavailable', 'Camera unavailable')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      })

      if (!mountedRef.current) {
        stream.getTracks().forEach((track) => track.stop())
        return
      }

      streamRef.current = stream
      if (!videoRef.current) {
        releaseStream()
        setErrorMessage('The video preview could not be initialized.')
        reportState('error', 'Camera preview error')
        return
      }

      videoRef.current.srcObject = stream
      await videoRef.current.play()
      reportState('active', 'Camera started just now')
    } catch (error: unknown) {
      releaseStream()
      const cameraError = getCameraError(error)
      setErrorMessage(cameraError.message)
      reportState(
        cameraError.state,
        cameraError.state === 'permission-denied'
          ? 'Camera permission denied'
          : cameraError.state === 'unavailable'
            ? 'Camera unavailable'
            : 'Camera error',
      )
    }
  }

  const stopCamera = () => {
    releaseStream()
    setErrorMessage('')
    reportState('stopped', 'Camera stopped just now')
  }

  if (camera.sourceType !== 'webcam') {
    const copy = futureSourceCopy[camera.sourceType]
    return (
      <div
        className={`relative flex items-center justify-center overflow-hidden rounded-lg border border-slate-800 bg-slate-950 px-6 py-10 ${
          compact ? 'min-h-64' : 'min-h-[320px]'
        }`}
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:32px_32px]"
        />
        <div className="relative flex max-w-sm flex-col items-center text-center">
          <span className="mb-3 flex size-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-sky-400">
            <Video aria-hidden="true" className="size-6" strokeWidth={1.6} />
          </span>
          <p className="text-sm font-medium text-slate-200">{copy.title}</p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {copy.description}
          </p>
          <span className="mt-4 rounded-full border border-slate-700 bg-slate-900/80 px-2.5 py-1 text-[10px] font-medium text-slate-400">
            {camera.sourceType === 'video-file'
              ? 'Video File'
              : camera.sourceType.toUpperCase()}{' '}
            adapter not connected
          </span>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`relative overflow-hidden rounded-lg border border-slate-800 bg-slate-950 ${
        compact ? 'min-h-64' : 'min-h-[320px]'
      }`}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        aria-label={`${camera.name} live camera preview`}
        className={`absolute inset-0 size-full object-cover ${
          state === 'active' ? 'block' : 'hidden'
        }`}
      />
      {state !== 'active' && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(148,163,184,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.22)_1px,transparent_1px)] [background-size:32px_32px]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.12),transparent_65%)]"
          />
          <div
            className={`relative flex flex-col items-center justify-center px-6 py-10 text-center ${
              compact ? 'min-h-64' : 'min-h-[320px]'
            }`}
          >
            <span className="mb-3 flex size-12 items-center justify-center rounded-xl border border-slate-700 bg-slate-900/80 text-sky-400">
              <Camera aria-hidden="true" className="size-6" strokeWidth={1.6} />
            </span>
            <p className="text-sm font-medium text-slate-200">
              {state === 'starting'
                ? 'Starting camera...'
                : state === 'permission-denied'
                  ? 'Camera permission denied'
                  : state === 'unavailable'
                    ? 'Camera unavailable'
                    : state === 'error'
                      ? 'Camera error'
                      : 'Camera preview'}
            </p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
              {errorMessage ||
                (state === 'starting'
                  ? 'Connecting to the selected webcam.'
                  : 'Start camera to begin')}
            </p>
            <button
              type="button"
              onClick={startCamera}
              disabled={state === 'starting'}
              className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-sky-600 px-3.5 text-xs font-semibold text-white outline-none transition-colors hover:bg-sky-700 disabled:cursor-wait disabled:opacity-70 focus-visible:ring-4 focus-visible:ring-sky-200"
            >
              <Play aria-hidden="true" className="size-3.5" fill="currentColor" />
              {state === 'starting' ? 'Starting camera...' : 'Start Camera'}
            </button>
          </div>
        </>
      )}
      {state === 'active' && (
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-slate-950/70 px-2.5 py-1.5 text-[10px] font-semibold text-emerald-300 backdrop-blur-sm">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Camera Online
          </span>
          <span className="rounded-md bg-rose-600/90 px-2 py-1.5 text-[10px] font-bold tracking-wide text-white">
            LIVE
          </span>
        </div>
      )}
      {peopleDetected !== undefined && state !== 'active' && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-slate-950/75 px-4 py-2.5 backdrop-blur-sm">
          <span className="text-[11px] text-slate-400">
            People detected
          </span>
          <span className="text-xs font-semibold text-white">
            {peopleDetected}
          </span>
        </div>
      )}
      {state === 'active' && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t border-white/10 bg-slate-950/75 px-4 py-2.5 backdrop-blur-sm">
          <span className="text-[11px] text-slate-400">
            {peopleDetected !== undefined
              ? `People detected: ${peopleDetected}`
              : 'Local preview only · no recording'}
          </span>
          <button
            type="button"
            onClick={stopCamera}
            className="inline-flex h-8 items-center gap-1.5 rounded-md border border-white/15 bg-slate-900/80 px-2.5 text-[11px] font-medium text-slate-200 outline-none transition-colors hover:bg-slate-800 focus-visible:ring-2 focus-visible:ring-sky-400"
          >
            <CircleStop aria-hidden="true" className="size-3.5" />
            Stop Camera
          </button>
        </div>
      )}
    </div>
  )
}

export default CameraPreview
