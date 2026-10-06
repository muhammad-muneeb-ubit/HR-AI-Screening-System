// import { Trash2, UploadCloud } from 'lucide-react';
// import { useEffect, useRef, useState } from 'react';
// import { CardSkeleton } from '../components/SkeletonLoader';
// import { deleteResume, getAllResumes, getJobs, uploadResumeFiles } from '../lib/api';
// import ResumeAnalysisResultCard from '../components/ResumeAnalysisResultCard';

// export default function ResumePage() {
//   const [jobs, setJobs] = useState([]);
//   const [resumes, setResumes] = useState([]);
//   const [selectedJobId, setSelectedJobId] = useState('');
//   const [files, setFiles] = useState([]);
//   const [jobsLoading, setJobsLoading] = useState(true);
//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState('');
//   const fileInputRef = useRef(null);
//   useEffect(() => {
//     loadJobs();
//     loadResumes();
//   }, []);

//   const loadJobs = async () => {
//     setJobsLoading(true);
//     try {
//       const data = await getJobs();
//       const nextJobs = data.jobs || [];
//       setJobs(nextJobs);
//       if (nextJobs.length > 0) setSelectedJobId(String(nextJobs[0].id));
//     } catch (err) {
//       setError(err.message || 'Unable to load jobs');
//     } finally {
//       setJobsLoading(false);
//     }
//   };

//   const loadResumes = async () => {
//     try {
//       const data = await getAllResumes();
//     //   console.log('Fetched resumes:', data.resumes.resumes);
//       setResumes(data.resumes.resumes || []);
//     } catch (err) {
//       console.error('Unable to load resumes:', err);
//     }
//   };

//   const handleFileChange = (event) => {
//     setFiles(Array.from(event.target.files || []));
//   };

//   const handleUpload = async () => {
//     if (!selectedJobId || files.length === 0) {
//       setError('Choose a job and select at least one PDF file.');
//       return;
//     }

//     const formData = new FormData();
//     files.forEach((file) => {
//         // console.log('Appending file:', file.name);
//         // console.log('File object:', file);
//       formData.append('resume_file', file);
//     });

//     setLoading(true);
//     setError('');

//     try {
        
//         const response = await uploadResumeFiles(selectedJobId, formData);
//         // console.log('formData:', formData);
//       setResult(response);
//     //   console.log('Upload response:', response);
//       setFiles([]);
//       if (fileInputRef.current) fileInputRef.current.value = '';
//       await loadResumes();
//     } catch (err) {
//       setError(err.message || 'Upload failed');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDeleteResume = async (resumeId) => {
//     try {
//       await deleteResume(resumeId);
//       await loadResumes();
//     } catch (err) {
//       setError(err.message || 'Failed to delete resume');
//     }
//   };

//   if (jobsLoading) {
//     return <CardSkeleton className="mt-2" />;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//         <div className="mb-5 flex items-center gap-3">
//           <span className="rounded-xl bg-slate-100 p-2 text-slate-700">
//             <UploadCloud className="h-5 w-5" />
//           </span>
//           <div>
//             <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Resume</p>
//             <h2 className="text-2xl font-semibold text-slate-900">Upload resume files</h2>
//           </div>
//         </div>

//         <div className="grid gap-4 md:grid-cols-[240px_1fr]">
//           <label className="block">
//             <span className="mb-1.5 block text-sm font-medium text-slate-700">Select job</span>
//             <select
//               value={selectedJobId}
//               onChange={(event) => setSelectedJobId(event.target.value)}
//               className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-slate-400"
//             >
//               {jobs.map((job) => (
//                 <option key={job.id} value={job.id}>{job.title}</option>
//               ))}
//             </select>
//           </label>

//           <label className="block">
//             <span className="mb-1.5 block text-sm font-medium text-slate-700">PDF files</span>
//             <input
//               ref={fileInputRef}
//               type="file"
//               accept="application/pdf"
//               multiple
//               onChange={handleFileChange}
//               className="w-full rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-3 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-3 file:py-2 file:text-sm file:font-medium file:text-white"
//             />
//           </label>
//         </div>

//         <div className="mt-5 flex flex-wrap items-center gap-3">
//           <button type="button" onClick={handleUpload} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60">
//             <UploadCloud className="h-4 w-4" />
//             {loading ? 'Uploading...' : 'Analyze resumes'}
//           </button>

//           {files.length > 0 ? (
//             <div className="text-sm text-slate-600">
//               {files.length} file{files.length > 1 ? 's' : ''} selected
//             </div>
//           ) : null}
//         </div>

//         {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
//       </div>

//      {!result && ( <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//         <h3 className="mb-4 text-lg font-semibold text-slate-900">Recent resumes</h3>
//         <div className="space-y-3">
//           { resumes.length > 0 ? (
//             resumes.slice(0, 3).map((resume) => (
//               <div key={resume.id} className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between">
//                 <div>
//                   <p className="text-sm font-semibold text-slate-900">{resume.file_name}</p>
//                   <p className="text-xs text-slate-500">
//                     {resume.candidate_name || 'Unknown candidate'}
//                     {resume.candidate_email ? ` • ${resume.candidate_email}` : ''}
//                   </p>
//                 </div>
//                 <button
//                   type="button"
//                   onClick={() => handleDeleteResume(resume.id)}
//                   className="inline-flex items-center gap-2 self-start rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 md:self-center"
//                 >
//                   <Trash2 className="h-4 w-4" />
//                   Delete
//                 </button>
//               </div>
//             ))
//           ) : (
//             <p className="text-sm text-slate-500">No resumes uploaded yet.</p>
//           ) }
//         </div>
//       </div>)}

//       {result ? (
//         <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//           <h3 className="mb-3 text-lg font-semibold text-slate-900">Analysis summary</h3>
//           <div className="grid gap-3 md:grid-cols-3">
//             <SummaryCard label="Total" value={result.count ?? 0} />
//             <SummaryCard label="Completed" value={result.completed ?? 0} tone="emerald" />
//             <SummaryCard label="Failed" value={result.failed ?? 0} tone="rose" />
//           </div>

//           <div className="mt-5 space-y-3">
//             {(result.results || []).map((info, index) => (
//             //   <div key={`${item.filename}-${index}`} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//             //     <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//             //       <div>
//             //         <p className="text-sm font-semibold text-slate-900">{item.filename}</p>
//             //         <p className="text-xs text-slate-500">{item.job_title}</p>
//             //       </div>
//             //       <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.status === 'completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
//             //         {item.status}
//             //       </span>
//             //     </div>
//             //     {item.error ? <p className="mt-2 text-sm text-red-600">{item.error}</p> : null}
//             //     {item.llm_response ? (
//             //       <pre className="mt-3 whitespace-pre-wrap rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-700">
//             //         {typeof item.llm_response === 'string' ? item.llm_response : JSON.stringify(item.llm_response, null, 2)}
//             //       </pre>
//             //     ) : null}
//             //   </div>
//                 <ResumeAnalysisResultCard key={`${info.filename}-${index}`} info={info} />
//             ))}
//           </div>
//         </div>
//       ) : null}
//     </div>
//   );
// }

// function SummaryCard({ label, value, tone = 'slate' }) {
//   const toneClasses = {
//     slate: 'bg-slate-100 text-slate-700',
//     emerald: 'bg-emerald-50 text-emerald-700',
//     rose: 'bg-red-50 text-red-700',
//   };

//   return (
//     <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
//       <p className="text-xs uppercase tracking-[0.15em] text-slate-400">{label}</p>
//       <div className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-sm font-semibold ${toneClasses[tone]}`}>
//         {value}
//       </div>
//     </div>
//   );
// }



import { AlertCircle, Trash2, UploadCloud, RefreshCw } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { CardSkeleton } from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import {
  deleteResume,
  getAllResumes,
  getJobs,
  uploadResumeFiles,
} from '../lib/api';
import ResumeAnalysisResultCard from '../components/ResumeAnalysisResultCard';

export default function ResumePage() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);

  const [selectedJobId, setSelectedJobId] = useState('');
  const [files, setFiles] = useState([]);

  const [jobsLoading, setJobsLoading] = useState(true);
  const [resumesLoading, setResumesLoading] = useState(true);
  const [loading, setLoading] = useState(false);

  const [deletingResumeId, setDeletingResumeId] = useState(null);

  const [jobsError, setJobsError] = useState(null);
  const [resumesError, setResumesError] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const [deleteError, setDeleteError] = useState(null);

  const [result, setResult] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadJobs();
    loadResumes();
  }, []);

  // =========================================================
  // LOAD JOBS
  // =========================================================

  const loadJobs = async () => {
    setJobsLoading(true);
    setJobsError(null);

    try {
      const data = await getJobs();

      const nextJobs = data?.jobs || [];

      setJobs(nextJobs);

      if (nextJobs.length > 0) {
        setSelectedJobId(String(nextJobs[0].id));
      } else {
        setSelectedJobId('');
      }
    } catch (err) {
      console.error('Unable to load jobs:', err);
      setJobsError(err);
      setJobs([]);
      setSelectedJobId('');
    } finally {
      setJobsLoading(false);
    }
  };

  // =========================================================
  // LOAD RESUMES
  // =========================================================

  const loadResumes = async () => {
    setResumesLoading(true);
    setResumesError(null);

    try {
      const data = await getAllResumes();

      const nextResumes =
        data?.resumes?.resumes ||
        data?.resumes ||
        [];

      setResumes(Array.isArray(nextResumes) ? nextResumes : []);
    } catch (err) {
      console.error('Unable to load resumes:', err);
      setResumesError(err);
      setResumes([]);
    } finally {
      setResumesLoading(false);
    }
  };

  // =========================================================
  // FILE SELECTION
  // =========================================================

  const handleFileChange = (event) => {
    setUploadError(null);

    const selectedFiles = Array.from(event.target.files || []);

    const invalidFiles = selectedFiles.filter(
      (file) => file.type !== 'application/pdf'
    );

    if (invalidFiles.length > 0) {
      setUploadError(
        'Only PDF files are allowed. Please select valid PDF resumes.'
      );

      event.target.value = '';
      setFiles([]);
      return;
    }

    setFiles(selectedFiles);
  };

  // =========================================================
  // UPLOAD / ANALYZE
  // =========================================================

  const handleUpload = async () => {
    setUploadError(null);
    setResult(null);

    if (!selectedJobId) {
      setUploadError('Please select a job before uploading resumes.');
      return;
    }

    if (files.length === 0) {
      setUploadError('Please select at least one PDF resume.');
      return;
    }

    const formData = new FormData();

    files.forEach((file) => {
      formData.append('resume_file', file);
    });

    setLoading(true);

    try {
      const response = await uploadResumeFiles(
        selectedJobId,
        formData
      );

      setResult(response);

      setFiles([]);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      // Refresh resume list after successful upload.
      await loadResumes();
    } catch (err) {
      console.error('Resume upload failed:', err);
      setUploadError(err);
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // DELETE RESUME
  // =========================================================

  const handleDeleteResume = async (resumeId) => {
    setDeleteError(null);
    setDeletingResumeId(resumeId);

    try {
      await deleteResume(resumeId);

      await loadResumes();
    } catch (err) {
      console.error('Failed to delete resume:', err);
      setDeleteError(err);
    } finally {
      setDeletingResumeId(null);
    }
  };

  // =========================================================
  // JOBS LOADING
  // =========================================================

  if (jobsLoading) {
    return <CardSkeleton className="mt-2" />;
  }

  // =========================================================
  // JOBS ERROR
  // =========================================================

  if (jobsError) {
    return (
      <ErrorState
        title="Unable to load jobs"
        message={
          jobsError.message ||
          'We could not load the available jobs. Please try again.'
        }
        onRetry={loadJobs}
      />
    );
  }

  // =========================================================
  // NO JOBS
  // =========================================================

  if (jobs.length === 0) {
    return (
      <div className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="max-w-md text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
              <UploadCloud className="h-6 w-6 text-slate-500" />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              No jobs available
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              You need to create at least one job before you can upload
              and analyze resumes.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN PAGE
  // =========================================================

  return (
    <div className="space-y-6">

      {/* =====================================================
          UPLOAD SECTION
      ====================================================== */}

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">

        {/* Header */}

        <div className="mb-5 flex items-center gap-3">
          <span className="rounded-xl bg-slate-100 p-2 text-slate-700">
            <UploadCloud className="h-5 w-5" />
          </span>

          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
              Resume
            </p>

            <h2 className="text-2xl font-semibold text-slate-900">
              Upload resume files
            </h2>
          </div>
        </div>

        {/* Upload form */}

        <div className="grid gap-4 md:grid-cols-[240px_1fr]">

          {/* Job */}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              Select job
            </span>

            <select
              value={selectedJobId}
              onChange={(event) => {
                setSelectedJobId(event.target.value);
                setUploadError(null);
              }}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-slate-400"
            >
              {jobs.map((job) => (
                <option
                  key={job.id}
                  value={job.id}
                >
                  {job.title}
                </option>
              ))}
            </select>
          </label>

          {/* Files */}

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-slate-700">
              PDF files
            </span>

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

        {/* Upload button */}

        <div className="mt-5 flex flex-wrap items-center gap-3">

          <button
            type="button"
            onClick={handleUpload}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <UploadCloud className="h-4 w-4" />

            {loading
              ? 'Analyzing resumes...'
              : 'Analyze resumes'}
          </button>

          {files.length > 0 ? (
            <div className="text-sm text-slate-600">
              {files.length} file
              {files.length > 1 ? 's' : ''} selected
            </div>
          ) : null}
        </div>

        {/* Upload error */}

        {uploadError ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />

              <div>
                <p className="text-sm font-semibold text-rose-800">
                  Unable to analyze resumes
                </p>

                <p className="mt-1 text-sm leading-6 text-rose-700">
                  {uploadError.message ||
                    'Something went wrong while analyzing the uploaded resumes.'}
                </p>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* =====================================================
          RECENT RESUMES
      ====================================================== */}

      {!result && (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-slate-900">
              Recent resumes
            </h3>

            <button
              type="button"
              onClick={loadResumes}
              disabled={resumesLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {/* Resume loading */}

          {resumesLoading ? (
            <CardSkeleton />
          ) : resumesError ? (

            <ErrorState
              title="Unable to load resumes"
              message={
                resumesError.message ||
                'We could not load your recent resumes.'
              }
              onRetry={loadResumes}
            />

          ) : resumes.length > 0 ? (

            <div className="space-y-3">

              {resumes.slice(0, 3).map((resume) => (
                <div
                  key={resume.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {resume.file_name}
                    </p>

                    <p className="text-xs text-slate-500">
                      {resume.candidate_name ||
                        'Unknown candidate'}

                      {resume.candidate_email
                        ? ` • ${resume.candidate_email}`
                        : ''}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      handleDeleteResume(resume.id)
                    }
                    disabled={deletingResumeId === resume.id}
                    className="inline-flex items-center gap-2 self-start rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50 md:self-center"
                  >
                    <Trash2 className="h-4 w-4" />

                    {deletingResumeId === resume.id
                      ? 'Deleting...'
                      : 'Delete'}
                  </button>
                </div>
              ))}

            </div>

          ) : (

            <div className="flex min-h-[180px] items-center justify-center">
              <div className="text-center">
                <p className="text-sm font-medium text-slate-700">
                  No resumes uploaded yet
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Upload a PDF resume to start screening candidates.
                </p>
              </div>
            </div>

          )}

          {/* Delete error */}

          {deleteError ? (
            <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-rose-600" />

                <div>
                  <p className="text-sm font-semibold text-rose-800">
                    Unable to delete resume
                  </p>

                  <p className="mt-1 text-sm text-rose-700">
                    {deleteError.message ||
                      'Something went wrong while deleting the resume.'}
                  </p>
                </div>
              </div>
            </div>
          ) : null}

        </div>
      )}

      {/* =====================================================
          ANALYSIS RESULT
      ====================================================== */}

      {result ? (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">

          <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-slate-900">
              Analysis summary
            </h3>

            <button
              type="button"
              onClick={() => setResult(null)}
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Upload more resumes
            </button>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            <SummaryCard
              label="Total"
              value={result.count ?? 0}
            />

            <SummaryCard
              label="Completed"
              value={result.completed ?? 0}
              tone="emerald"
            />

            <SummaryCard
              label="Failed"
              value={result.failed ?? 0}
              tone="rose"
            />
          </div>

          {/* Partial failure notice */}

          {Number(result.failed ?? 0) > 0 ? (
            <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />

                <div>
                  <p className="text-sm font-semibold text-amber-800">
                    Some resumes could not be analyzed
                  </p>

                  <p className="mt-1 text-sm text-amber-700">
                    {result.failed} resume
                    {Number(result.failed) > 1 ? 's' : ''} failed
                    during processing. Check the results below for
                    the specific reason.
                  </p>
                </div>
              </div>
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            {(result.results || []).map((info, index) => (
              <ResumeAnalysisResultCard
                key={`${info.filename || 'resume'}-${index}`}
                info={info}
              />
            ))}
          </div>

        </div>
      ) : null}

    </div>
  );
}

// =========================================================
// SUMMARY CARD
// =========================================================

function SummaryCard({
  label,
  value,
  tone = 'slate',
}) {
  const toneClasses = {
    slate: 'bg-slate-100 text-slate-700',
    emerald: 'bg-emerald-50 text-emerald-700',
    rose: 'bg-red-50 text-red-700',
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
        {label}
      </p>

      <div
        className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-sm font-semibold ${
          toneClasses[tone]
        }`}
      >
        {value}
      </div>
    </div>
  );
}