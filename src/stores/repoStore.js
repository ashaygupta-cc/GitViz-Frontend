import {create} from 'zustand';
import { getRepositoryTree, getRepositoryLanguages } from '../github';
import { processTreeData } from '../utils/treeutils';

const useRepoStore = create((set, get) => ({
  repoOwner: '',
  repoName: '',
  treeData: [],
  languages: {},
  isLoading: false,
  error: null,

  fetchRepositoryTree: async (owner, repo, branch) => {
    try{
      set({ isLoading: true, error: null, repoOwner: owner, repoName: repo });

      // Default branch
      let targetBranch = branch;
      if(!branch){
        const repoInfo = await getRepositoryTree(owner, repo);
        targetBranch = repoInfo.default_branch;
      }

      // Tree
      const { tree } = await getRepositoryTree(owner, repo, targetBranch, true);
      const processedTree = processTreeData(tree);
      
      set({ treeData: processedTree });
      return processedTree;
    } 
    catch(err){
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repository tree';
      set({ error: errorMessage });
      console.error('API Error:', err);
      throw err;
    } 
    finally{
      set({ isLoading: false });
    }
  },

  fetchRepositoryLanguages: async (owner, repo) => {
    try{
      set({ isLoading: true, error: null });
      const languages = await getRepositoryLanguages(owner, repo);
      set({ languages: languages });
      return languages;
    } 
    catch(err){
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch repository languages';
      set({ error: errorMessage });
      throw err;
    } 
    finally{
      set({ isLoading: false });
    }
  },

  reset: () => set({
    repoOwner: '',
    repoName: '',
    treeData: [],
    languages: {},
    isLoading: false,
    error: null
  })
}));

export default useRepoStore;