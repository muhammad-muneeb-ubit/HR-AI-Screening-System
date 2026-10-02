import { CheckCircle2, CircleAlert, FileText, Mail, Phone, Star } from 'lucide-react';

export default function ResumeAnalysisResultCard({ info }) {
  if (!info) return null;

  const scoreValue = Number(info.score ?? 0) * 100;
  const status = String(info.llm_response.status || 'pending').toLowerCase();
  const isPassed = status === 'passed' || status === 'completed' || status === 'selected';

  const scoreBreakdown = info.llm_response.score_breakdown || {};
  const summaryFields = [
    { key: 'skills', label: 'Skills' },
    { key: 'experience', label: 'Experience' },
    { key: 'qualifications', label: 'Qualifications' },
  ];

  return (
    <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 border-b border-slate-200 pb-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-slate-100 p-2 text-slate-700">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Resume analysis</p>
            <h3 className="mt-1 text-xl font-semibold text-slate-900">{info.filename || 'Unknown file'}</h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${isPassed ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
            {isPassed ? <CheckCircle2 className="h-3.5 w-3.5" /> : <CircleAlert className="h-3.5 w-3.5" />}
            {status}
          </span>
        </div>
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Candidate</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{info.llm_response.candidate_name || 'Unknown candidate'}</p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{info.llm_response.candidate_email || 'No email provided'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{info.llm_response.candidate_phone || 'No phone provided'}</span>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs uppercase tracking-[0.15em] text-slate-400">Score</p>
          <div className="mt-2 flex items-center gap-2">
            <Star className="h-4 w-4 text-amber-500" />
            {/* <span className="text-2xl font-semibold text-slate-900">{info.llm_response.score.toFixed(0)}%</span> */}
            <span className="text-2xl font-semibold text-slate-900">{(info.llm_response.score *100).toFixed(0)}%</span>
            {/* <span className={`text-xl ${isPassed  ? 'text-emerald-500' : 'text-red-500'}`}>{info.llm_response.status}</span> */}
          </div>
          <p className="mt-3 text-sm text-slate-600">
            {isPassed ? 'Meets the screening baseline.' : 'Below the required screening threshold.'}
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {summaryFields.map((field) => (
          <div key={field.key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{field.label}</p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {scoreBreakdown[field.key] || 'No details available.'}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="text-sm font-semibold text-slate-900">Overall response</p>
        <p className="mt-2 text-sm leading-6 text-slate-600">{info.llm_response.response || 'No comment provided.'}</p>
      </div>
    </div>
  );
}
