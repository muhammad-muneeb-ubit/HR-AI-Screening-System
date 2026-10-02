import { Trash2, UploadCloud } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CardSkeleton } from '../components/SkeletonLoader';
import { deleteResume, getAllResumes, getJobs, uploadResumeFiles } from '../lib/api';
import ResumeAnalysisResultCard from '../components/ResumeAnalysisResultCard';

export default function ResumePage() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState('');
  const [files, setFiles] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  useEffect(() => {
    loadJobs();
    loadResumes();
  }, []);

  const loadJobs = async () => {
    setJobsLoading(true);
    try {
      const data = await getJobs();
      const nextJobs = data.jobs || [];
      setJobs(nextJobs);
      if (nextJobs.length > 0) setSelectedJobId(String(nextJobs[0].id));
    } catch (err) {
      setError(err.message || 'Unable to load jobs');
    } finally {
      setJobsLoading(false);
    }
  };

  const loadResumes = async () => {
    try {
      const data = await getAllResumes();
    //   console.log('Fetched resumes:', data.resumes.resumes);
      setResumes(data.resumes.resumes || []);
    } catch (err) {
      console.error('Unable to load resumes:', err);
    }
  };

  const handleFileChange = (event) => {
    setFiles(Array.from(event.target.files || []));
  };

  const handleUpload = async () => {
    if (!selectedJobId || files.length === 0) {
      setError('Choose a job and select at least one PDF file.');
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
        // console.log('Appending file:', file.name);
        // console.log('File object:', file);
      formData.append('resume_file', file);
    });

    setLoading(true);
    setError('');

    try {
        
        const response = await uploadResumeFiles(selectedJobId, formData);
        // console.log('formData:', formData);
      setResult(response);
    //   console.log('Upload response:', response);
      setFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = '';
      await loadResumes();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteResume = async (resumeId) => {
    try {
      await deleteResume(resumeId);
      await loadResumes();
    } catch (err) {
      setError(err.message || 'Failed to delete resume');
    }
  };

  if (jobsLoading) {
    return <CardSkeleton className="mt-2" />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-slate-100 p-2 text-slate-700">
            <UploadCloud className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Resume</p>
            <h2 className="text-2xl font-semibold text-slate-900">Upload resume files</h2>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[240px_1fr]">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">Select job</span>
            <select
              value={selectedJobId}
              onChange={(event) => setSelectedJobId(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-slate-400"
            >
              {jobs.map((job) => (
                <option key={job.id} value={job.id}>{job.title}</option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">PDF files</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              multiple
              onChange={handleFileChange}
              className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
            />
          </label>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <button type="button" onClick={handleUpload} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">
            <UploadCloud className="h-4 w-4" />
            {loading ? 'Uploading...' : 'Analyze resumes'}
          </button>

          {files.length > 0 ? (
            <div className="text-sm text-slate-600">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </div>
          ) : null}
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </div>

     {!result && ( <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent resumes</h3>
        <div className="space-y-3">
          { resumes.length > 0 ? (
            resumes.slice(0, 3).map((resume) => (
              <div key={resume.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{resume.file_name}</p>
                  <p className="text-xs text-slate-500">
                    {resume.candidate_name || 'Unknown candidate'}
                    {resume.candidate_email ? ` • ${resume.candidate_email}` : ''}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteResume(resume.id)}
                  className="inline-flex items-center gap-2 self-start rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 md:self-center"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </button>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No resumes uploaded yet.</p>
          ) }
        </div>
      </div>)}

      {result ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-lg font-semibold text-slate-900">Analysis summary</h3>
          <div className="grid gap-3 md:grid-cols-3">
            <SummaryCard label="Total" value={result.count ?? 0} />
            <SummaryCard label="Completed" value={result.completed ?? 0} tone="emerald" />
            <SummaryCard label="Failed" value={result.failed ?? 0} tone="rose" />
          </div>

          <div className="mt-5 space-y-3">
            {(result.results || []).map((info, index) => (
            //   <div key={`${item.filename}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            //     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            //       <div>
            //         <p className="text-sm font-semibold text-slate-900">{item.filename}</p>
            //         <p className="text-xs text-slate-500">{item.job_title}</p>
            //       </div>
            //       <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            //         {item.status}
            //       </span>
            //     </div>
            //     {item.error ? <p className="mt-2 text-sm text-red-600">{item.error}</p> : null}
            //     {item.llm_response ? (
            //       <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
            //         {typeof item.llm_response === 'string' ? item.llm_response : JSON.stringify(item.llm_response, null, 2)}
            //       </pre>
            //     ) : null}
            //   </div>
                <ResumeAnalysisResultCard key={`${info.filename}-${index}`} info={info} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function SummaryCard({ label, value, tone = 'slate' }) {
  const toneClasses = {
    slate: 'bg-slate-100 text-slate-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-red-50 text-red-700',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{label}</p>
      <div className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-sm font-semibold ${toneClasses[tone]}`}>
        {value}
      </div>
    </div>
  );
}
