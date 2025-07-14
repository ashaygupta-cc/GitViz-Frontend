const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

async function fetchJSON(url) {
  try {
    const res = await fetch(url);
    
    // Check if response is HTML (likely an error page)
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('text/html')) {
      throw new Error('Backend server is not responding. Please ensure the backend is running on http://localhost:5000');
    }
    
    if (!res.ok) {
      const error = await res.json().catch(() => ({ message: `HTTP ${res.status}: ${res.statusText}` }));
      throw new Error(error?.message || `GitHub API call failed: ${res.status} ${res.statusText}`);
    }
    
    return res.json();
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Cannot connect to backend server. Please ensure the backend is running on http://localhost:5000');
    }
    throw error;
  }
}

export const getUser = (username) =>
  fetchJSON(`${BASE_URL}/api/user/${encodeURIComponent(username)}`);

export const getUserRepositories = (username) =>
  fetchJSON(`${BASE_URL}/api/user/${encodeURIComponent(username)}/repos`);

export const getUserStarredRepos = (username) =>
  fetchJSON(`${BASE_URL}/api/user/${encodeURIComponent(username)}/starred`);

export const getRepositoryTree = (owner, repo, branch) => {
  let url = `${BASE_URL}/api/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/tree`;
  if (branch) url += `?branch=${encodeURIComponent(branch)}`;
  return fetchJSON(url);
};

export const getRepositoryLanguages = (owner, repo) =>
  fetchJSON(`${BASE_URL}/api/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/languages`);   