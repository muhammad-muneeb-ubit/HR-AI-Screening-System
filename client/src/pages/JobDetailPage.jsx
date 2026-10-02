import { ArrowLeft, Download, UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ResumeAnalysisResultCard from '../components/ResumeAnalysisResultCard';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
  exportJobAnalysis,
  getJobAnalysisResults,
  getJobById,
} from '../lib/api';

export default function JobDetailPage({ onGoBack, onOpenResume }) {
  const { jobId } = useParams();
  const [job, setJob] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(false);
  const [showAnalyses, setShowAnalyses] = useState(false);
  const [error, setError] = useState('');
  const PAGE_SIZE = 3;

  useEffect(() => {
    if (!jobId) return;
    fetchJobDetails();
  }, [jobId]);

  const fetchJobDetails = async () => {
    setIsLoading(true);
    setError('');

    try {
      const data = await getJobById(jobId);
      const jobInfo = data?.job || data || null;
      setJob(jobInfo);
    //   console.log('Fetched job details:', jobInfo);
    } catch (err) {
      setError(err.message || 'Unable to load job details');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchJobAnalysis = async () => {
    setIsLoadingAnalyses(true);
    setError('');

    try {
      const data = await getJobAnalysisResults(jobId);
      const rows = data?.job_info?.rows || data?.rows || [];
      setAnalyses(rows);
      setCurrentPage(1);
      setShowAnalyses(true);
    } catch (err) {
      setError(err.message || 'Unable to load analyzed resumes');
    } finally {
      setIsLoadingAnalyses(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportJobAnalysis(jobId);
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = `${job?.title || 'job'}_resume_analysis.xlsx`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      setError(err.message || 'Unable to export Excel report');
    }
  };

  const transformAnalysis = (row) => {
    if (!row || typeof row !== 'object') return null;

    return {
      filename: row.file_name || row.filename || 'Unknown file',
      llm_response: {
        status: row.status || 'pending',
        candidate_name: row.candidate_name || 'Unknown candidate',
        candidate_email: row.candidate_email || 'No email provided',
        candidate_phone: row.candidate_phone || 'No phone provided',
        score: Number(row.score ?? 0),
        score_breakdown: {
          skills: row.skills_analysis,
          experience: row.experience_analysis,
          qualifications: row.qualifications_analysis,
        },
        response: row.overall_response || 'No comment provided.',
      },
    };
  };

  const totalPages = Math.max(1, Math.ceil(analyses.length / PAGE_SIZE));
  const paginatedAnalyses = analyses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (isLoading || !job) {
    return <CardSkeleton className="mt-2" />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <button type="button" onClick={onGoBack} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600">
          <ArrowLeft className="h-4 w-4" />
          Back to jobs
        </button>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Job</p>
            <h2 className="text-3xl font-semibold text-slate-900">{job.title}</h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
            >
              <Download className="h-4 w-4" />
              Export Excel
            </button>
            <button type="button" onClick={() => onOpenResume(jobId)} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
              <UploadCloud className="h-4 w-4" />
              Upload resumes
            </button>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Minimum score</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{job.minimum_score ?? 0}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Experience</p>
            <p className="mt-1 text-xl font-semibold text-slate-900">{job.minimum_experience ?? 0} years</p>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-1">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Description</p>
            <p className="mt-1 text-md text-slate-900">{job.description }</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Education</p>
            <p className="mt-1 text-md text-slate-900">{job.education_requirement}</p>
          </div>
        </div>
        

        <div className="mt-5">
          <button
            type="button"
            onClick={fetchJobAnalysis}
            disabled={isLoadingAnalyses}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoadingAnalyses ? 'Loading...' : 'Check analyzed resumes'}
          </button>
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>

      {showAnalyses ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900">Analyzed resumes</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{analyses.length} result(s)</span>
          </div>

          {isLoadingAnalyses ? (
            <CardSkeleton className="mt-2" />
          ) : analyses.length > 0 ? (
            <>
              {paginatedAnalyses.map((analysis, index) => (
                <ResumeAnalysisResultCard
                  key={`${analysis.file_name || analysis.filename || 'analysis'}-${index}`}
                  info={transformAnalysis(analysis)}
                />
              ))}

              <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                <span className="text-sm text-slate-600">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  type="button"
                  onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm text-sm text-slate-500">
              No analysis found for this job yet.
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
