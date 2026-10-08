import AppShell from './components/layout/AppShell'

function App() {
  return (
    <AppShell>
      <section className="mx-auto max-w-5xl rounded-2xl border border-sky-100 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold tracking-[0.14em] text-sky-700 uppercase">
          Komyosys AttendX
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
          Attendance &amp; Workplace Intelligence
        </h1>
        <p className="mt-3 text-sm text-slate-500">Dashboard coming next.</p>
      </section>
    </AppShell>
  )
}

export default App
