import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Folder, FileText, ChevronRight, ChevronDown } from 'lucide-react';

// Recursive component to render file/folder tree
const RepoTreeItem = ({ item, depth, username, repoName: currentRepoName }) => {
  const [isOpen, setIsOpen] = useState(false);
  const isFolder = item.type === 'tree';
  const itemPath = item.path;
  const itemName = item.path.split('/').pop();

  const paddingLeft = { paddingLeft: `${depth * 16 + 8}px` }; 
  const handleClick = () => {
    if (isFolder) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div>
      <Link
        to={`/user/${username}/repo/${currentRepoName}?path=${itemPath}`} // Example: pass path as query param
        className={`flex items-center space-x-1 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
          'text-gray-700 dark:text-gray-300'
        }`}
        style={paddingLeft}
        onClick={handleClick}
      >
        {isFolder ? (
          isOpen ? (
            <ChevronDown size={16} className="flex-shrink-0" />
          ) : (
            <ChevronRight size={16} className="flex-shrink-0" />
          )
        ) : (
          <span className="w-4 h-4 flex-shrink-0"></span>
        )}
        {isFolder ? (
          <Folder className="h-4 w-4 flex-shrink-0 text-blue-500" />
        ) : (
          <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
        )}
        <span className="truncate text-sm" title={itemName}>
          {itemName}
        </span>
      </Link>
      {isFolder && isOpen && item.children && (
        <div className="pl-2">
          {item.children.map((child) => (
            <RepoTreeItem
              key={child.path}
              item={child}
              depth={depth + 1}
              username={username}
              currentRepoName={currentRepoName}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Sidebar = ({ repositories, treeData }) => { 
  const { repoName, username } = useParams();

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-[calc(100vh-64px)] sticky top-16 overflow-y-auto transition-colors duration-200">
      <div className="p-4">
        <Link
          to={`/user/${username}`}
          className="block text-2xl font-semibold text-center text-gray-800 dark:text-gray-100 mt-2 mb-4 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          {username}'s Repositories
        </Link>

        <div className="space-y-1 mb-4">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 px-2">Repositories</h3>
          {repositories.map((repo) => (
            <Link
              key={repo.id}
              to={`/user/${username}/repo/${repo.name}`}
              className={`flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${
                repo.name === repoName
                  ? 'bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              <Folder className="h-5 w-5" />
              <span className="truncate">{repo.name}</span>
            </Link>
          ))}
        </div>

        {repoName && treeData && ( 
          <div className="space-y-1">
            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 px-2">
              {repoName} Structure
            </h3>
            {treeData.map((item) => (
              <RepoTreeItem
                key={item.path}
                item={item}
                depth={0}
                username={username}
                currentRepoName={repoName}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
