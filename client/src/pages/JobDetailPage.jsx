// import { ArrowLeft, Download, UploadCloud } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import ResumeAnalysisResultCard from '../components/ResumeAnalysisResultCard';
// import { CardSkeleton } from '../components/SkeletonLoader';
// import {
//   exportJobAnalysis,
//   getJobAnalysisResults,
//   getJobById,
// } from '../lib/api';

// export default function JobDetailPage({ onGoBack, onOpenResume }) {
//   const { jobId } = useParams();
//   const [job, setJob] = useState(null);
//   const [analyses, setAnalyses] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [isLoading, setIsLoading] = useState(true);
//   const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(false);
//   const [showAnalyses, setShowAnalyses] = useState(false);
//   const [error, setError] = useState('');
//   const PAGE_SIZE = 3;

//   useEffect(() => {
//     if (!jobId) return;
//     fetchJobDetails();
//   }, [jobId]);

//   const fetchJobDetails = async () => {
//     setIsLoading(true);
//     setError('');

//     try {
//       const data = await getJobById(jobId);
//       const jobInfo = data?.job || data || null;
//       setJob(jobInfo);
//     //   console.log('Fetched job details:', jobInfo);
//     } catch (err) {
//       setError(err.message || 'Unable to load job details');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const fetchJobAnalysis = async () => {
//     setIsLoadingAnalyses(true);
//     setError('');

//     try {
//       const data = await getJobAnalysisResults(jobId);
//       const rows = data?.job_info?.rows || data?.rows || [];
//       setAnalyses(rows);
//       setCurrentPage(1);
//       setShowAnalyses(true);
//     } catch (err) {
//       setError(err.message || 'Unable to load analyzed resumes');
//     } finally {
//       setIsLoadingAnalyses(false);
//     }
//   };

//   const handleExport = async () => {
//     try {
//       const blob = await exportJobAnalysis(jobId);
//       const downloadUrl = URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = downloadUrl;
//       link.download = `${job?.title || 'job'}_resume_analysis.xlsx`;
//       document.body.appendChild(link);
//       link.click();
//       link.remove();
//       URL.revokeObjectURL(downloadUrl);
//     } catch (err) {
//       setError(err.message || 'Unable to export Excel report');
//     }
//   };

//   const transformAnalysis = (row) => {
//     if (!row || typeof row !== 'object') return null;

//     return {
//       filename: row.file_name || row.filename || 'Unknown file',
//       llm_response: {
//         status: row.status || 'pending',
//         candidate_name: row.candidate_name || 'Unknown candidate',
//         candidate_email: row.candidate_email || 'No email provided',
//         candidate_phone: row.candidate_phone || 'No phone provided',
//         score: Number(row.score ?? 0),
//         score_breakdown: {
//           skills: row.skills_analysis,
//           experience: row.experience_analysis,
//           qualifications: row.qualifications_analysis,
//         },
//         response: row.overall_response || 'No comment provided.',
//       },
//     };
//   };

//   const totalPages = Math.max(1, Math.ceil(analyses.length / PAGE_SIZE));
//   const paginatedAnalyses = analyses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

//   if (isLoading || !job) {
//     return <CardSkeleton className="mt-2" />;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//         <button type="button" onClick={onGoBack} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600">
//           <ArrowLeft className="h-4 w-4" />
//           Back to jobs
//         </button>

//         <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
//           <div>
//             <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Job</p>
//             <h2 className="text-3xl font-semibold text-slate-900">{job.title}</h2>
//           </div>

//           <div className="flex flex-wrap items-center gap-3">
//             <button
//               type="button"
//               onClick={handleExport}
//               className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100"
//             >
//               <Download className="h-4 w-4" />
//               Export Excel
//             </button>
//             <button type="button" onClick={() => onOpenResume(jobId)} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
//               <UploadCloud className="h-4 w-4" />
//               Upload resumes
//             </button>
//           </div>
//         </div>

//         <div className="mt-5 grid gap-4 sm:grid-cols-2">
//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
//             <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Minimum score</p>
//             <p className="mt-1 text-xl font-semibold text-slate-900">{job.minimum_score ?? 0}</p>
//           </div>
//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
//             <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Experience</p>
//             <p className="mt-1 text-xl font-semibold text-slate-900">{job.minimum_experience ?? 0} years</p>
//           </div>
//         </div>

//         <div className="mt-5 grid gap-4 sm:grid-cols-1">
//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
//             <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Description</p>
//             <p className="mt-1 text-md text-slate-900">{job.description }</p>
//           </div>
//           <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
//             <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Education</p>
//             <p className="mt-1 text-md text-slate-900">{job.education_requirement}</p>
//           </div>
//         </div>


//         <div className="mt-5">
//           <button
//             type="button"
//             onClick={fetchJobAnalysis}
//             disabled={isLoadingAnalyses}
//             className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
//           >
//             {isLoadingAnalyses ? 'Loading...' : 'Check analyzed resumes'}
//           </button>
//         </div>

//         {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
//       </div>

//       {showAnalyses ? (
//         <div className="space-y-5">
//           <div className="flex items-center justify-between">
//             <h3 className="text-lg font-semibold text-slate-900">Analyzed resumes</h3>
//             <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{analyses.length} result(s)</span>
//           </div>

//           {isLoadingAnalyses ? (
//             <CardSkeleton className="mt-2" />
//           ) : analyses.length > 0 ? (
//             <>
//               {paginatedAnalyses.map((analysis, index) => (
//                 <ResumeAnalysisResultCard
//                   key={`${analysis.file_name || analysis.filename || 'analysis'}-${index}`}
//                   info={transformAnalysis(analysis)}
//                 />
//               ))}

//               <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
//                 <button
//                   type="button"
//                   onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
//                   disabled={currentPage === 1}
//                   className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   Previous
//                 </button>

//                 <span className="text-sm text-slate-600">
//                   Page {currentPage} of {totalPages}
//                 </span>

//                 <button
//                   type="button"
//                   onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
//                   disabled={currentPage === totalPages}
//                   className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
//                 >
//                   Next
//                 </button>
//               </div>
//             </>
//           ) : (
//             <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm text-sm text-slate-500">
//               No analysis found for this job yet.
//             </div>
//           )}
//         </div>
//       ) : null}
//     </div>
//   );
// }

import {
  AlertCircle,
  ArrowLeft,
  Download,
  Plus,
  RefreshCw,
  Trash2,
  UploadCloud,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ResumeAnalysisResultCard from '../components/ResumeAnalysisResultCard'
import { CardSkeleton } from '../components/SkeletonLoader'
import ErrorState from '../components/ErrorState'
import { addJobSkill, exportJobAnalysis, getJobAnalysisResults, getJobById, getJobSkills, getSkills, removeJobSkill, } from '../lib/api';

export default function JobDetailPage({ onGoBack, onOpenResume }) {
  const { jobId } = useParams()
  const [job, setJob] = useState(null)
  const [analyses, setAnalyses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [jobError, setJobError] = useState(null)
  const [isLoadingAnalyses, setIsLoadingAnalyses] = useState(false)
  const [analysisError, setAnalysisError] = useState(null)
  const [showAnalyses, setShowAnalyses] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportError, setExportError] = useState(null)
  const [jobSkills, setJobSkills] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedRequiredSkill, setSelectedRequiredSkill] = useState('');
  const [selectedOptionalSkill, setSelectedOptionalSkill] = useState('');
  const [skillsLoading, setSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState('');
  const PAGE_SIZE = 5

  const fetchJobDetails = async () => {
    if (!jobId) return
    setIsLoading(true)
    setJobError(null)
    try {
      const data = await getJobById(jobId)
      const jobInfo = data?.job || data || null
      if (!jobInfo) {
        throw new Error('Job information was not found.')
      } setJob(jobInfo)
    } catch (err) {
      console.error('Unable to load job details:', err)
      setJob(null)
      setJobError(err?.message || 'We could not load this job. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchJobSkills = async () => {
    setSkillsLoading(true);
    setSkillsError('');

    try {
      const data = await getJobSkills(jobId);
      const skills = Array.isArray(data?.skills)
        ? data.skills
        : Array.isArray(data?.job_skills)
          ? data.job_skills
          : [];

      const normalizedSkills = skills.map((skill) => ({
        id: skill.job_skill_id ?? skill.id ?? skill.skill_id,
        skill_id: skill.skill_id ?? skill.id,
        name: skill.skill_name ?? skill.name,
        skill_type: skill.skill_type,
      }));

      setJobSkills(normalizedSkills);
    } catch (err) {
      console.error('Unable to load job skills:', err);
      setSkillsError(err.message || 'Unable to load job skills');
    } finally {
      setSkillsLoading(false);
    }
  };

  const fetchAllSkills = async () => {
    try {
      const data = await getSkills();

      setAllSkills(data.skills || []);
    } catch (err) {
      console.error('Unable to load skills:', err);
      setSkillsError(err.message || 'Unable to load skills');
    }
  };
  useEffect(() => {
    if (!jobId) return;

    fetchJobDetails();
    fetchJobSkills();
    fetchAllSkills();
  }, [jobId]);

  const fetchJobAnalysis = async () => {
    if (!jobId) return
    setIsLoadingAnalyses(true)
    setAnalysisError(null)
    try {
      const data = await getJobAnalysisResults(jobId)
      const rows = data?.job_info?.rows || data?.rows || []
      setAnalyses(rows)
      setCurrentPage(1)
      setShowAnalyses(true)
    } catch (err) {
      console.error('Unable to load analyzed resumes:', err)
      setAnalysisError(err?.message || 'We could not load the analyzed resumes. Please try again.')
      setShowAnalyses(true)
    } finally {
      setIsLoadingAnalyses(false)
    }
  }

  const handleExport = async () => {
    if (!jobId) return
    setIsExporting(true)
    setExportError(null)
    try {
      const blob = await exportJobAnalysis(jobId)
      const downloadUrl = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${job?.title || 'job'}_resume_analysis.xlsx`
      document.body.appendChild(link)
      link.click()
      link.remove()
      URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      console.error('Unable to export Excel report:', err)
      setExportError(err?.message || 'We could not export the Excel report. Please try again.')
    } finally {
      setIsExporting(false)
    }
  }

  const transformAnalysis = (row) => {
    if (!row || typeof row !== 'object') return null
    return { filename: row.file_name || row.filename || 'Unknown file', llm_response: { status: row.status || 'pending', candidate_name: row.candidate_name || 'Unknown candidate', candidate_email: row.candidate_email || 'No email provided', candidate_phone: row.candidate_phone || 'No phone provided', score: Number(row.score ?? 0), score_breakdown: { skills: row.skills_analysis, experience: row.experience_analysis, qualifications: row.qualifications_analysis, }, response: row.overall_response || 'No comment provided.', }, }
  }

  const handleAddSkill = async (skillId, skillType) => {
    if (!skillId) return;

    setSkillsError('');

    try {
      await addJobSkill(jobId, {
        skill_id: Number(skillId),
        skill_type: skillType,
      });

      if (skillType === 'required') {
        setSelectedRequiredSkill('');
      } else {
        setSelectedOptionalSkill('');
      }

      await fetchJobSkills();
    } catch (err) {
      console.error('Unable to add skill:', err);
      setSkillsError(err.message || 'Unable to add skill');
    }
  };
  const handleRemoveSkill = async (skill) => {
    setSkillsError('');

    const skillIdToRemove = skill?.skill_id ?? skill?.id;

    if (!skillIdToRemove) {
      setSkillsError('Skill data is missing. Please reload the page.');
      return;
    }

    try {
      await removeJobSkill(jobId, Number(skillIdToRemove));
      await fetchJobSkills();
    } catch (err) {
      console.error('Unable to remove skill:', err);
      setSkillsError(err.message || 'Unable to remove skill');
    }
  };
  const totalPages = Math.max(1, Math.ceil(analyses.length / PAGE_SIZE))
  const paginatedAnalyses = analyses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
  if (isLoading) {
    return <CardSkeleton className="mt-2" />
  }

  if (jobError) {
    return (
      <ErrorState title="Unable to load job" message={jobError?.message || 'We could not load this job. Please try again.'} onRetry={fetchJobDetails} />)
  } if (!job) {
    return (
      <ErrorState title="Job not found" message="The job you are looking for could not be found." onRetry={onGoBack} />)
  } return (
    <div className="space-y-6">
      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <button type="button" onClick={onGoBack} className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-600 transition hover:text-slate-900" >
          <ArrowLeft className="h-4 w-4" /> Back to jobs
        </button>
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400"> Job
            </p>
            <h2 className="text-3xl font-semibold text-slate-900"> {job.title}
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3"> {/* Export */}
            <button type="button" onClick={handleExport} disabled={isExporting} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60" > {isExporting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />) : (
              <Download className="h-4 w-4" />)} {isExporting ? 'Exporting...' : 'Export Excel'}
            </button>
            <button type="button" onClick={() => onOpenResume(jobId)} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800" >
              <UploadCloud className="h-4 w-4" /> Upload resumes
            </button>
          </div>
        </div>
        {exportError && (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />
              <div className="flex-1">
                <p className="text-sm font-medium text-rose-800"> Unable to export report
                </p>
                <p className="mt-1 text-sm text-rose-700"> {exportError?.message || 'Something went wrong while exporting the Excel report.'}
                </p>
              </div>
              <button type="button" onClick={handleExport} disabled={isExporting} className="inline-flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-rose-700 disabled:opacity-50" >
                <RefreshCw className="h-3.5 w-3.5" /> Retry
              </button>
            </div>
          </div>)}
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400"> Minimum score
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-900"> {job.minimum_score ?? 0}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400"> Experience
            </p>
            <p className="mt-1 text-xl font-semibold text-slate-900"> {job.minimum_experience ?? 0} years
            </p>
          </div>
        </div>
        <div className="mt-5 grid gap-4 sm:grid-cols-1">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400"> Description
            </p>
            <p className="mt-1 text-md text-slate-900"> {job.description || 'No description provided.'}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400"> Education
            </p>
            <p className="mt-1 text-md text-slate-900"> {job.education_requirement || 'No education requirement specified.'}
            </p>
          </div>
        </div>



        {/* Skills */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">

          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">
              Skills
            </p>
            <h3 className="mt-1 text-lg font-semibold text-slate-900">
              Job skills
            </h3>
          </div>

          {skillsError ? (
            <p className="mb-4 text-sm text-red-600">
              {skillsError}
            </p>
          ) : null}

          <div className="grid gap-3 md:grid-cols-2">

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Required skill
              </label>

              <div className="flex gap-2">
                <select
                  value={selectedRequiredSkill}
                  onChange={(e) => setSelectedRequiredSkill(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                >
                  <option value="">Select required skill</option>

                  {allSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() =>
                    handleAddSkill(selectedRequiredSkill, 'required')
                  }
                  disabled={!selectedRequiredSkill}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Optional skill
              </label>

              <div className="flex gap-2">
                <select
                  value={selectedOptionalSkill}
                  onChange={(e) => setSelectedOptionalSkill(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-slate-400"
                >
                  <option value="">Select optional skill</option>

                  {allSkills.map((skill) => (
                    <option key={skill.id} value={skill.id}>
                      {skill.name}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() =>
                    handleAddSkill(selectedOptionalSkill, 'optional')
                  }
                  disabled={!selectedOptionalSkill}
                  className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3 text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2">

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-900">
                Required skills
              </p>

              <div className="flex flex-wrap gap-2">
                {jobSkills
                  .filter((skill) => skill.skill_type === 'required')
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700"
                    >
                      {skill.name}

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-emerald-600 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                {jobSkills.filter(
                  (skill) => skill.skill_type === 'required'
                ).length === 0 && (
                    <p className="text-sm text-slate-400">
                      No required skills added.
                    </p>
                  )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-slate-900">
                Optional skills
              </p>

              <div className="flex flex-wrap gap-2">
                {jobSkills
                  .filter((skill) => skill.skill_type === 'optional')
                  .map((skill) => (
                    <div
                      key={skill.id}
                      className="inline-flex items-center gap-2 rounded-full bg-sky-50 px-3 py-1.5 text-sm text-sky-700"
                    >
                      {skill.name}

                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="text-sky-600 hover:text-red-600"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}

                {jobSkills.filter(
                  (skill) => skill.skill_type === 'optional'
                ).length === 0 && (
                    <p className="text-sm text-slate-400">
                      No optional skills added.
                    </p>
                  )}
              </div>
            </div>

          </div>

        </div>


        <div className="mt-5">
          <button type="button" onClick={fetchJobAnalysis} disabled={isLoadingAnalyses} className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60" > {isLoadingAnalyses && (
            <RefreshCw className="h-4 w-4 animate-spin" />)} {isLoadingAnalyses ? 'Loading...' : 'Check analyzed resumes'}
          </button>
        </div>
      </div>
      {showAnalyses && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-slate-900"> Analyzed resumes
            </h3> {!analysisError && (
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600"> {analyses.length} result(s)
              </span>)}
          </div> 
          {isLoadingAnalyses ? (
            <CardSkeleton className="mt-2" />) : analysisError ? (
              <ErrorState title="Unable to load analyzed resumes" message={analysisError?.message || 'We could not load the analyzed resumes. Please try again.'} onRetry={fetchJobAnalysis} />) : analyses.length > 0 ? ( /* Analysis results */
                <> {paginatedAnalyses.map((analysis, index) => (
                  <ResumeAnalysisResultCard key={`${analysis.file_name || analysis.filename || 'analysis'}-${index}`} info={transformAnalysis(analysis)} />))} {/* Pagination */}
                  <div className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-white p-3 shadow-sm">
                    <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" > Previous
                    </button>
                    <span className="text-sm text-slate-600"> Page {currentPage} of {totalPages}
                    </span>
                    <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40" > Next
                    </button>
                  </div>
                </>) : (
            <div className="rounded-[24px] border border-slate-200 bg-white p-8 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                <UploadCloud className="h-5 w-5 text-slate-400" />
              </div>
              <h3 className="mt-3 text-sm font-semibold text-slate-900"> No analyzed resumes
              </h3>
              <p className="mt-1 text-sm text-slate-500"> No resume analysis has been completed for this job yet.
              </p>
              <button type="button" onClick={() => onOpenResume(jobId)} className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800" >
                <UploadCloud className="h-4 w-4" /> Upload resumes
              </button>
            </div>)}
        </div>)}
    </div>)
}


