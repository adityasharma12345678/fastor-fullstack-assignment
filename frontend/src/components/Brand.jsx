import { Link } from 'react-router-dom'
import fastorMark from '../assets/fastor-mark.svg'

export default function Brand({ compact = false }) {
  return (
    <Link className={`brand${compact ? ' brand--compact' : ''}`} to="/" aria-label="Fastor home">
      <img className="brand-mark" src={fastorMark} alt="" />
      <span className="brand-word">fastor</span>
    </Link>
  )
}
