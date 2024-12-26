import React from 'react';
import { useApp } from '../context/AppContext';
import { useState } from 'react';
import TeacherDetailsDialog from './TeacherDetailsDialog';
import { Eye, UserPlus } from 'lucide-react';

// Alternative teacher photos - you can use any of these patterns
const teacherPhotos = {
  "Emily Rodriguez": "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
  "Michael Chang": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
  "Sarah Johnson": "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
};

const TeacherCard = ({ 
  name, 
  subjects, 
  availability, 
  rating, 
  location,
  certifications,
  pricePerDay,
  ...otherProps
}) => {
  const { t, language } = useApp();
  const [showDetails, setShowDetails] = useState(false);
  
  return (
    <>
      <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center mb-4">
          <img 
            src={teacherPhotos[name] || `https://i.pravatar.cc/150?u=${name.replace(/\s/g, '')}`}
            alt={name} 
            className={`w-16 h-16 rounded-full object-cover ${language === 'ar' ? 'ml-4' : 'mr-4'}`}
          />
          <div>
            <h3 className="font-semibold text-lg dark:text-white">{name}</h3>
            <div className="text-yellow-500">{'★'.repeat(Math.round(rating))}</div>
          </div>
        </div>
        <div className="space-y-2 dark:text-gray-300">
          <p>
            <strong className="dark:text-white">{t('subjects')}:</strong> {subjects.join(", ")}
          </p>
          <p>
            <strong className="dark:text-white">{t('availability')}:</strong> {availability}
          </p>
          <p>
            <strong className="dark:text-white">{t('location')}:</strong> {location}
          </p>
          <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
            {pricePerDay} {language === 'ar' ? t('sarPerDay') : t('sarPerDay')}
          </p>
          <div className="mt-2">
            <strong className="dark:text-white">{t('certification')}:</strong>
            <div className="flex flex-wrap gap-2 mt-1">
              {certifications.map(cert => (
                <span 
                  key={cert} 
                  className="bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-200 text-xs px-2 py-1 rounded-full"
                >
                  {cert}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8 mb-2 flex gap-2">
            <button 
              className="flex items-center justify-center flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors gap-2"
            >
              <UserPlus size={18} />
              {t('requestSubstitute')}
            </button>
            <button 
              onClick={() => setShowDetails(true)}
              className="flex items-center justify-center px-3 py-2.5 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              title={t('viewMore')}
            >
              <Eye size={18} />
            </button>
          </div>
        </div>
      </div>

      {showDetails && (
        <TeacherDetailsDialog
          teacher={{
            name,
            subjects,
            availability,
            rating,
            location,
            certifications,
            pricePerDay,
            ...otherProps
          }}
          onClose={() => setShowDetails(false)}
        />
      )}
    </>
  );
};

export default TeacherCard; 