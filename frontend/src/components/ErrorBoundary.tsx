import { Component, ReactNode, captureOwnerStack } from 'react';

class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    if (!import.meta.env['DEV']) {
      return
    }
    console.error(
      error,
      info.componentStack,
      captureOwnerStack(),
    );
  }

  render() {
    if (this.state.hasError) {
      // TODO: ALERT COMPONENT
      return <h1>HARK, AN ERROR</h1>
    }

    return this.props.children;
  }
}

export default ErrorBoundary;