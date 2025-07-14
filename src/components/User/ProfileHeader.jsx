import React from 'react';
import {
  MapPin,
  Link as LinkIcon,
  Mail,
  Calendar,
  Users,
  Briefcase,
} from 'lucide-react';
import { format } from 'date-fns';

const ProfileHeader = ({ user, isLoading = false }) => {
  if(isLoading){
    return (
      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6 animate-pulse transition-colors duration-200">
        <div className="flex flex-col md:flex-row">
          <div className="w-32 h-32 bg-gray-300 dark:bg-gray-700 rounded-full mb-4 md:mb-0 md:mr-6"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-48 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-64 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-32 mb-4"></div>
            <div className="h-4 bg-gray-300 dark:bg-gray-700 rounded w-40 mb-4"></div>
          </div>
        </div>
      </div>
    );
  }

  if(!user) return null;

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6 mb-6 transition-colors duration-200">
      <div className="flex flex-col md:flex-row">
        <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
          <img
            src={user?.avatar_url}
            alt={`${user?.login}'s avatar`}
            className="w-32 h-32 rounded-full border-4 border-primary-200 dark:border-primary-800 transition-colors"
          />
        </div>

        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user?.name || user?.login}
              </h1>
              <p className="text-gray-600 dark:text-gray-400 text-lg">@{user?.login}</p>
            </div>

            <div className="mt-4 md:mt-0">
              <a
                href={user?.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors"
              >
                View on GitHub
              </a>
            </div>
          </div>

          {user?.bio && (
            <p className="text-gray-700 dark:text-gray-300 mb-4">{user.bio}</p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-4 text-sm">
            {user?.company && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Briefcase className="h-4 w-4 mr-2" />
                <span>{user.company}</span>
              </div>
            )}

            {user?.location && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{user.location}</span>
              </div>
            )}

            {user?.blog && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <LinkIcon className="h-4 w-4 mr-2" />
                <a
                  href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {user.blog}
                </a>
              </div>
            )}

            {user?.email && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                <a
                  href={`mailto:${user.email}`}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {user.email}
                </a>
              </div>
            )}

            {user?.created_at && (
              <div className="flex items-center text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-2" />
                <span>Joined {format(new Date(user.created_at), 'MMMM d, yyyy')}</span>
              </div>
            )}

            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <Users className="h-4 w-4 mr-2" />
              <span>
                <span className="font-medium">{user?.followers}</span> followers ·{' '}
                <span className="font-medium">{user?.following}</span> following
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center transition-colors">
          <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            {user?.public_repos}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Repositories</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center transition-colors">
          <div className="text-2xl font-bold text-accent-600 dark:text-accent-400">
            {user?.public_gists}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Gists</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center transition-colors">
          <div className="text-2xl font-bold text-highlight-600 dark:text-highlight-400">
            {user?.followers}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Followers</div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 text-center transition-colors">
          <div className="text-2xl font-bold text-success-600 dark:text-success-400">
            {user?.following}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">Following</div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
