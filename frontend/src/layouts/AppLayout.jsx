import AppHeader from '../components/AppHeader.jsx'

export default function AppLayout({ children, mainClass }) {
  return (
    <div className="app-shell">
      <AppHeader />
      <main className={mainClass}>{children}</main>
    </div>
  )
}
