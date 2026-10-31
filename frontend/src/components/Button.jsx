import Spinner from './Spinner.jsx'

export default function Button({ children, loading = false, className = '', disabled = false, ...props }) {
  return (
    <button className={`button ${className}`} disabled={loading || disabled} {...props}>
      {loading ? <Spinner /> : children}
    </button>
  )
}
