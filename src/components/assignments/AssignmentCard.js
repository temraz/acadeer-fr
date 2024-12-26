import React from 'react';
import { useApp } from '../../context/AppContext';
import { Clock, MapPin, BookOpen, User, CheckCircle, XCircle, AlertCircle, Calendar } from 'lucide-react';
import { differenceInDays, parseISO } from 'date-fns';

const AssignmentCard = ({ assignment, onClick }) => {
  const { t, language } = useApp();

  const getDaysLeft = () => {
    if (assignment.status !== 'upcoming') return null;
    const today = new Date();
    const assignmentDate = parseISO(assignment.date);
    const daysLeft = differenceInDays(assignmentDate, today);
    
    if (daysLeft === 0) return t('today');
    if (daysLeft === 1) return t('tomorrow');
    return daysLeft > 0 ? t('daysLeft', { days: daysLeft }) : null;
  };

  const getStatusIcon = () => {
    switch (assignment.status) {
      case 'completed':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'cancelled':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return null;
    }
  };

  const daysLeft = getDaysLeft();

  return (
    <div
      onClick={onClick}
      className={`
        bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl
        rounded-xl shadow-sm border border-gray-200 dark:border-gray-700
        p-6 hover:scale-[1.02] hover:shadow-lg
        transition-all duration-200 cursor-pointer relative
        ${language === 'ar' ? 'rtl' : 'ltr'}
      `}
    >
      {/* Days Left Badge - if assignment is upcoming */}
      {daysLeft && (
        <div className={`
          absolute ${language === 'ar' ? 'left-4' : 'right-4'} top-4 
          flex items-center gap-1.5 
          bg-blue-50 dark:bg-blue-900/20
          text-blue-700 dark:text-blue-300
          px-4 py-2 rounded-full text-sm font-medium
          backdrop-blur-sm
          transition-colors duration-200
        `}>
          <Calendar size={14} />
          <span>{daysLeft}</span>
        </div>
      )}

      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {assignment.school}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 flex items-center mt-2">
            <Clock size={16} className={language === 'ar' ? 'ml-2' : 'mr-2'} />
            {assignment.date} • {assignment.timeSlot}
          </p>
        </div>
        {assignment.status !== 'upcoming' && (
          <span className={`
            px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2
            ${assignment.status === 'completed' && 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'}
            ${assignment.status === 'cancelled' && 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}
          `}>
            {getStatusIcon()}
            {t(assignment.status)}
          </span>
        )}
      </div>

      <div className="mt-6 space-y-3">
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <BookOpen size={16} className={language === 'ar' ? 'ml-3' : 'mr-3'} />
          <span>{t(assignment.subject)} • {assignment.grade}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <MapPin size={16} className={language === 'ar' ? 'ml-3' : 'mr-3'} />
          <span>{t('room')} {assignment.location}</span>
        </div>
        <div className="flex items-center text-gray-600 dark:text-gray-400">
          <User size={16} className={language === 'ar' ? 'ml-3' : 'mr-3'} />
          <span>{assignment.teacher}</span>
        </div>
      </div>

      {assignment.notes && (
        <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {assignment.notes}
          </p>
        </div>
      )}
    </div>
  );
};

export default AssignmentCard; 