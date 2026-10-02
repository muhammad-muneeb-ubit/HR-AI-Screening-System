import {
  BriefcaseBusiness,
  LayoutGrid,
  Sparkles,
  UploadCloud,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getStatus } from '../lib/api';

const navItems = [
  { to: '/dashboard', label: 'Overview', icon: LayoutGrid },
  { to: '/jobs', label: 'Jobs', icon: BriefcaseBusiness },
  { to: '/resume', label: 'Resume', icon: UploadCloud },
  { to: '/analyse/pipeline', label: 'Pipeline', icon: BriefcaseBusiness },
  { to: '/skills', label: 'Skills', icon: Sparkles },
];

export default function Sidebar() {
    const [healthStatus, setStatus] = useState("Checking...");
    useEffect(() => {
        const checkStatus = async () => {
            try {
                const status = await getStatus();
                setStatus(status.status);   
                // console.log(healthStatus);
            } catch (error) {
                console.error('Error checking status:', error);
            }
        };

        checkStatus();
    });

  return (
    <aside className="w-full rounded-[28px] border border-slate-200 bg-white p-5 shadow-sm lg:w-72 h-[920px]">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
          HR
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Portfolio</p>
          <h1 className="text-xl font-semibold text-slate-900">RecruitFlow</h1>
        </div>
      </div>

      <nav className="space-y-1.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition ${
                isActive ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">Status</p>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-700">
         {healthStatus === 'ok' ? <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> : <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />}
          {healthStatus === 'ok' ? 'System healthy' : 'System Unhealthy'}
        </div>
      </div>
    </aside>
  );
}
