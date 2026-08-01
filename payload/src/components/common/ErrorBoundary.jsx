import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, information) {
    console.error("Uncaught application error:", error, information);
  }

  render() {
    if (!this.state.error) {
      return this.props.children;
    }

    return (
      <main className="fatal-error">
        <section className="fatal-error__card card" role="alert">
          <span className="fatal-error__icon" aria-hidden="true">⚠️</span>
          <p className="fatal-error__eyebrow">Champions Legacy Challenge</p>
          <h1>Something went wrong</h1>
          <p>
            The app encountered an unexpected problem. Refresh the page and try
            again. Your saved Firestore entries are not affected.
          </p>
          <button
            className="button button--primary"
            type="button"
            onClick={() => window.location.reload()}
          >
            Refresh app
          </button>
        </section>
      </main>
    );
  }
}
