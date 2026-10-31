import { Link } from 'react-router-dom'
import Brand from '../components/Brand.jsx'

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <Brand />
      <div className="not-found-content">
        <span className="not-found-number">404</span>
        <p className="eyebrow">Wrong turn?</p>
        <h1>This page isn’t on the menu.</h1>
        <p>Let’s get you back to somewhere good.</p>
        <Link to="/" className="button">Back to Fastor <span aria-hidden="true">→</span></Link>
      </div>
      <span className="not-found-spark" aria-hidden="true">✳</span>
    </main>
  )
}
