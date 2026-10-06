
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function ErrorMessage({
  message,
  onRetry,
  title = 'Something went wrong',
}) {
  if (!message) return null;

  return (
    <div className="rounded-2xl border border-red-200 bg-red-50 p-4">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />

        <div className="min-w-0 flex-1">
          <p className="font-semibold text-red-800">
            {title}
          </p>

          <p className="mt-1 text-sm leading-6 text-red-700 break-words">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="mt-3 inline-flex items-center gap-2 rounded-xl bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}