import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Bell,
  BriefcaseBusiness,
  ChartColumnBig,
  CheckCircle2,
  FileText,
  LayoutGrid,
  Plus,
  Search,
  Sparkles,
  UploadCloud,
  Users,
} from 'lucide-react'

const jobs = [
  {
    title: 'Senior Frontend Engineer',
    company: 'Northstar Labs',
    score: 92,
    status: 'Open',
    skills: ['React', 'TypeScript', 'UX'],
  },
  {
    title: 'Product Designer',
    company: 'Aster Studio',
    score: 86,
    status: 'Reviewing',
    skills: ['Figma', 'Design Systems', 'Research'],
  },
  {
    title: 'Python Developer',
    company: 'Signal Grid',
    score: 78,
    status: 'Shortlisted',
    skills: ['Python', 'FastAPI', 'APIs'],
  },
]

const skills = ['React', 'JavaScript', 'Python', 'FastAPI', 'SQL', 'UI Design']

const analysisResults = [
  {
    name: 'Muhammad Ali.pdf',
    status: 'Completed',
    score: 94,
    match: 'Strong fit',
  },
  {
    name: 'Sara Khan.pdf',
    status: 'Completed',
    score: 88,
    match: 'Good match',
  },
  {
    name: 'John Smith.pdf',
    status: 'Failed',
    score: 0,
    match: 'Missing required skills',
  },
]

const tabs = ['Overview', 'Jobs', 'Skills', 'Resume']

function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-slate-700">
          <Icon className="h-4 w-4" />
        </span>
        <span className={`text-xs font-medium ${accent}`}>{label}</span>
      </div>
      <div className="text-2xl font-semibold tracking-tight text-slate-900">{value}</div>
    </div>
  )
}

function App() {
  const [activeTab, setActiveTab] = useState('Overview')

  const stats = useMemo(
    () => [
      { icon: BriefcaseBusiness, label: 'Open jobs', value: '24', accent: 'text-slate-600' },
      { icon: Users, label: 'Candidates', value: '182', accent: 'text-emerald-600' },
      { icon: FileText, label: 'CV analyzed', value: '1,240', accent: 'text-sky-600' },
      { icon: ChartColumnBig, label: 'Shortlist rate', value: '67%', accent: 'text-violet-600' },
    ],
    []
  )

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 lg:px-6">
        <aside className="hidden w-64 shrink-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm lg:block">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
              HR
            </div>
            <div>
              <div className="text-sm font-medium text-slate-500">Portfolio</div>
              <div className="text-base font-semibold text-slate-900">RecruitFlow</div>
            </div>
          </div>

          <nav className="space-y-1">
            {[
              { label: 'Overview', icon: LayoutGrid },
              { label: 'Jobs', icon: BriefcaseBusiness },
              { label: 'Skills', icon: Sparkles },
              { label: 'Resume', icon: UploadCloud },
            ].map(({ label, icon: Icon }) => (
              <button
                key={label}
                type="button"
                onClick={() => setActiveTab(label)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                  activeTab === label
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-2 text-xs uppercase tracking-[0.16em] text-slate-500">Status</div>
            <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              System healthy
            </div>
          </div>
        </aside>

        <main className="flex-1 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">Dashboard</div>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">Hiring overview</h1>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 sm:flex">
                <Search className="h-4 w-4" />
                Search candidates
              </div>
              <button type="button" className="rounded-xl border border-slate-200 p-2.5 text-slate-600">
                <Bell className="h-4 w-4" />
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
              >
                <Plus className="h-4 w-4" />
                New job
              </button>
            </div>
          </header>

          <div className="mb-6 flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                  activeTab === tab
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'Overview' && (
            <div className="space-y-6">
              <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <StatCard key={stat.label} {...stat} />
                ))}
              </section>

              <section className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-slate-900">Open positions</h2>
                    <button type="button" className="text-sm font-medium text-slate-600">
                      View all
                    </button>
                  </div>

                  <div className="space-y-3">
                    {jobs.map((job) => (
                      <div key={job.title} className="rounded-2xl border border-slate-200 bg-white p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <div className="text-base font-semibold text-slate-900">{job.title}</div>
                            <div className="text-sm text-slate-500">{job.company}</div>
                          </div>
                          <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                            {job.status}
                          </span>
                        </div>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {job.skills.map((skill) => (
                            <span key={skill} className="rounded-full bg-slate-100 px-2 py-1 text-xs text-slate-600">
                              {skill}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 flex items-center justify-between text-sm text-slate-600">
                          <span>Match score: {job.score}%</span>
                          <button type="button" className="inline-flex items-center gap-1 font-medium text-slate-900">
                            Open <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h2 className="mb-4 text-lg font-semibold text-slate-900">Resume pipeline</h2>
                  <div className="space-y-3">
                    {analysisResults.map((item) => (
                      <div key={item.name} className="rounded-2xl border border-slate-200 bg-white p-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-medium text-slate-800">{item.name}</div>
                            <div className="text-xs text-slate-500">{item.match}</div>
                          </div>
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                              item.status === 'Completed'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-rose-50 text-rose-700'
                            }`}
                          >
                            {item.status}
                          </span>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                          <span>Score</span>
                          <span className="font-semibold text-slate-800">{item.score}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          )}

          {activeTab === 'Jobs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Jobs</h2>
                <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white">
                  <Plus className="h-4 w-4" />
                  Add job
                </button>
              </div>

              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600">
                    <tr>
                      <th className="px-4 py-3 font-medium">Title</th>
                      <th className="px-4 py-3 font-medium">Company</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {jobs.map((job) => (
                      <tr key={job.title}>
                        <td className="px-4 py-3 font-medium text-slate-800">{job.title}</td>
                        <td className="px-4 py-3 text-slate-600">{job.company}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700">
                            {job.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{job.score}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'Skills' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Skills library</h2>
                <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700">
                  <Plus className="h-4 w-4" />
                  Add skill
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <span key={skill} className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Resume' && (
            <div className="space-y-6">
              <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <h2 className="text-xl font-semibold text-slate-900">Upload resumes</h2>
                <p className="mt-2 text-sm text-slate-500">PDF files only. Up to 5MB per resume.</p>
                <button type="button" className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                  <UploadCloud className="h-4 w-4" />
                  Select files
                </button>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-base font-semibold text-slate-900">Latest analysis</h3>
                  <button type="button" className="text-sm font-medium text-slate-600">
                    Export report
                  </button>
                </div>

                <div className="space-y-3">
                  {analysisResults.map((item) => (
                    <div key={item.name} className="flex items-center justify-between rounded-xl border border-slate-200 px-3 py-2.5">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-700">
                          <FileText className="h-4 w-4" />
                        </span>
                        <div>
                          <div className="text-sm font-medium text-slate-800">{item.name}</div>
                          <div className="text-xs text-slate-500">{item.match}</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-slate-700">{item.score}</span>
                        <span
                          className={`rounded-full px-2 py-1 text-[10px] font-medium ${
                            item.status === 'Completed'
                              ? 'bg-emerald-50 text-emerald-700'
                              : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {item.status}
                        </span>
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
