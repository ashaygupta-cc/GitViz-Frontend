import { useState, useCallback } from 'react';
import { getUser, getUserRepositories, getUserStarredRepos } from '../github';

function useUserStore() {
  const [user, setUser] = useState(null);
  const [repositories, setRepositories] = useState([]);
  const [starredRepos, setStarredRepos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async (username) => {
    try{
      setIsLoading(true);
      setError(null);
      const userData = await getUser(username);
      setUser(userData);
    } 
    catch(err){
      setError(err instanceof Error ? err.message : 'Failed to fetch user data');
    } 
    finally{
      setIsLoading(false);
    }
  }, []);

  const fetchUserRepositories = useCallback(async (username) => {
    try{
      setIsLoading(true);
      setError(null);
      const repos = await getUserRepositories(username);
      setRepositories(repos);
    } 
    catch(err){
      setError(err instanceof Error ? err.message : 'Failed to fetch repositories');
    } 
    finally{
      setIsLoading(false);
    }
  }, []);

  const fetchUserStarredRepos = useCallback(async (username) => {
    try{
      setIsLoading(true);
      setError(null);
      const starred = await getUserStarredRepos(username);
      setStarredRepos(starred);
    } 
    catch(err){
      setError(err instanceof Error ? err.message : 'Failed to fetch starred repositories');
    } 
    finally{
      setIsLoading(false);
    }
  }, []);

  const searchRepositories = useCallback((query) => {
    if(!query) return repositories;

    const lowercasedQuery = query.toLowerCase();
    return repositories.filter(
      (repo) =>
        repo.name.toLowerCase().includes(lowercasedQuery) ||
        (repo.description && repo.description.toLowerCase().includes(lowercasedQuery)) ||
        (repo.language && repo.language.toLowerCase().includes(lowercasedQuery))
    );
  }, [repositories]);

  const reset = useCallback(() => {
    setUser(null);
    setRepositories([]);
    setStarredRepos([]);
    setIsLoading(false);
    setError(null);
  }, []);

  return {
    user,
    repositories,
    starredRepos,
    isLoading,
    error,
    fetchUser,
    fetchUserRepositories,
    fetchUserStarredRepos,
    searchRepositories,
    reset,
  };
}

export default useUserStore;
