import { ArrowLeft, Download, Plus, Trash2, UploadCloud } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CardSkeleton } from '../components/SkeletonLoader';
import {
    addJobSkill,
    exportJobAnalysis,
    getJobById,
    getJobSkills,
    getSkills,
    removeJobSkill,
} from '../lib/api';

const parseSkillList = (value) =>
    typeof value === 'string'
        ? value
            .split(',')
            .map((item) => item.trim())
            .filter(Boolean)
        : [];

export default function JobDetailPage({ jobId: propJobId, onGoBack, onOpenResume }) {
    const { jobId: routeJobId } = useParams();
    const jobId = Number(routeJobId || propJobId);
    const [job, setJob] = useState(null);
    const [skills, setSkills] = useState([]);
    const [requiredSkills, setRequiredSkills] = useState([]);
    const [optionalSkills, setOptionalSkills] = useState([]);
    const [selectedRequiredSkillId, setSelectedRequiredSkillId] = useState('');
    const [selectedOptionalSkillId, setSelectedOptionalSkillId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!jobId) return;
        fetchJob();
    }, [jobId]);

    const fetchJob = async () => {
        setIsLoading(true);
        try {
            const [jobData, skillData, allSkills] = await Promise.all([
                getJobById(jobId),
                getJobSkills(jobId),
                getSkills(),
            ]);

            setJob(jobData.job || jobData);

            setRequiredSkills(parseSkillList(skillData.job_info?.required_skills));
            setOptionalSkills(parseSkillList(skillData.job_info?.optional_skills));
            setSkills(allSkills.skills || []);

            if ((allSkills.skills || []).length > 0) {
                setSelectedRequiredSkillId(String((allSkills.skills || [])[0].id));
                setSelectedOptionalSkillId(String((allSkills.skills || [])[0].id));
            }
        } catch (err) {
            setError(err.message || 'Unable to load job details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddSkill = async (skillType) => {
        const selectedSkillId = skillType === 'required' ? selectedRequiredSkillId : selectedOptionalSkillId;
        if (!selectedSkillId) return;

        try {
            await addJobSkill(jobId, {
                skill_id: Number(selectedSkillId),
                skill_type: skillType,
            });
            await fetchJob();
        } catch (err) {
            setError(err.message || 'Unable to add skill');
        }
    };

    const handleRemoveSkill = async (skillName, skillType) => {
        const skillId = skills.find((item) => item.name?.toLowerCase() === skillName.toLowerCase())?.id;

        if (!skillId) {
            setError('Skill not found');
            return;
        }

        try {
            await removeJobSkill(jobId, Number(skillId));
            await fetchJob();
        } catch (err) {
            setError(err.message || `Unable to remove ${skillType} skill`);
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
                {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                    <h3 className="mb-3 text-lg font-semibold text-slate-900">Job details</h3>
                    <p className="text-sm leading-6 text-slate-600">{job.description}</p>

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
                </div>

                <div className="space-y-6 rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                    <div>
                        <h3 className="mb-3 text-lg font-semibold text-slate-900">Required skills</h3>

                        <div className="space-y-3">
                            {requiredSkills.length > 0 ? (
                                requiredSkills.map((skill) => (
                                    <div key={skill} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                                        <span className="text-sm font-medium text-slate-700">{skill}</span>
                                        <button type="button" onClick={() => handleRemoveSkill(skill, 'required')} className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">No required skills assigned yet.</p>
                            )}
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <select
                                value={selectedRequiredSkillId}
                                onChange={(event) => setSelectedRequiredSkillId(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-slate-400"
                            >
                                {skills.map((skill) => (
                                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                                ))}
                            </select>
                            <button type="button" onClick={() => handleAddSkill('required')} className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
                                <Plus className="h-4 w-4" />
                                Add required
                            </button>
                        </div>
                    </div>

                    <div>
                        <h3 className="mb-3 text-lg font-semibold text-slate-900">Optional skills</h3>

                        <div className="space-y-3">
                            {optionalSkills.length > 0 ? (
                                optionalSkills.map((skill) => (
                                    <div key={skill} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2">
                                        <span className="text-sm font-medium text-slate-700">{skill}</span>
                                        <button type="button" onClick={() => handleRemoveSkill(skill, 'optional')} className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <p className="text-sm text-slate-500">No optional skills assigned yet.</p>
                            )}
                        </div>

                        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                            <select
                                value={selectedOptionalSkillId}
                                onChange={(event) => setSelectedOptionalSkillId(event.target.value)}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-slate-400"
                            >
                                {skills.map((skill) => (
                                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                                ))}
                            </select>
                            <button type="button" onClick={() => handleAddSkill('optional')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700">
                                <Plus className="h-4 w-4" />
                                Add optional
                            </button>
                        </div>
                    </div>

                    {/* {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null} */}
                </div>
            </div>
        </div>
    );
}
