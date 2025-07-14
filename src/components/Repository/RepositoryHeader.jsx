import React from 'react';
import { Star, GitFork, Eye, Clock, Code } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RepositoryHeader = ({ repository }) => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6 mb-6 transition-colors duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            {repository.name}
          </h1>
          {repository.description && (
            <p className="text-gray-600 dark:text-gray-400 mb-3">
              {repository.description}
            </p>
          )}
        </div>

        <div className="flex items-center space-x-4 mt-4 md:mt-0">
          <a
            href={repository.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
          >
            <Code className="h-4 w-4" />
            <span>View on GitHub</span>
          </a>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
        <div className="flex items-center space-x-1">
          <Star className="h-4 w-4 text-warning-500" />
          <span>{repository.stargazers_count} stars</span>
        </div>

        <div className="flex items-center space-x-1">
          <GitFork className="h-4 w-4 text-primary-500" />
          <span>{repository.forks_count} forks</span>
        </div>

        <div className="flex items-center space-x-1">
          <Eye className="h-4 w-4 text-accent-500" />
          <span>{repository.watchers_count} watchers</span>
        </div>

        {repository.language && (
          <div className="flex items-center space-x-1">
            <span className="w-3 h-3 rounded-full bg-highlight-500"></span>
            <span>{repository.language}</span>
          </div>
        )}

        <div className="flex items-center space-x-1">
          <Clock className="h-4 w-4" />
          <span>Updated {formatDistanceToNow(new Date(repository.updated_at))} ago</span>
        </div>
      </div>
    </div>
  );
};

export default RepositoryHeader;
