import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Search, ListFilter, SortAsc, SortDesc, Loader } from 'lucide-react';
import useUserStore from '../stores/userStore';
import ProfileHeader from '../components/User/ProfileHeader';
import RepositoryCard from '../components/User/RepositoryCard';

const UserProfile = () => {
  const { username } = useParams();
  const { 
    user, 
    repositories, 
    isLoading, 
    error, 
    fetchUser, 
    fetchUserRepositories, 
    searchRepositories 
  } = useUserStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRepos, setFilteredRepos] = useState([]);
  const [sortBy, setSortBy] = useState('updated');
  const [sortOrder, setSortOrder] = useState('desc');
  const [filterLanguage, setFilterLanguage] = useState(null);
  const [availableLanguages, setAvailableLanguages] = useState([]);
  
  useEffect(() => {
    if(username){
      fetchUser(username);
      fetchUserRepositories(username);
    }
  }, [username, fetchUser, fetchUserRepositories]);
  
  useEffect(() => {
    if(repositories.length > 0){
      const languages = repositories
        .map(repo => repo.language)
        .filter(lang => !!lang);
      
      setAvailableLanguages([...new Set(languages)].sort());
    }
  }, [repositories]);
  
  useEffect(() => {
    let results = searchQuery ? searchRepositories(searchQuery) : [...repositories];
    
    if(filterLanguage){
      results = results.filter(repo => repo.language === filterLanguage);
    }
    
    results.sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'stars':
          comparison = a.stargazers_count - b.stargazers_count;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'updated':
        default:
          comparison = new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredRepos(results);
  }, [repositories, searchQuery, sortBy, sortOrder, filterLanguage, searchRepositories]);
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  if(error){
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-800 rounded-lg p-6 text-red-800 dark:text-red-200">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <div className="mt-4 p-4 bg-red-100 dark:bg-red-800 rounded-lg">
            <h3 className="font-semibold mb-2">Troubleshooting:</h3>
            <ul className="text-sm space-y-1">
              <li>• Make sure the backend server is running on http://localhost:5000</li>
              <li>• Check if you have a valid GitHub token configured</li>
              <li>• Verify the backend API endpoints are accessible</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <ProfileHeader user={user} isLoading={isLoading} />
      
      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6 mb-6 transition-colors duration-200">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Repositories
            {!isLoading && repositories.length > 0 && (
              <span className="ml-2 text-lg font-normal text-gray-600 dark:text-gray-400">
                ({repositories.length})
              </span>
            )}
          </h2>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-64 py-2 px-4 pr-10 rounded-lg border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors"
              />
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            
            <div className="flex gap-2">
              <div className="relative group">
                <button 
                  className="flex items-center space-x-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <ListFilter className="h-5 w-5" />
                  <span>{filterLanguage || 'All languages'}</span>
                </button>
                
                <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10 max-h-72 overflow-y-auto">
                  <button
                    onClick={() => setFilterLanguage(null)}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg ${
                      !filterLanguage ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    All languages
                  </button>
                  
                  {availableLanguages.map(language => (
                    <button
                      key={language}
                      onClick={() => setFilterLanguage(language)}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                        filterLanguage === language ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="relative group">
                <button 
                  className="flex items-center space-x-1 py-2 px-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                >
                  <SortAsc className="h-5 w-5" />
                  <span>Sort: {sortBy}</span>
                </button>
                
                <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 hidden group-hover:block z-10">
                  <button
                    onClick={() => setSortBy('updated')}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-t-lg ${
                      sortBy === 'updated' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Last updated
                  </button>
                  
                  <button
                    onClick={() => setSortBy('stars')}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
                      sortBy === 'stars' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Stars
                  </button>
                  
                  <button
                    onClick={() => setSortBy('name')}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-b-lg ${
                      sortBy === 'name' ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    Name
                  </button>
                </div>
              </div>
              
              <button
                onClick={toggleSortOrder}
                className="flex items-center justify-center p-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                title={sortOrder === 'asc' ? 'Ascending' : 'Descending'}
              >
                {sortOrder === 'asc' ? (
                  <SortAsc className="h-5 w-5" />
                ) : (
                  <SortDesc className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader className="h-8 w-8 text-primary-600 dark:text-primary-400 animate-spin" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading repositories...</span>
          </div>
        ) : filteredRepos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRepos.map((repo) => (
              <RepositoryCard key={repo.id} repository={repo} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            {searchQuery || filterLanguage ? (
              <p>No repositories match your search criteria.</p>
            ) : (
              <p>This user doesn't have any public repositories yet.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
