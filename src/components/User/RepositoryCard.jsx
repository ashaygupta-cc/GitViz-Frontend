import React from 'react';
import { Link } from 'react-router-dom';
import { Star, GitFork, Clock, Code } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RepositoryCard = ({ repository }) => {
  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-5 hover:shadow-md transition-all duration-200 border border-transparent hover:border-primary-200 dark:hover:border-primary-800">
      <div className="flex justify-between items-start mb-3">
        <Link
          to={`/user/${repository.owner.login}/repo/${repository.name}`}
          className="text-lg font-semibold text-primary-600 dark:text-primary-400 hover:underline transition-colors"
        >
          {repository.name}
        </Link>

        <div className="flex items-center space-x-3 text-gray-600 dark:text-gray-400">
          {repository.stargazers_count > 0 && (
            <div className="flex items-center">
              <Star className="h-4 w-4 text-warning-500 mr-1" />
              <span>{repository.stargazers_count}</span>
            </div>
          )}

          {repository.forks_count > 0 && (
            <div className="flex items-center">
              <GitFork className="h-4 w-4 text-primary-500 mr-1" />
              <span>{repository.forks_count}</span>
            </div>
          )}
        </div>
      </div>

      {repository.description ? (
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {repository.description}
        </p>
      ) : (
        <p className="italic text-gray-500 mb-4">No description provided.</p>
      )}

      <div className="flex flex-wrap items-center mt-4 text-sm text-gray-600 dark:text-gray-400">
        {repository.language && (
          <div className="flex items-center mr-4 mb-2">
            <span className="w-3 h-3 rounded-full bg-highlight-500 mr-1"></span>
            <span>{repository.language}</span>
          </div>
        )}

        <div className="flex items-center mr-4 mb-2">
          <Clock className="h-4 w-4 mr-1" />
          <span>Updated {formatDistanceToNow(new Date(repository.updated_at), { addSuffix: true })}</span>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-center">
          <img
            src={repository.owner.avatar_url}
            alt={`${repository.owner?.login || 'user'}'s avatar`}
            className="w-6 h-6 rounded-full mr-2"
          />
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {repository.owner.login}
          </span>
        </div>

        <a
          href={repository.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
        >
          <Code className="h-4 w-4 inline mr-1" />
          <span>View code</span>
        </a>
      </div>
    </div>
  );
};

export default RepositoryCard;
