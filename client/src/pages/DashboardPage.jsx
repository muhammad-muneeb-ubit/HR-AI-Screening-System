import { ArrowRight, BriefcaseBusiness, FileText, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getDashboardMetrics } from '../lib/api';

const statuses = {
  Open: 'bg-emerald-50 text-emerald-700',
  Reviewing: 'bg-amber-50 text-amber-700',
  Shortlisted: 'bg-sky-50 text-sky-700',
};

const defaultMetrics = {
  total_jobs: 0,
  total_resumes: 0,
  total_skills: 0,
  total_analysis: 0,
};

export default function DashboardPage({ jobs, onOpenJobs, onOpenJob }) {
  const [metrics, setMetrics] = useState(defaultMetrics);
  const [loadingMetrics, setLoadingMetrics] = useState(true);

  useEffect(() => {
    loadMetrics();
  }, []);

  const loadMetrics = async () => {
    try {
      const data = await getDashboardMetrics();
      setMetrics(data.metrics || defaultMetrics);
    } catch (error) {
      console.error('Failed to fetch dashboard metrics:', error);
    } finally {
      setLoadingMetrics(false);
    }
  };

  const openJobs = jobs.slice(0, 4);
  const uniqueSkillCount = new Set((jobs || []).flatMap((job) => job.required_skills || [])).size;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          icon={BriefcaseBusiness}
          label="Jobs"
          value={loadingMetrics ? '...' : String(metrics.total_jobs ?? 0)}
          accent="text-slate-700"
        />
        <StatCard
          icon={FileText}
          label="Resumes"
          value={loadingMetrics ? '...' : String(metrics.total_resumes ?? 0)}
          accent="text-sky-600"
        />
        <StatCard
          icon={Sparkles}
          label="Skills"
          value={loadingMetrics ? '...' : String(metrics.total_skills ?? 0)}
          accent="text-emerald-600"
        />
        <StatCard
          icon={FileText}
          label="Analysis"
          value={loadingMetrics ? '...' : String(metrics.total_analysis ?? 0)}
          accent="text-violet-600"
        />
      </div>

      <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-slate-900">Open positions</h2>
          <button type="button" onClick={onOpenJobs} className="text-sm font-medium text-slate-600 hover:text-slate-900">
            View all
          </button>
        </div>

        <div className="space-y-3">
          {openJobs.map((job) => (
            <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900">{job.title}</p>
                  <p className="text-sm text-slate-500">{job.description?.slice(0, 80) || 'No description provided'}</p>
                </div>
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statuses.Open || 'bg-slate-100 text-slate-700'}`}>
                  Open
                </span>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                {(job.required_skills || []).slice(0, 3).map((skill) => (
                  <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                <span>Minimum score: {job.minimum_score ?? 0}</span>
                <button type="button" onClick={() => onOpenJob(job.id)} className="inline-flex items-center gap-1 font-medium text-slate-900">
                  Open <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700">
          <Icon className="h-4 w-4" />
        </span>
        <span className={`text-xs font-medium ${accent}`}>{label}</span>
      </div>
      <div className="text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
    </div>
  );
}
