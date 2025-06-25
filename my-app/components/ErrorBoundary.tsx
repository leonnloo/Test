"use client";

import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; retry: () => void }>;
}

export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error!}
            retry={this.handleRetry}
          />
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-red-200 p-6 text-center">
            <div className="text-red-500 text-4xl mb-4">💥</div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-4">
              An unexpected error occurred while loading the application.
            </p>

            {this.state.error && (
              <details className="mb-4 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error details
                </summary>
                <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-gray-700 overflow-x-auto">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <div className="space-y-3">
              <button
                onClick={this.handleRetry}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
              >
                Reload Page
              </button>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              If the problem persists, please check your internet connection or
              try again later.
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Custom error fallback for API-related errors
export function ApiErrorFallback({
  error,
  retry,
}: {
  error: Error;
  retry: () => void;
}) {
  const isNetworkError =
    error.message.includes("Network") ||
    error.message.includes("fetch") ||
    error.message.includes("API is not available");

  return (
    <div className="w-full max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg border border-red-200">
      <div className="text-center">
        <div className="text-red-500 text-3xl mb-3">
          {isNetworkError ? "🌐" : "⚠️"}
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {isNetworkError ? "Connection Error" : "Application Error"}
        </h3>
        <p className="text-gray-600 mb-4">
          {isNetworkError
            ? "Unable to connect to the recipe service. Please check your internet connection."
            : error.message}
        </p>

        <div className="space-y-2">
          <button
            onClick={retry}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            {isNetworkError ? "Retry Connection" : "Try Again"}
          </button>

          {isNetworkError && (
            <div className="text-sm text-gray-500">
              <p>Troubleshooting tips:</p>
              <ul className="text-left mt-1 space-y-1">
                <li>• Check your internet connection</li>
                <li>• Make sure the API server is running</li>
                <li>• Try refreshing the page</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ErrorBoundary;
