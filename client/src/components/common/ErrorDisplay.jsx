import { XCircleIcon } from '@heroicons/react/24/solid';

function ErrorDisplay({ error }) {
  return (
    <div className="rounded-md bg-red-50 p-4 my-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <XCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Đã xảy ra lỗi</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{error?.message || 'Vui lòng thử lại sau'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorDisplay;
