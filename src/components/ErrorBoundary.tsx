import { Component, ErrorInfo } from 'react'

export default class ErrorBoundary extends Component {
  state: {
    error: Error | null
  } = {
    error: null
  }

  static getDerivedStateFromError(error: Error) {
    return { error }
  }

  render() {
    if (this.state.error) {
      return (
        <code>
          <pre>
            {this.state.error.message}
            {this.state.error.stack}
          </pre>
        </code>
      )
    }

    return <>{this.props.children}</>
  }
}
