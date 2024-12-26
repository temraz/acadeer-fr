import React from 'react';
import { useApp } from '../../context/AppContext';

const FilterPanel = ({ filters, setFilters }) => {
  const { t, language } = useApp();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8 space-y-6 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            {t('status')}
          </label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">{t('allStatuses')}</option>
            <option value="completed">{t('completed')}</option>
            <option value="upcoming">{t('upcoming')}</option>
            <option value="cancelled">{t('cancelled')}</option>
          </select>
        </div>

        {/* Subject Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            {t('subject')}
          </label>
          <select
            value={filters.subject}
            onChange={(e) => setFilters({ ...filters, subject: e.target.value })}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">{t('allSubjects')}</option>
            <option value="mathematics">{t('mathematics')}</option>
            <option value="science">{t('science')}</option>
            <option value="english">{t('english')}</option>
          </select>
        </div>

        {/* Grade Filter */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            {t('grade')}
          </label>
          <select
            value={filters.grade}
            onChange={(e) => setFilters({ ...filters, grade: e.target.value })}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="">{t('allGrades')}</option>
            <option value="elementary">{t('elementary')}</option>
            <option value="middle">{t('middleSchool')}</option>
            <option value="high">{t('highSchool')}</option>
          </select>
        </div>
      </div>

      {/* Date Range */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            {t('startDate')}
          </label>
          <input
            type="date"
            value={filters.dateRange.start}
            onChange={(e) => setFilters({
              ...filters,
              dateRange: { ...filters.dateRange, start: e.target.value }
            })}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-gray-300">
            {t('endDate')}
          </label>
          <input
            type="date"
            value={filters.dateRange.end}
            onChange={(e) => setFilters({
              ...filters,
              dateRange: { ...filters.dateRange, end: e.target.value }
            })}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
          />
        </div>
      </div>
    </div>
  );
};

export default FilterPanel; 