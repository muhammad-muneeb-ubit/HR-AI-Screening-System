import { AlertCircle, RefreshCw } from 'lucide-react';
export default function ErrorState({ message = 'Something went wrong. Please try again.', onRetry, title = 'Unable to load data', }) {
    return (
        <div className="flex min-h-[250px] w-full items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100">
                    <AlertCircle className="h-6 w-6 text-rose-600" />
                </div>
                <h3 className="text-base font-semibold text-slate-900"> {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600"> {message}
                </p> {onRetry && (
                    <button type="button" onClick={onRetry} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800" >
                        <RefreshCw className="h-4 w-4" /> Try again
                    </button>)}
            </div>
        </div>);
}