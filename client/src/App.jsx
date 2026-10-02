import { useEffect, useState } from 'react';
import { Bell, Plus, Search } from 'lucide-react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { PageSkeleton } from './components/SkeletonLoader';
import DashboardPage from './pages/DashboardPage';
import JobsPage from './pages/JobsPage';
import SkillsPage from './pages/SkillsPage';
import ResumePage from './pages/ResumePage';
import JobDetailPage from './pages/JobDetailPage';
import NotFoundPage from './pages/NotFoundPage';
import { getJobs } from './lib/api';

const routeTitles = {
  '/dashboard': 'Hiring overview',
  '/jobs': 'Jobs',
  '/skills': 'Skills',
  '/resume': 'Resume analysis',
};

function getCurrentTitle(pathname) {
  if (pathname.startsWith('/jobs/')) {
    return 'Job details';
  }

  return routeTitles[pathname] || 'Hiring overview';
}

function AppLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <div className="mx-auto max-w-7xl p-4 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row">
          <Sidebar />

          <main className="flex-1 rounded-[30px] border border-slate-200 bg-white p-4 shadow-sm sm:p-6 h-[920px] overflow-y-auto">
            <header className="mb-6 flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Dashboard</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">
                  {getCurrentTitle(location.pathname)}
                </h1>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500 sm:flex">
                  <Search className="h-4 w-4" />
                  Search candidates
                </div>
                <button
                  type="button"
                  aria-label="Notifications"
                  title="Notifications"
                  className="rounded-xl border border-slate-200 p-2.5 text-slate-600"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/jobs')}
                  className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white"
                >
                  <Plus className="h-4 w-4" />
                  New job
                </button>
              </div>
            </header>

            {loading ? (
              <PageSkeleton rows={3} />
            ) : (
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route
                  path="/dashboard"
                  element={
                    <DashboardPage
                      jobs={jobs}
                      onOpenJobs={() => navigate('/jobs')}
                      onOpenJob={(jobId) => navigate(`/jobs/${jobId}`)}
                    />
                  }
                />
                <Route
                  path="/jobs"
                  element={<JobsPage jobs={jobs} setJobs={setJobs} onOpenJob={(jobId) => navigate(`/jobs/${jobId}`)} />}
                />
                <Route
                  path="/jobs/:jobId"
                  element={
                    <JobDetailPage
                      onGoBack={() => navigate('/jobs')}
                      onOpenResume={() => navigate('/resume')}
                    />
                  }
                />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/resume" element={<ResumePage jobs={jobs} />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;
