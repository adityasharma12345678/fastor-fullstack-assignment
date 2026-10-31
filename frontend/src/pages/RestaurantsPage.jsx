import { useCallback, useEffect, useMemo, useState } from 'react'
import RestaurantCard from '../components/RestaurantCard.jsx'
import RestaurantSkeleton from '../components/RestaurantSkeleton.jsx'
import AppLayout from '../layouts/AppLayout.jsx'
import { isFirebaseMode } from '../services/authMode.js'
import { getRestaurants } from '../services/fastorApi.js'

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState([])
  const [query, setQuery] = useState('')
  const [sortAZ, setSortAZ] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadRestaurants = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      setRestaurants(await getRestaurants(118))
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let active = true
    getRestaurants(118)
      .then((items) => {
        if (active) setRestaurants(items)
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
  }, [])

  const filteredRestaurants = useMemo(() => {
    const searchTerm = query.trim().toLocaleLowerCase()
    const filtered = restaurants.filter((restaurant) =>
      [restaurant.restaurant_name, restaurant.address_complete, restaurant.restaurant_id]
        .some((value) => String(value || '').toLocaleLowerCase().includes(searchTerm)),
    )
    return sortAZ
      ? [...filtered].sort((a, b) => a.restaurant_name.localeCompare(b.restaurant_name))
      : filtered
  }, [restaurants, query, sortAZ])

  return (
    <AppLayout mainClass="page-main">
      <div className="page-kicker"><span className="kicker-mark">✳</span> YOUR NEXT GOOD MEAL STARTS HERE</div>
      <section className="listing-intro">
        <div>
          <p className="eyebrow">A city full of flavour</p>
          <h1>Find your <em>favourite</em> place.</h1>
          <p className="listing-description">Explore the restaurants around you, and pick a place for whatever you’re in the mood for.</p>
        </div>
        <div className="listing-note"><span className="note-spark">✳</span><span>Good food<br />is a good idea.</span></div>
      </section>
      <section className="listing-toolbar" aria-label="Restaurant filters">
        <label className="search-field">
          <span className="search-icon" aria-hidden="true">⌕</span>
          <span className="sr-only">Search restaurants</span>
          <input
            type="search"
            placeholder="Search restaurants or locations"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && <button className="clear-search" onClick={() => setQuery('')} aria-label="Clear search">×</button>}
        </label>
        <button
          type="button"
          className={`sort-button${sortAZ ? ' sort-button--active' : ''}`}
          onClick={() => setSortAZ((current) => !current)}
          aria-pressed={sortAZ}
        >
          <span aria-hidden="true">↕</span> Name A–Z
        </button>
      </section>

      {loading ? (
        <>
          <div className="results-caption"><span>RESTAURANTS</span><span>Loading nearby places…</span></div>
          <div className="restaurant-grid">
            {Array.from({ length: 6 }, (_, index) => <RestaurantSkeleton key={index} />)}
          </div>
        </>
      ) : error ? (
        <section className="state-card state-card--error">
          <span className="state-icon" aria-hidden="true">!</span>
          <p className="eyebrow">{isFirebaseMode() ? 'Firebase demo session' : 'Connection trouble'}</p>
          <h2>
            {isFirebaseMode()
              ? 'You’re signed in. Restaurant data needs a Fastor session.'
              : 'We couldn’t load restaurants.'}
          </h2>
          <p>{error}</p>
          {!isFirebaseMode() && (
            <button type="button" className="button button--small" onClick={loadRestaurants}>Try again <span aria-hidden="true">↻</span></button>
          )}
        </section>
      ) : (
        <>
          <div className="results-caption">
            <span>RESTAURANTS <span className="results-count">{filteredRestaurants.length}</span></span>
            <span>{query ? `Matching “${query}”` : 'Curated for your city'}</span>
          </div>
          {filteredRestaurants.length ? (
            <div className="restaurant-grid">
              {filteredRestaurants.map((restaurant) => (
                <RestaurantCard restaurant={restaurant} key={restaurant.restaurant_id} />
              ))}
            </div>
          ) : (
            <section className="state-card">
              <span className="state-icon" aria-hidden="true">⌕</span>
              <p className="eyebrow">{query ? 'No matches this time' : 'Nothing to show just yet'}</p>
              <h2>{query ? 'Try another search.' : 'No restaurants are available.'}</h2>
              <p>{query ? 'Check the spelling or search by restaurant name or address.' : 'Please check back in a little while.'}</p>
              {query && <button type="button" className="text-button" onClick={() => setQuery('')}>Clear your search <span aria-hidden="true">→</span></button>}
            </section>
          )}
        </>
      )}
      <footer className="page-footer"><span>© 2026 Fastor</span><span>Made for moments around the table <i>✳</i></span></footer>
    </AppLayout>
  )
}
