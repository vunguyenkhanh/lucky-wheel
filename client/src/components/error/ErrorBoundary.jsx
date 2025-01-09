import { Component } from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo,
    });

    // Có thể log error vào service
    console.error('Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
          <div className="max-w-xl w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Oops! Đã có lỗi xảy ra</h2>
            <p className="text-gray-600 mb-6">
              Chúng tôi rất tiếc, nhưng đã có lỗi xảy ra. Vui lòng thử lại sau.
            </p>
            {process.env.NODE_ENV === 'development' && (
              <pre className="bg-gray-100 p-4 rounded text-left text-sm mb-6 overflow-auto">
                {this.state.error?.toString()}
                {this.state.errorInfo?.componentStack}
              </pre>
            )}
            <div className="space-x-4">
              <button onClick={() => window.location.reload()} className="btn btn-primary">
                Tải lại trang
              </button>
              <Link to="/" className="btn btn-secondary">
                Về trang chủ
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
