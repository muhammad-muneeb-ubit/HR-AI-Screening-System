// // const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api' || 'http://localhost:8000/api' || "https://hr-ai-screening-system.onrender.com/";
// const API_BASE = "https://hr-ai-screening-system.onrender.com/api";
// // const API_BASE = "http://localhost:5000/api";

// async function request(url, options = {}) {
//   const headers = new Headers(options.headers || {});

//   if (!(options.body instanceof FormData) && options.body && !headers.has('Content-Type')) {
//     headers.set('Content-Type', 'application/json');
//   }

//   const response = await fetch(`${API_BASE}${url}`, {
//     ...options,
//     headers,
//   });

//   const contentType = response.headers.get('content-type') || '';
//   const payload = contentType.includes('application/json') ? await response.json() : await response.text();

//   if (!response.ok) {
//     const message = typeof payload === 'object' ? payload?.detail || payload?.message : payload;
//     throw new Error(message || 'Request failed');
//   }

//   return payload;
// }

// export const getJobs = () => request('/jobs/');
// export const getJobById = (jobId) => request(`/jobs/${jobId}`);
// export const createJob = (payload) => request('/jobs/', {
//   method: 'POST',
//   body: JSON.stringify(payload),
// });
// export const updateJob = (jobId, payload) => request(`/jobs/${jobId}`, {
//   method: 'PUT',
//   body: JSON.stringify(payload),
// });
// export const deleteJob = (jobId) => request(`/jobs/${jobId}`, { method: 'DELETE' });
// export const getJobSkills = (jobId) => request(`/jobs/${jobId}/skills`);
// export const addJobSkill = (jobId, payload) => request(`/jobs/${jobId}/skills`, {
//   method: 'POST',
//   body: JSON.stringify(payload),
// });
// export const removeJobSkill = (jobId, skillId) => request(`/jobs/${jobId}/skills/${skillId}`, { method: 'DELETE' });

// export const getSkills = () => request('/skills/');
// export const getStatus = () => request('/health');
// export const createSkill = (payload) => request('/skills/', {
//   method: 'POST',
//   body: JSON.stringify(payload),
// });
// export const deleteSkill = (skillId) => request(`/skills/${skillId}`, { method: 'DELETE' });

// export const getDashboardMetrics = () => request('/dashboard/');
// export const getAllResumes = () => request('/resume/');
// export const deleteResume = (resumeId) => request(`/resume/${resumeId}`, { method: 'DELETE' });
// export const getJobAnalysisResults = (jobId) => request(`/resume/${jobId}`);
// export const getAnalysisById = (analysisId) => request(`/resume/analysis/${analysisId}`);

// export const getCandidateById = (candidateId) => request(`/candidate/${candidateId}`);
// export const exportJobAnalysis = (jobId) => fetch(`${API_BASE}/resume/export/${jobId}`)
//   .then(async (response) => {
//     if (!response.ok) {
//       const payload = await response.json().catch(() => ({}));
//       throw new Error(payload?.detail || 'Export failed');
//     }
//     return response.blob();
//   });

// export const uploadResumeFiles = (jobId, formData) =>
//   fetch(`${API_BASE}/resume/${jobId}`, {
//     method: 'POST',
//     body: formData,
//   }).then(async (response) => {
//     const contentType = response.headers.get('content-type') || '';
//     const payload = contentType.includes('application/json') ? await response.json() : await response.text();

//     if (!response.ok) {
//       const message = typeof payload === 'object' ? payload?.detail || payload?.message : payload;
//       throw new Error(message || 'Upload failed');
//     }

//     return payload;
//   });


// const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://hr-ai-screening-system.onrender.com/api';
 const API_BASE = "http://localhost:5000/api";

export class ApiError extends Error {
  constructor(message, status = null, type = 'unknown') {
    super(message);

    this.name = 'ApiError';
    this.status = status;
    this.type = type;
  }
}

function getFriendlyError(status, payload) {
  // Try to get backend message first
  const backendMessage =
    typeof payload === 'object'
      ? payload?.detail || payload?.message
      : payload;

  switch (status) {
    case 400:
      return backendMessage || 'Some of the information you entered is invalid. Please check and try again.';

    case 401:
      return 'Your session has expired. Please sign in again.';

    case 403:
      return 'You do not have permission to perform this action.';

    case 404:
      return backendMessage || 'The requested information could not be found.';

    case 409:
      return backendMessage || 'This record already exists or conflicts with existing data.';

    case 422:
      return backendMessage || 'Some information is missing or invalid. Please check your input.';

    case 429:
      return 'Too many requests. Please wait a moment and try again.';

    case 500:
      return 'Something went wrong on the server. Please try again later.';

    case 502:
    case 503:
    case 504:
      return 'The server is temporarily unavailable. Please try again in a moment.';

    default:
      return backendMessage || 'Something went wrong. Please try again.';
  }
}


async function request(url, options = {}) {
  const headers = new Headers(options.headers || {});

  if (
    !(options.body instanceof FormData) &&
    options.body &&
    !headers.has('Content-Type')
  ) {
    headers.set('Content-Type', 'application/json');
  }

  let response;

  try {
    response = await fetch(`${API_BASE}${url}`, {
      ...options,
      headers,
    });
  } catch (error) {
    /*
     * fetch() throws TypeError: Failed to fetch when:
     *
     * - internet is unavailable
     * - backend is down
     * - Render server is sleeping/unavailable
     * - DNS/network problem
     * - browser blocks the request
     */

    console.error('Network error:', error);

    throw new ApiError(
      'Unable to connect to the server. Please check your internet connection and try again.',
      null,
      'network'
    );
  }

  /*
   * Read response safely
   */

  let payload = null;

  try {
    const contentType = response.headers.get('content-type') || '';

    payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();
  } catch (error) {
    console.error('Response parsing error:', error);

    throw new ApiError(
      'The server returned an invalid response. Please try again.',
      response.status,
      'parse'
    );
  }

  /*
   * Handle HTTP errors
   */

  if (!response.ok) {
    const message = getFriendlyError(response.status, payload);

    console.error('API Error:', {
      status: response.status,
      url,
      payload,
    });

    throw new ApiError(
      message,
      response.status,
      'http'
    );
  }

  return payload;
}

export const getJobs = () =>
  request('/jobs/');

export const getJobById = (jobId) =>
  request(`/jobs/${jobId}`);

export const createJob = (payload) =>
  request('/jobs/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateJob = (jobId, payload) =>
  request(`/jobs/${jobId}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const deleteJob = (jobId) =>
  request(`/jobs/${jobId}`, {
    method: 'DELETE',
  });

export const getJobSkills = (jobId) =>
  request(`/jobs/${jobId}/skills`);

export const addJobSkill = (jobId, payload) =>
  request(`/jobs/${jobId}/skills`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const removeJobSkill = (jobId, skillId) =>
  request(`/jobs/${jobId}/skills/${skillId}`, {
    method: 'DELETE',
  });

export const getSkills = () =>
  request('/skills/');

export const getStatus = () =>
  request('/health');

export const createSkill = (payload) =>
  request('/skills/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const deleteSkill = (skillId) =>
  request(`/skills/${skillId}`, {
    method: 'DELETE',
  });

export const getDashboardMetrics = () =>
  request('/dashboard/');

export const getAllResumes = () =>
  request('/resume/');

export const deleteResume = (resumeId) =>
  request(`/resume/${resumeId}`, {
    method: 'DELETE',
  });

export const getJobAnalysisResults = (jobId) =>
  request(`/resume/${jobId}`);

export const getAnalysisById = (analysisId) =>
  request(`/resume/analysis/${analysisId}`);

export const getCandidateById = (candidateId) =>
  request(`/candidate/${candidateId}`);

export const exportJobAnalysis = async (jobId) => {
  let response;

  try {
    response = await fetch(
      `${API_BASE}/resume/export/${jobId}`
    );
  } catch (error) {
    console.error('Export network error:', error);

    throw new ApiError(
      'Unable to connect to the server. Please check your internet connection and try again.',
      null,
      'network'
    );
  }

  if (!response.ok) {
    let payload = {};

    try {
      payload = await response.json();
    } catch {
      // Ignore JSON parsing failure
    }

    throw new ApiError(
      getFriendlyError(response.status, payload),
      response.status,
      'http'
    );
  }

  return response.blob();
};

export const uploadResumeFiles = async (jobId, formData) => {
  let response;

  try {
    response = await fetch(
      `${API_BASE}/resume/${jobId}`,
      {
        method: 'POST',
        body: formData,
      }
    );
  } catch (error) {
    console.error('Upload network error:', error);

    throw new ApiError(
      'Unable to connect to the server. Please check your internet connection and try again.',
      null,
      'network'
    );
  }

  let payload = null;

  try {
    const contentType =
      response.headers.get('content-type') || '';

    payload = contentType.includes('application/json')
      ? await response.json()
      : await response.text();
  } catch (error) {
    console.error('Upload response parsing error:', error);

    throw new ApiError(
      'The server returned an invalid response. Please try again.',
      response.status,
      'parse'
    );
  }

  if (!response.ok) {
    throw new ApiError(
      getFriendlyError(response.status, payload),
      response.status,
      'http'
    );
  }

  return payload;
};
