export type CameraSourceType =
  | 'webcam'
  | 'usb'
  | 'rtsp'
  | 'http'
  | 'video-file'

export type CameraStatus =
  | 'ready'
  | 'online'
  | 'offline'
  | 'starting'
  | 'permission-denied'
  | 'unavailable'
  | 'error'

export type CameraConfig = {
  id: string
  name: string
  location: string
  type: string
  sourceType: CameraSourceType
  status: CameraStatus
  peopleDetected: number
  lastActivity: string
}

export type CameraPreviewState =
  | 'idle'
  | 'starting'
  | 'active'
  | 'stopped'
  | 'permission-denied'
  | 'unavailable'
  | 'error'

export const developmentCamera: CameraConfig = {
  id: 'CAM-001',
  name: 'Development Camera',
  location: 'Development Laptop',
  type: 'Laptop Webcam',
  sourceType: 'webcam',
  status: 'ready',
  peopleDetected: 0,
  lastActivity: 'Not started',
}

export const cameras: CameraConfig[] = [
  developmentCamera,
  {
    id: 'CAM-002',
    name: 'Main Entrance',
    location: 'Main Entrance',
    type: 'IP Camera',
    sourceType: 'rtsp',
    status: 'offline',
    peopleDetected: 0,
    lastActivity: 'Not connected',
  },
  {
    id: 'CAM-003',
    name: 'Reception',
    location: 'Reception',
    type: 'IP Camera',
    sourceType: 'rtsp',
    status: 'offline',
    peopleDetected: 0,
    lastActivity: 'Not connected',
  },
  {
    id: 'CAM-004',
    name: 'Engineering Floor',
    location: 'Engineering Floor',
    type: 'USB Camera',
    sourceType: 'usb',
    status: 'offline',
    peopleDetected: 0,
    lastActivity: 'Not connected',
  },
]

export const cameraSourceLabels: Record<CameraSourceType, string> = {
  webcam: 'Webcam',
  usb: 'USB',
  rtsp: 'RTSP',
  http: 'HTTP',
  'video-file': 'Video File',
}
