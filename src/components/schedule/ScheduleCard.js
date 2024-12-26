import React from 'react';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { useApp } from '../../context/AppContext';
import { 
  Clock, 
  MapPin, 
  User, 
  Book,
  CreditCard,
  Building2,
  School
} from 'lucide-react';

const ScheduleCard = ({ booking }) => {
  const { t, language } = useApp();
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isSchool = userData.user_type === 3;

  const formatDate = (date) => {
    return format(new Date(date), 'MMM d, yyyy', { locale: language === 'ar' ? ar : enUS });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-700/50">
      {/* Status and Payment */}
      <div className="flex items-center justify-between mb-6">
        <span className={`px-3 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1.5
          ${booking.status === 2 
            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : booking.status === 3
              ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}
        >
          <Clock className="w-4 h-4" />
          {booking.status === 2 ? t('accepted') : booking.status === 3 ? t('rejected') : t('pending')}
        </span>
        <span className={`px-3 py-1 rounded-lg text-sm font-medium inline-flex items-center gap-1.5
          ${booking.payment_status === 1 
            ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          {/* {booking.payment_status === 1 ? t('paid') : t('pending')} */}
          {t('cash')}
        </span>
      </div>

      {/* Teacher/School Info */}
      <div className="flex items-center gap-4 mb-4">
        {isSchool ? (
          // Show teacher profile for school admin
          booking.teacher_profile_pic ? (
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={booking.teacher_profile_pic} 
                alt={booking.teacher_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          )
        ) : (
          // Show school logo for teacher
          booking.logo_r2_link ? (
            <div className="w-12 h-12 rounded-full overflow-hidden">
              <img 
                src={booking.logo_r2_link} 
                alt={language === 'ar' ? booking.school_name_ar : booking.school_name_en}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <School className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </div>
          )
        )}
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {isSchool ? booking.teacher_name : (language === 'ar' ? booking.school_name_ar : booking.school_name_en)}
          </h3>
          {isSchool && (
            <div className="flex items-center gap-2 mt-1">
              <Book className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {language === 'ar' ? booking.subject_name_ar : booking.subject_name_en}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Location */}
      {isSchool ? (
        // Show teacher city for school admin
        <div className="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400">
          <Building2 className="w-4 h-4" />
          <span className="text-sm">
            {language === 'ar' ? booking.teacher_city_name_ar : booking.teacher_city_name_en}
          </span>
        </div>
      ) : (
        // Show school city for teacher
        <div className="flex items-center gap-2 mb-4 text-gray-600 dark:text-gray-400">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">
            {language === 'ar' ? booking.school_city_name_ar : booking.school_city_name_en}
          </span>
        </div>
      )}

      {/* Date and Price */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {formatDate(booking.start_date)}
          {booking.end_date && booking.end_date !== booking.start_date && (
            <> - {formatDate(booking.end_date)}</>
          )}
        </div>
        {booking.price_per_day && (
          <div className="font-medium text-gray-900 dark:text-white">
            {booking.price_per_day} {t('sar')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleCard; 