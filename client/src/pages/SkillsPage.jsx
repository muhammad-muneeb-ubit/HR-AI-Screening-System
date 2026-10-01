import { Plus, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CardSkeleton } from '../components/SkeletonLoader';
import { createSkill, deleteSkill, getSkills } from '../lib/api';

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    setIsLoading(true);
    try {
      const data = await getSkills();
      setSkills(data.skills || []);
    } catch (err) {
      setError(err.message || 'Unable to load skills');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSkill = async (event) => {
    event.preventDefault();
    if (!newSkill.trim()) return;

    try {
      await createSkill({ name: newSkill.trim() });
      setNewSkill('');
      await fetchSkills();
    } catch (err) {
      setError(err.message || 'Failed to add skill');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await deleteSkill(skillId);
      await fetchSkills();
    } catch (err) {
      setError(err.message || 'Failed to delete skill');
    }
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <CardSkeleton />
      ) : (
        <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-2xl font-semibold text-slate-900">Skill library</h2>

          <form onSubmit={handleAddSkill} className="flex flex-col gap-3 sm:flex-row">
            <input
              value={newSkill}
              onChange={(event) => setNewSkill(event.target.value)}
              placeholder="Add a skill"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 outline-none focus:border-slate-400"
            />
            <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
              <Plus className="h-4 w-4" />
              Add skill
            </button>
          </form>

          {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
        </div>
      )}

      <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {skills.map((skill) => (
            <div key={skill.id} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <span className="text-sm font-medium text-slate-700">{skill.name}</span>
              <button type="button" onClick={() => handleDeleteSkill(skill.id)} className="rounded-lg border border-red-200 bg-red-50 p-2 text-red-600">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
