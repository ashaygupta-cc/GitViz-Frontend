import { File as FileTree, GitBranch, Github as GitHub, Search, User } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      navigate(`/user/${username.trim()}`); // For WhiteSpaces Removal
    }
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 transition-colors duration-200">
      <div className="max-w-4xl w-full text-center">
        <div className="flex justify-center mb-6">
          <GitBranch className="h-16 w-16 text-primary-600 dark:text-primary-400" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-highlight-600 dark:from-primary-400 dark:to-highlight-400 text-transparent bg-clip-text">
          GitViz - GitHub Visual Explorer
        </h1>

        <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
          Visualize GitHub repositories with beautiful flowcharts and explore code structure in a whole new way.
        </p>

        <form onSubmit={handleSubmit} className="mb-12 max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Enter GitHub username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full py-3 px-5 pr-12 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm transition-colors"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
            >
              <Search className="h-6 w-6" />
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex justify-center mb-4">
              <FileTree className="h-10 w-10 text-primary-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Visual Repository Explorer
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Navigate through repository structures with interactive flowcharts. Understand code organization at a glance.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex justify-center mb-4">
              <User className="h-10 w-10 text-accent-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Developer Profiles
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Explore developer profiles with comprehensive stats and visualizations of their GitHub activity and projects.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex justify-center mb-4">
              <GitHub className="h-10 w-10 text-highlight-500" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
              Code Insights
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Gain insights into repository languages, contribution patterns, and code structure with detailed analytics.
            </p>
          </div>
        </div>

        <p className="mt-12 text-sm text-gray-500 dark:text-gray-500">
          GitViz uses the GitHub API to visualize public repositories. No authentication required.
        </p>
         <div className="text-center text-sm text-gray-500 mt-1 pt-6">
          &copy; 2025 GitViz. Built with ❤️ for open-source explorers.
        <p>Developed and maintained by <b>Ashay Gupta</b>.</p>
        <p> All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
