// import { ArrowRight, BriefcaseBusiness, FileText, Sparkles } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { getDashboardMetrics } from '../lib/api';

// const statuses = {
//   Open: 'bg-emerald-50 text-emerald-700',
//   Reviewing: 'bg-amber-50 text-amber-700',
//   Shortlisted: 'bg-sky-50 text-sky-700',
// };

// const defaultMetrics = {
//   total_jobs: 0,
//   total_resumes: 0,
//   total_skills: 0,
//   total_analysis: 0,
// };

// export default function DashboardPage({ jobs, onOpenJobs, onOpenJob }) {
//   const [metrics, setMetrics] = useState(defaultMetrics);
//   const [loadingMetrics, setLoadingMetrics] = useState(true);

//   useEffect(() => {
//     loadMetrics();
//   }, []);

//   const loadMetrics = async () => {
//     try {
//       const data = await getDashboardMetrics();
//       setMetrics(data.metrics || defaultMetrics);
//     } catch (error) {
//       console.error('Failed to fetch dashboard metrics:', error);
//     } finally {
//       setLoadingMetrics(false);
//     }
//   };

//   const openJobs = jobs.slice(0, 4);
//   const uniqueSkillCount = new Set((jobs || []).flatMap((job) => job.required_skills || [])).size;

//   return (
//     <div className="space-y-6">
//       <div className="grid gap-4 md:grid-cols-4">
//         <StatCard
//           icon={BriefcaseBusiness}
//           label="Jobs"
//           value={loadingMetrics ? '...' : String(metrics.total_jobs ?? 0)}
//           accent="text-slate-700"
//         />
//         <StatCard
//           icon={FileText}
//           label="Resumes"
//           value={loadingMetrics ? '...' : String(metrics.total_resumes ?? 0)}
//           accent="text-sky-600"
//         />
//         <StatCard
//           icon={Sparkles}
//           label="Skills"
//           value={loadingMetrics ? '...' : String(metrics.total_skills ?? 0)}
//           accent="text-emerald-600"
//         />
//         <StatCard
//           icon={FileText}
//           label="Analysis"
//           value={loadingMetrics ? '...' : String(metrics.total_analysis ?? 0)}
//           accent="text-violet-600"
//         />
//       </div>

//       <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
//         <div className="mb-4 flex items-center justify-between gap-3">
//           <h2 className="text-xl font-semibold text-slate-900">Open positions</h2>
//           <button type="button" onClick={onOpenJobs} className="text-sm font-medium text-slate-600 hover:text-slate-900">
//             View all
//           </button>
//         </div>

//         <div className="space-y-3">
//           {openJobs.map((job) => (
//             <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4">
//               <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//                 <div>
//                   <p className="text-base font-semibold text-slate-900">{job.title}</p>
//                   <p className="text-sm text-slate-500">{job.description?.slice(0, 80) || 'No description provided'}</p>
//                 </div>
//                 <span className={`w-[55px] inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statuses.Open || 'bg-slate-100 text-slate-700'}`}>
//                   Open
//                 </span>
//               </div>

//               <div className="mt-3 flex flex-wrap gap-2">
//                 {(job.required_skills || []).slice(0, 3).map((skill) => (
//                   <span key={skill} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600">
//                     {skill}
//                   </span>
//                 ))}
//               </div>

//               <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
//                 <span>Minimum score: {job.minimum_score ?? 0}</span>
//                 <button type="button" onClick={() => onOpenJob(job.id)} className="inline-flex items-center gap-1 font-medium text-slate-900">
//                   Open <ArrowRight className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// function StatCard({ icon: Icon, label, value, accent }) {
//   return (
//     <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
//       <div className="mb-4 flex items-center justify-between">
//         <span className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700">
//           <Icon className="h-4 w-4" />
//         </span>
//         <span className={`text-xs font-medium ${accent}`}>{label}</span>
//       </div>
//       <div className="text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
//     </div>
//   );
// }


import { ArrowRight, BriefcaseBusiness, FileText, Sparkles, RefreshCw, AlertCircle, } from 'lucide-react'
import { useEffect, useState } from 'react'
import { getDashboardMetrics } from '../lib/api'

const statuses = { Open: 'bg-emerald-50 text-emerald-700', Reviewing: 'bg-amber-50 text-amber-700', Shortlisted: 'bg-sky-50 text-sky-700', }
const defaultMetrics = { total_jobs: 0, total_resumes: 0, total_skills: 0, total_analysis: 0, }

export default function DashboardPage({ jobs, onOpenJobs, onOpenJob }) {
    const [metrics, setMetrics] = useState(defaultMetrics)
    const [loadingMetrics, setLoadingMetrics] = useState(true)
    const [metricsError, setMetricsError] = useState(null)
    const loadMetrics = async () => {
        try {
            setLoadingMetrics(true)
            setMetricsError(null)
            const data = await getDashboardMetrics()
            setMetrics(data.metrics || defaultMetrics)
        } catch (error) {
            console.error('Failed to fetch dashboard metrics:', error)
            setMetricsError(error)
        } finally {
            setLoadingMetrics(false)
        }
    }
    useEffect(() => {
        loadMetrics()
    }, [])
    const openJobs = (jobs || []).slice(0, 4)
    return (
        <div className="space-y-6">
            {metricsError ? (
                <div className="rounded-[22px] border border-rose-200 bg-rose-50 p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 rounded-xl bg-rose-100 p-2">
                                <AlertCircle className="h-5 w-5 text-rose-600" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-slate-900"> Unable to load dashboard metrics
                                </h3>
                                <p className="mt-1 text-sm leading-6 text-slate-600"> {metricsError.message || 'We could not load the dashboard statistics. Please try again.'}
                                </p>
                            </div>
                        </div>
                        <button type="button" onClick={loadMetrics} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800" >
                            <RefreshCw className="h-4 w-4" /> Try again
                        </button>
                    </div>
                </div>) : (
                <div className="grid gap-4 md:grid-cols-4">
                    <StatCard icon={BriefcaseBusiness} label="Jobs" value={loadingMetrics ? '...' : String(metrics.total_jobs ?? 0)} accent="text-slate-700" />
                    <StatCard icon={FileText} label="Resumes" value={loadingMetrics ? '...' : String(metrics.total_resumes ?? 0)} accent="text-sky-600" />
                    <StatCard icon={Sparkles} label="Skills" value={loadingMetrics ? '...' : String(metrics.total_skills ?? 0)} accent="text-emerald-600" />
                    <StatCard icon={FileText} label="Analysis" value={loadingMetrics ? '...' : String(metrics.total_analysis ?? 0)} accent="text-violet-600" />
                </div>)}
            <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-4 sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-xl font-semibold text-slate-900"> Open positions
                    </h2>
                    <button type="button" onClick={onOpenJobs} className="text-sm font-medium text-slate-600 transition hover:text-slate-900" > View all
                    </button>
                </div> {/* No jobs */} {openJobs.length === 0 ? (
                    <div className="flex min-h-[180px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white border border-slate-200">
                                <BriefcaseBusiness className="h-5 w-5 text-slate-400" />
                            </div>
                            <h3 className="text-sm font-semibold text-slate-900"> No open positions
                            </h3>
                            <p className="mt-1 text-sm text-slate-500"> Create a job to start screening candidates.
                            </p>
                        </div>
                    </div>) : ( /* Jobs */
                    <div className="space-y-3"> {openJobs.map((job) => (
                        <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-4" >
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                <div className="min-w-0">
                                    <p className="truncate text-base font-semibold text-slate-900"> {job.title}
                                    </p>
                                    <p className="text-sm text-slate-500"> {job.description?.slice(0, 80) || 'No description provided'}
                                    </p>
                                </div>
                                <span className={`inline-flex w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statuses.Open || 'bg-slate-100 text-slate-700'}`} > Open
                                </span>
                            </div>
                            <div className="mt-3 flex flex-wrap gap-2"> {(job.required_skills || []).slice(0, 3).map((skill) => (
                                <span key={`${job.id}-${skill}`} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600" > {skill}
                                </span>))}
                            </div>
                            <div className="mt-4 flex items-center justify-between gap-3 text-sm text-slate-600">
                                <span> Minimum score: {job.minimum_score ?? 0}
                                </span>
                                <button type="button" onClick={() => onOpenJob(job.id)} className="inline-flex shrink-0 items-center gap-1 font-medium text-slate-900 transition hover:text-slate-600" > Open
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>))}
                    </div>)}
            </div>
        </div>)
}
function StatCard({ icon: Icon, label, value, accent, }) {
    return (
        <div className="rounded-[22px] border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
                <span className="rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-700">
                    <Icon className="h-4 w-4" />
                </span>
                <span className={`text-xs font-medium ${accent}`}> {label}
                </span>
            </div>
            <div className="text-2xl font-semibold tracking-tight text-slate-900"> {value}
            </div>
        </div>)
}