import React from 'react';
import { useApp } from '../../context/AppContext';

const FilterPanel = ({ filters, setFilters }) => {
  const { t } = useApp();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Subject Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {t('subject')}
          </label>
          <select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="w-full px-4 py-2.5 bg-white/80 dark:bg-gray-700/80 
                     border border-gray-200/50 dark:border-gray-600/50
                     rounded-xl text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                     transition-all duration-200"
          >
            <option value="">{t('allSubjects')}</option>
            <option value="mathematics">{t('mathematics')}</option>
            <option value="science">{t('science')}</option>
            <option value="english">{t('english')}</option>
          </select>
        </div>

        {/* Grade Level Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {t('gradeLevel')}
          </label>
          <select
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            className="w-full px-4 py-2.5 bg-white/80 dark:bg-gray-700/80 
                     border border-gray-200/50 dark:border-gray-600/50
                     rounded-xl text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                     transition-all duration-200"
          >
            <option value="">{t('allGrades')}</option>
            <option value="elementary">{t('elementary')}</option>
            <option value="middle">{t('middleSchool')}</option>
            <option value="high">{t('highSchool')}</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {t('status')}
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full px-4 py-2.5 bg-white/80 dark:bg-gray-700/80 
                     border border-gray-200/50 dark:border-gray-600/50
                     rounded-xl text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                     transition-all duration-200"
          >
            <option value="">{t('allStatuses')}</option>
            <option value="confirmed">{t('confirmed')}</option>
            <option value="pending">{t('pending')}</option>
            <option value="cancelled">{t('cancelled')}</option>
          </select>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {t('startDate')}
          </label>
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => setFilters({
              ...filters,
              dateRange: { ...filters.dateRange, start: e.target.value }
            })}
            className="w-full px-4 py-2.5 bg-white/80 dark:bg-gray-700/80 
                     border border-gray-200/50 dark:border-gray-600/50
                     rounded-xl text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                     transition-all duration-200"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
            {t('endDate')}
          </label>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => setFilters({
              ...filters,
              dateRange: { ...filters.dateRange, end: e.target.value }
            })}
            className="w-full px-4 py-2.5 bg-white/80 dark:bg-gray-700/80 
                     border border-gray-200/50 dark:border-gray-600/50
                     rounded-xl text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                     transition-all duration-200"
          />
        </div>
      </div>

      {/* Apply Filters Button */}
      <div className="flex justify-end">
        <button
          onClick={() => {/* Add apply filters logic */}}
          className="px-6 py-2.5 bg-blue-600 text-white rounded-xl
                   hover:bg-blue-700 transition-colors duration-200
                   font-medium text-sm"
        >
          {t('applyFilters')}
        </button>
      </div>
    </div>
  );
};

export default FilterPanel; 