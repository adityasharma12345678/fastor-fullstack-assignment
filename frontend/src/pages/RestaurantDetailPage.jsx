import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import Spinner from '../components/Spinner.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { getRestaurants } from '../services/fastorApi.js'

export default function RestaurantDetailPage() {
  const { id } = useParams()
  const { state } = useLocation()
  const initialRestaurant = String(state?.restaurant?.restaurant_id) === id ? state.restaurant : null
  const [restaurant, setRestaurant] = useState(initialRestaurant)
  const [loading, setLoading] = useState(!initialRestaurant)
  const [error, setError] = useState('')

  useEffect(() => {
    if (restaurant?.restaurant_id === id) return
    let active = true
    getRestaurants(118)
      .then((items) => {
        if (!active) return
        const found = items.find((item) => String(item.restaurant_id) === id)
        if (found) setRestaurant(found)
        else setError('This restaurant is not in the current listing.')
      })
      .catch((requestError) => {
        if (active) setError(requestError.message)
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [id, restaurant?.restaurant_id])

  return (
    <AppLayout mainClass="detail-main">
      <Link to="/restaurants" className="back-link"><span aria-hidden="true">←</span> All restaurants</Link>
      {loading ? (
        <div className="detail-loading"><Spinner label="Loading restaurant details" /><span>Loading restaurant details…</span></div>
      ) : error ? (
        <section className="state-card state-card--error detail-state">
          <span className="state-icon" aria-hidden="true">!</span>
          <p className="eyebrow">Restaurant unavailable</p>
          <h1>We couldn’t find this place.</h1>
          <p>{error}</p>
          <Link to="/restaurants" className="button button--small">Back to restaurants <span aria-hidden="true">→</span></Link>
        </section>
      ) : restaurant ? (
        <>
          <div className="detail-breadcrumb">RESTAURANTS <span>/</span> DETAILS</div>
          <section className="detail-card">
            <div className="detail-image">
              {restaurant.logo && (
                <img
                  src={restaurant.logo}
                  alt={`${restaurant.restaurant_name} logo`}
                  onError={(event) => {
                    event.currentTarget.hidden = true
                    event.currentTarget.nextElementSibling.hidden = false
                  }}
                />
              )}
              <span className="detail-fallback" aria-hidden="true" hidden={Boolean(restaurant.logo)}>
                {restaurant.restaurant_name?.[0]?.toUpperCase() || 'R'}
              </span>
              <span className="detail-image-label">A place to make a moment</span>
            </div>
            <div className="detail-copy">
              <p className="eyebrow">Good to know</p>
              <h1>{restaurant.restaurant_name}</h1>
              <p className="detail-address">{restaurant.address_complete || 'Address not provided'}</p>
              <div className="detail-meta">
                <span className="meta-label">RESTAURANT ID</span>
                <span className="meta-value">#{restaurant.restaurant_id}</span>
              </div>
              <div className="detail-notice">
                <span className="notice-spark" aria-hidden="true">✳</span>
                <p><strong>Just the essentials.</strong><br />Menu and ordering details aren’t available for this restaurant yet.</p>
              </div>
              <Link to="/restaurants" className="button detail-back-button"><span aria-hidden="true">←</span> Back to restaurants</Link>
            </div>
          </section>
        </>
      ) : null}
    </AppLayout>
  )
}
