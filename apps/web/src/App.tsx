import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import Attendance from './pages/Attendance'
import CameraDetail from './pages/CameraDetail'
import Cameras from './pages/Cameras'
import Dashboard from './pages/Dashboard'
import EmployeeDetail from './pages/EmployeeDetail'
import Employees from './pages/Employees'

function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/cameras" element={<Cameras />} />
          <Route path="/cameras/:cameraId" element={<CameraDetail />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/employees/:employeeId" element={<EmployeeDetail />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  )
}

export default App
