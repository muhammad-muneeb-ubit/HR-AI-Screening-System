// import { Plus, Trash2 } from 'lucide-react';
// import { useEffect, useState } from 'react';
// import { CardSkeleton } from '../components/SkeletonLoader';
// import { createSkill, deleteSkill, getSkills } from '../lib/api';

// export default function SkillsPage() {
//   const [skills, setSkills] = useState([]);
//   const [newSkill, setNewSkill] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState('');

//   useEffect(() => {
//     fetchSkills();
//   }, []);

//   const fetchSkills = async () => {
//     setIsLoading(true);
//     try {
//       const data = await getSkills();
//       setSkills(data.skills || []);
//     } catch (err) {
//       setError(err.message || 'Unable to load skills');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleAddSkill = async (event) => {
//     event.preventDefault();
//     if (!newSkill.trim()) return;

//     try {
//       await createSkill({ name: newSkill.trim() });
//       setNewSkill('');
//       await fetchSkills();
//     } catch (err) {
//       setError(err.message || 'Failed to add skill');
//     }
//   };

//   const handleDeleteSkill = async (skillId) => {
//     try {
//       await deleteSkill(skillId);
//       await fetchSkills();
//     } catch (err) {
//       setError(err.message || 'Failed to delete skill');
//     }
//   };

//   return (
//     <div className="space-y-6">
//       {isLoading ? (
//         <CardSkeleton />
//       ) : (
//         <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//           <h2 className="mb-4 text-2xl font-semibold text-slate-900">Skill library</h2>

//           <form onSubmit={handleAddSkill} className="flex flex-col gap-3 sm:flex-row">
//             <input
//               value={newSkill}
//               onChange={(event) => setNewSkill(event.target.value)}
//               placeholder="Add a skill"
//               className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-slate-400"
//             />
//             <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
//               <Plus className="h-4 w-4" />
//               Add skill
//             </button>
//           </form>

//           {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
//         </div>
//       )}

//       <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
//         <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
//           {skills.map((skill) => (
//             <div key={skill.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
//               <span className="text-sm font-medium text-slate-700">{skill.name}</span>
//               <button type="button" onClick={() => handleDeleteSkill(skill.id)} className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600">
//                 <Trash2 className="h-4 w-4" />
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }


import { AlertCircle, Plus, RefreshCw, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CardSkeleton } from '../components/SkeletonLoader';
import ErrorState from '../components/ErrorState';
import { createSkill, deleteSkill, getSkills } from '../lib/api';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [deletingSkillId, setDeletingSkillId] = useState(null);

  const [loadError, setLoadError] = useState(null);
  const [actionError, setActionError] = useState(null);

  const fetchSkills = async (showLoader = true) => {
    if (showLoader) {
      setIsLoading(true);
    }

    setLoadError(null);

    try {
      const data = await getSkills();
      setSkills(data.skills || []);
    } catch (err) {
      console.error('Unable to load skills:', err);
      setLoadError(err);
    } finally {
      if (showLoader) {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  const handleAddSkill = async (event) => {
    event.preventDefault();

    const skillName = newSkill.trim();

    if (!skillName) {
      setActionError(new Error('Please enter a skill name.'));
      return;
    }

    setIsAdding(true);
    setActionError(null);

    try {
      await createSkill({
        name: skillName,
      });

      setNewSkill('');

      // Refresh without showing the full-page skeleton.
      await fetchSkills(false);
    } catch (err) {
      console.error('Failed to add skill:', err);
      setActionError(err);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    setDeletingSkillId(skillId);
    setActionError(null);

    try {
      await deleteSkill(skillId);

      // Refresh without showing the full-page skeleton.
      await fetchSkills(false);
    } catch (err) {
      console.error('Failed to delete skill:', err);
      setActionError(err);
    } finally {
      setDeletingSkillId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* =====================================================
          SKILL MANAGEMENT
      ====================================================== */}

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
            Skills
          </p>

          <h2 className="text-2xl font-semibold text-slate-900">
            Skill library
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Manage skills that can be assigned to jobs.
          </p>
        </div>

        {/* Add skill form */}

        <form
          onSubmit={handleAddSkill}
          className="flex flex-col gap-3 sm:flex-row"
        >
          <input
            value={newSkill}
            onChange={(event) => {
              setNewSkill(event.target.value);

              if (actionError) {
                setActionError(null);
              }
            }}
            placeholder="e.g. Python, React, FastAPI"
            disabled={isAdding}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none transition focus:border-slate-400 disabled:cursor-not-allowed disabled:opacity-60"
          />

          <button
            type="submit"
            disabled={isAdding}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Plus className="h-4 w-4" />

            {isAdding ? 'Adding...' : 'Add skill'}
          </button>
        </form>

        {/* Action error */}

        {actionError ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-rose-600" />

              <p className="text-sm text-rose-700">
                {actionError.message ||
                  'Something went wrong. Please try again.'}
              </p>
            </div>
          </div>
        ) : null}
      </div>

      {/* =====================================================
          SKILLS LIST
      ====================================================== */}

      {isLoading ? (
        <CardSkeleton />
      ) : loadError ? (
        <ErrorState
          title="Unable to load skills"
          message={
            loadError.message ||
            'We could not load the skill library. Please try again.'
          }
          onRetry={() => fetchSkills(true)}
        />
      ) : (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Available skills
              </h3>

              <p className="text-sm text-slate-500">
                {skills.length} skill{skills.length !== 1 ? 's' : ''}
              </p>
            </div>

            <button
              type="button"
              onClick={() => fetchSkills(false)}
              disabled={isLoading}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {/* Empty state */}

          {skills.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                  <Plus className="h-6 w-6 text-slate-500" />
                </div>

                <h3 className="text-base font-semibold text-slate-900">
                  No skills found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Add your first skill using the form above.
                </p>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {skills.map((skill) => {
                const isDeleting = deletingSkillId === skill.id;

                return (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3"
                  >
                    <span className="min-w-0 truncate text-sm font-medium text-slate-700">
                      {skill.name}
                    </span>

                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(skill.id)}
                      disabled={isDeleting}
                      className="shrink-0 rounded-lg border border-red-200 bg-red-50 p-2 text-red-600 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                      title="Delete skill"
                    >
                      {isDeleting ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}