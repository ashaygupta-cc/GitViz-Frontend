import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import useUserStore from '../stores/userStore';
import useRepoStore from '../stores/repoStore';
import RepositoryHeader from '../components/Repository/RepositoryHeader';
import FlowChartView from '../components/Repository/FlowChartView';
import LanguageDistribution from '../components/Repository/LanguageDistribution';

const RepositoryDetail = () => {
  const { username, repoName } = useParams();
  const { repositories, isLoading: isUserLoading, fetchUserRepositories } = useUserStore();
  const {
    treeData,
    languages,
    isLoading: isRepoLoading,
    error,
    fetchRepositoryTree,
    fetchRepositoryLanguages,
  } = useRepoStore();

  useEffect(() => {
    if (username && repositories.length === 0) {
      fetchUserRepositories(username);
    }
  }, [username, repositories.length, fetchUserRepositories]);

  useEffect(() => {
    if (username && repoName) {
      fetchRepositoryTree(username, repoName);
      fetchRepositoryLanguages(username, repoName);
    }
  }, [username, repoName, fetchRepositoryTree, fetchRepositoryLanguages]);

  const repository = repositories.find((repo) => repo.name === repoName);
  const isLoading = isUserLoading || isRepoLoading;

  if (error) {
    return (
      <div
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden py-8"
        style={{ maxWidth: '100vw', overflowX: 'hidden' }}
      >
        <div className="bg-red-100 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-800 dark:text-red-200">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <div className="mt-4 p-4 bg-red-50 dark:bg-red-800 rounded-lg">
            <h3 className="font-semibold mb-2">Troubleshooting:</h3>
            <ul className="text-sm space-y-1">
              <li>• Make sure the backend server is running on http://localhost:5000</li>
              <li>• Check if you have a valid GitHub token configured</li>
              <li>• Verify the repository exists and is accessible</li>
            </ul>
          </div>
          <Link
            to={`/user/${username}`}
            className="inline-flex items-center mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to user profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="no-horizontal-scroll"
      style={{ maxWidth: '100vw', overflowX: 'hidden' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden py-8">
        <div className="mb-6">
          <Link
            to={`/user/${username}`}
            className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 mr-1" />
            Back to {username}'s profile
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="h-8 w-8 text-blue-600 dark:text-blue-400 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Loading repository data...
            </span>
          </div>
        ) : repository ? (
          <>
            <RepositoryHeader repository={repository} />

           
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <FlowChartView />
              </div>
              <div className="block lg:block hidden">
        
                <LanguageDistribution languages={languages} />
              </div>
            </div>

            <div className="lg:hidden mb-6">
              <LanguageDistribution languages={languages} />
            </div>
          </>
        ) : (
          <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6 text-center text-gray-600 dark:text-gray-400">
            <p>Repository not found.</p>
            <Link
              to={`/user/${username}`}
              className="inline-flex items-center mt-4 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to user profile
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RepositoryDetail;
