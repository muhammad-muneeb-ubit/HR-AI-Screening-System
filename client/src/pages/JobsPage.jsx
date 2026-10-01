import { BriefcaseBusiness, PencilLine, Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CardSkeleton } from '../components/SkeletonLoader';
import { createJob, deleteJob, getJobs } from '../lib/api';

const emptyForm = {
  title: '',
  description: '',
  minimum_score: 70,
  minimum_experience: 1,
  education_requirement: '',
};

export default function JobsPage({ jobs, setJobs, onOpenJob }) {
  const [form, setForm] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    setIsLoading(true);
    try {
      const data = await getJobs();
      setJobs(data.jobs || []);
    } catch (err) {
      setError(err.message || 'Unable to load jobs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        title: form.title,
        description: form.description,
        minimum_score: Number(form.minimum_score),
        minimum_experience: Number(form.minimum_experience),
        education_requirement: form.education_requirement || null,
      };

      const result = await createJob(payload);
      if (result?.job) {
        const nextJobs = await getJobs();
        setJobs(nextJobs.jobs || []);
      }

      setForm(emptyForm);
    } catch (err) {
      setError(err.message || 'Failed to create job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (jobId) => {
    try {
      await deleteJob(jobId);
      const nextJobs = await getJobs();
      setJobs(nextJobs.jobs || []);
    } catch (err) {
      setError(err.message || 'Failed to delete job');
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-slate-100 p-2 text-slate-700">
                <BriefcaseBusiness className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Jobs</p>
                <h2 className="text-2xl font-semibold text-slate-900">Job pipeline</h2>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Title</span>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-slate-400"
                placeholder="Senior Frontend Engineer"
                required
              />
            </label>

            <label className="md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Description</span>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                className="min-h-28 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-slate-400"
                placeholder="Describe the role, team, and expectations"
                required
              />
            </label>

            <label>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Minimum score</span>
              <input
                type="number"
                name="minimum_score"
                value={form.minimum_score}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-slate-400"
              />
            </label>

            <label>
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Minimum experience</span>
              <input
                type="number"
                name="minimum_experience"
                value={form.minimum_experience}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-slate-400"
              />
            </label>

            <label className="md:col-span-2">
              <span className="mb-1.5 block text-sm font-medium text-slate-700">Education requirement</span>
              <input
                name="education_requirement"
                value={form.education_requirement}
                onChange={handleChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-slate-400"
                placeholder="Bachelor's degree in Computer Science"
              />
            </label>

            {error ? <p className="md:col-span-2 text-sm text-red-600">{error}</p> : null}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus className="h-4 w-4" />
                {isSubmitting ? 'Saving...' : 'Create job'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Existing jobs</h3>
        <div className="space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-base font-semibold text-slate-900">{job.title}</p>
                <p className="text-sm text-slate-500">{job.description?.slice(0, 100) || 'No description'}</p>
              </div>

              <div className="flex items-center gap-2">
                <button type="button" onClick={() => onOpenJob(job.id)} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                  <PencilLine className="h-4 w-4" />
                  Open
                </button>
                <button type="button" onClick={() => handleDelete(job.id)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600">
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
