import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Surfaced in the browser console so it's diagnosable instead of a
    // silent blank screen.
    console.error('Index Four crashed:', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center text-ink">
          <span className="eyebrow text-ink-muted">Something went wrong</span>
          <h1 className="font-display text-2xl text-ink">This page hit a snag</h1>
          <p className="max-w-sm text-sm text-ink-muted">
            {this.state.error?.message || 'An unexpected error occurred while rendering this page.'}
          </p>
          <button
            type="button"
            onClick={() => {
              this.setState({ error: null })
              window.location.href = '/'
            }}
            className="eyebrow mt-2 rounded-full bg-ink px-5 py-2.5 text-bg transition-transform hover:-translate-y-0.5"
          >
            Back to home
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
