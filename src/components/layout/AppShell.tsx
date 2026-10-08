import type { ReactNode } from 'react'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

type AppShellProps = {
  children: ReactNode
  contentClassName?: string
}

function AppShell({ children, contentClassName = '' }: AppShellProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="fixed inset-y-0 left-0 z-30 w-64">
        <Sidebar />
      </div>

      <div className="ml-64 flex min-h-screen min-w-0 flex-col">
        <div className="sticky top-0 z-20">
          <Topbar />
        </div>
        <main
          className={`min-h-[calc(100vh-68px)] flex-1 bg-slate-50/80 p-4 sm:p-6 lg:p-8 ${contentClassName}`}
        >
          {children}
        </main>
      </div>
    </div>
  )
}

export default AppShell