import { Suspense } from 'react';
import Loading from '../common/Loading';
import ErrorBoundary from './ErrorBoundary';

function AsyncErrorBoundary({ children }) {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading />}>{children}</Suspense>
    </ErrorBoundary>
  );
}

export default AsyncErrorBoundary;
