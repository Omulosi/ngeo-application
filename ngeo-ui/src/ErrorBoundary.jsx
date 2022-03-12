/* eslint-disable react/destructuring-assignment */
import React from 'react';

class ErrorBoundary extends React.Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    hasError: false
  };

  componentDidCatch(error, errorInfo) {
    console.error('(Location tracker) Uncaught error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }

    // eslint-disable-next-line react/destructuring-assignment
    // eslint-disable-next-line react/prop-types
    return this.props?.children;
  }
}

export default ErrorBoundary;
