const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

async function request(url, options = {}) {
  const headers = new Headers(options.headers || {});

  if (!(options.body instanceof FormData) && options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get('content-type') || '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof payload === 'object' ? payload?.detail || payload?.message : payload;
    throw new Error(message || 'Request failed');
  }

  return payload;
}

export const getJobs = () => request('/jobs/');
export const getJobById = (jobId) => request(`/jobs/${jobId}`);
export const createJob = (payload) => request('/jobs/', {
  method: 'POST',
  body: JSON.stringify(payload),
});
export const updateJob = (jobId, payload) => request(`/jobs/${jobId}`, {
  method: 'PUT',
  body: JSON.stringify(payload),
});
export const deleteJob = (jobId) => request(`/jobs/${jobId}`, { method: 'DELETE' });
export const getJobSkills = (jobId) => request(`/jobs/${jobId}/skills`);
export const addJobSkill = (jobId, payload) => request(`/jobs/${jobId}/skills`, {
  method: 'POST',
  body: JSON.stringify(payload),
});
export const removeJobSkill = (jobId, skillId) => request(`/jobs/${jobId}/skills/${skillId}`, { method: 'DELETE' });

export const getSkills = () => request('/skills/');
export const createSkill = (payload) => request('/skills/', {
  method: 'POST',
  body: JSON.stringify(payload),
});
export const deleteSkill = (skillId) => request(`/skills/${skillId}`, { method: 'DELETE' });

export const getDashboardMetrics = () => request('/dashboard/');
export const getAllResumes = () => request('/resume/');
export const deleteResume = (resumeId) => request(`/resume/${resumeId}`, { method: 'DELETE' });
export const getJobAnalysisResults = (jobId) => request(`/resume/${jobId}`);
export const getAnalysisById = (analysisId) => request(`/resume/analysis/${analysisId}`);

export const getCandidateById = (candidateId) => request(`/candidate/${candidateId}`);
export const exportJobAnalysis = (jobId) => fetch(`${API_BASE}/resume/export/${jobId}`)
  .then(async (response) => {
    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload?.detail || 'Export failed');
    }
    return response.blob();
  });

export const uploadResumeFiles = (jobId, formData) =>
  fetch(`${API_BASE}/resume/${jobId}`, {
    method: 'POST',
    body: formData,
  }).then(async (response) => {
    const contentType = response.headers.get('content-type') || '';
    const payload = contentType.includes('application/json') ? await response.json() : await response.text();

    if (!response.ok) {
      const message = typeof payload === 'object' ? payload?.detail || payload?.message : payload;
      throw new Error(message || 'Upload failed');
    }

    return payload;
  });
