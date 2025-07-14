import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const LanguageDistribution = ({ languages }) => {
  const colorMap = {
    JavaScript: '#f7df1e',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3776ab',
    Java: '#b07219',
    Go: '#00add8',
    Ruby: '#701516',
    PHP: '#4F5D95',
    C: '#555555',
    'C++': '#f34b7d',
    'C#': '#178600',
    Swift: '#ffac45',
    Kotlin: '#A97BFF',
    Rust: '#dea584',
    Dart: '#00B4AB',
  };

  const defaultColors = [
    '#6366F1', '#0EA5E9', '#8B5CF6', '#10B981', '#F59E0B',
    '#EF4444', '#EC4899', '#14B8A6', '#6B7280', '#A78BFA',
    '#34D399', '#F87171',
  ];

  const getLanguageColor = (language, index) => {
    return colorMap[language] || defaultColors[index % defaultColors.length];
  };

  const totalBytes = Object.values(languages).reduce((sum, bytes) => sum + bytes, 0);

  function formatBytes(bytes, decimals = 2) {
    if(bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    const checkDarkMode = () => {
      const dark = document.documentElement.classList.contains('dark');
      setIsDarkMode(dark);
    };

    checkDarkMode();

    const observer = new MutationObserver(() => {
      checkDarkMode();
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setShowChart(false);
    const timer = setTimeout(() => {
      setShowChart(true);
    }, 300);
    return () => clearTimeout(timer);
  }, [isDarkMode]);

  const chartData = {
    labels: Object.keys(languages),
    datasets: [
      {
        data: Object.values(languages),
        backgroundColor: Object.keys(languages).map((lang, idx) => getLanguageColor(lang, idx)),
        borderColor: Object.keys(languages).map((lang, idx) => getLanguageColor(lang, idx)),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          generateLabels(chart) {
            const data = chart.data;
            if(data.labels.length && data.datasets.length){
              return data.labels.map((label, i) => {
                const value = data.datasets[0].data[i];
                const percentage = ((value / totalBytes) * 100).toFixed(1);
                return {
                  text: `${label} (${percentage}%)`,
                  fillStyle: data.datasets[0].backgroundColor[i],
                  hidden: false,
                  index: i,
                  fontColor: isDarkMode ? '#fff' : '#000',
                };
              });
            }
            return [];
          },
          color: isDarkMode ? '#fff' : '#000',
        },
        onClick: () => {}, // Disable toggling on legend item click
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            const percentage = ((value / totalBytes) * 100).toFixed(1);
            return `${context.label}: ${percentage}% (${formatBytes(value)})`;
          },
        },
      },
    },
  };

  if(Object.keys(languages).length === 0){
    return (
      <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6 transition-colors duration-200">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Language Distribution
        </h3>
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No language data available for this repository.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-900 shadow-sm rounded-lg p-6 transition-colors duration-200">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Language Distribution
      </h3>
      <div className="h-64 flex justify-center items-center">
        {showChart ? (
          <Pie data={chartData} options={options} />
        ) : (
          <div className="text-gray-500 dark:text-gray-400">Loading chart...</div>
        )}
      </div>
      <div className="mt-4 text-sm text-gray-400 dark:text-gray-600">
        <p>Total size: {formatBytes(totalBytes)}</p>
      </div>
    </div>
  );
};

export default LanguageDistribution;
