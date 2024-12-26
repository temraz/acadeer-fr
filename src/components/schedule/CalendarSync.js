import React, { useState } from 'react';
import { Calendar, Check, Loader } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const CalendarSync = () => {
  const { t } = useApp();
  const [syncing, setSyncing] = useState(false);
  const [syncedCalendars, setSyncedCalendars] = useState([]);

  const calendarProviders = [
    { id: 'google', name: 'Google Calendar', icon: '🔄' },
    { id: 'outlook', name: 'Outlook Calendar', icon: '📅' },
    { id: 'apple', name: 'Apple Calendar', icon: '📆' }
  ];

  const handleSync = (providerId) => {
    setSyncing(true);
    // Simulate API call
    setTimeout(() => {
      setSyncedCalendars([...syncedCalendars, providerId]);
      setSyncing(false);
    }, 1500);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 border dark:border-gray-700">
      <h3 className="text-lg font-semibold mb-4 dark:text-white">
        {t('calendarSync')}
      </h3>
      <div className="space-y-4">
        {calendarProviders.map(provider => (
          <div
            key={provider.id}
            className="flex items-center justify-between p-4 border rounded-lg dark:border-gray-700"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{provider.icon}</span>
              <span className="dark:text-gray-300">{provider.name}</span>
            </div>
            <button
              onClick={() => handleSync(provider.id)}
              disabled={syncing || syncedCalendars.includes(provider.id)}
              className={`px-4 py-2 rounded-lg flex items-center space-x-2
                ${syncedCalendars.includes(provider.id)
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
                }
              `}
            >
              {syncing ? (
                <Loader className="animate-spin" size={18} />
              ) : syncedCalendars.includes(provider.id) ? (
                <Check size={18} />
              ) : (
                <Calendar size={18} />
              )}
              <span>
                {syncedCalendars.includes(provider.id)
                  ? t('synced')
                  : t('sync')}
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarSync; 