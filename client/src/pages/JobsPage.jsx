import { BriefcaseBusiness, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CardSkeleton } from '../components/SkeletonLoader';
import { getJobs } from '../lib/api';

const PAGE_SIZE = 6;

export default function JobsPage({ jobs, setJobs, onOpenJob }) {
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getJobs();
      setJobs(data.jobs || []);
      setPage(1);
    } catch (err) {
      console.error('Unable to load jobs', err);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.max(1, Math.ceil((jobs || []).length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * PAGE_SIZE;
  const paginatedJobs = (jobs || []).slice(startIndex, startIndex + PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="rounded-xl bg-slate-100 p-2 text-slate-700">
              <BriefcaseBusiness className="h-5 w-5" />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Jobs</p>
              <h2 className="text-2xl font-semibold text-slate-900">All jobs</h2>
            </div>
          </div>
        </div>

        {isLoading ? (
          <CardSkeleton />
        ) : (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {paginatedJobs.map((job) => (
                <div key={job.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-semibold text-slate-900">{job.title}</p>
                      <p className="mt-1 text-xs uppercase tracking-[0.14em] text-slate-400">Job #{job.id}</p>
                    </div>
                    <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-medium text-emerald-700">Open</span>
                  </div>

                  <p className="text-sm leading-6 text-slate-600">{job.description?.slice(0, 110) || 'No description available.'}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {(job.required_skills || []).slice(0, 3).map((skill) => (
                      <span key={`${job.id}-${skill}`} className="rounded-full bg-white px-2.5 py-1 text-[10px] font-medium text-slate-600 border border-slate-200">
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                    <span>Score: {job.minimum_score ?? 0}</span>
                    <button type="button" onClick={() => onOpenJob(job.id)} className="inline-flex items-center gap-1 font-medium text-slate-900">
                      View <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                disabled={safePage === 1}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Prev
              </button>

              <p className="text-sm text-slate-600">
                Page {safePage} of {totalPages}
              </p>

              <button
                type="button"
                onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                disabled={safePage === totalPages}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
