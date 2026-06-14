import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gl-parchment flex items-center justify-center p-6">
          <div className="bg-gl-softbloom border border-gl-dustypetal rounded-xl p-8 max-w-md text-center">
            <p className="font-display text-display-md text-gl-ink mb-2">Something went wrong</p>
            <p className="text-sm text-gl-stone mb-6">
              An unexpected error occurred. Try refreshing the page.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="bg-gl-moss text-white text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90"
              >
                Refresh page
              </button>
              <Link
                to="/"
                className="bg-gl-lavender text-gl-nightbloom text-sm font-medium px-5 py-2.5 rounded-md hover:opacity-90"
              >
                Go home
              </Link>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
