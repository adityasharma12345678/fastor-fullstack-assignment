import { Component } from 'react'

export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Application rendering failed', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="fatal-error">
          <span className="eyebrow">Something went wrong</span>
          <h1>We could not load this page.</h1>
          <p>Refresh the page to try again.</p>
          <button className="button" onClick={() => window.location.reload()}>
            Refresh page
          </button>
        </main>
      )
    }

    return this.props.children
  }
}
