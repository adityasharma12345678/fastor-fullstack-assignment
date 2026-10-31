import { Link } from 'react-router-dom'

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      className="restaurant-card"
      to={`/restaurants/${encodeURIComponent(restaurant.restaurant_id)}`}
      state={{ restaurant }}
      aria-label={`View ${restaurant.restaurant_name}`}
    >
      <div className="restaurant-card-media">
        {restaurant.logo ? (
          <img
            src={restaurant.logo}
            alt=""
            loading="lazy"
            onError={(event) => {
              event.currentTarget.hidden = true
              event.currentTarget.nextElementSibling.hidden = false
            }}
          />
        ) : null}
        <span className="restaurant-fallback" hidden aria-hidden="true">
          {restaurant.restaurant_name?.[0]?.toUpperCase() || 'R'}
        </span>
        {!restaurant.logo && (
          <span className="restaurant-fallback" aria-hidden="true">
            {restaurant.restaurant_name?.[0]?.toUpperCase() || 'R'}
          </span>
        )}
        <span className="media-arrow" aria-hidden="true">
          ↗
        </span>
      </div>
      <div className="restaurant-card-content">
        <div className="restaurant-card-heading">
          <h2>{restaurant.restaurant_name}</h2>
          <span className="restaurant-id">#{restaurant.restaurant_id}</span>
        </div>
        <p>{restaurant.address_complete || 'Address not provided'}</p>
        <span className="card-link-label">Restaurant details <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  )
}
