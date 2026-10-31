import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import ToastContext from './ToastContext.js'

export default function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)
  const timeoutRef = useRef(null)
  const notify = useCallback((message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    window.clearTimeout(timeoutRef.current)
    timeoutRef.current = window.setTimeout(() => setToast(null), 3600)
  }, [])
  const value = useMemo(() => ({ notify }), [notify])

  useEffect(() => () => window.clearTimeout(timeoutRef.current), [])

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast && (
        <div className={`toast toast--${toast.type}`} role="status" key={toast.id}>
          <span className="toast-dot" aria-hidden="true" />
          {toast.message}
          <button className="toast-close" onClick={() => setToast(null)} aria-label="Dismiss notification">
            ×
          </button>
        </div>
      )}
    </ToastContext.Provider>
  )
}
