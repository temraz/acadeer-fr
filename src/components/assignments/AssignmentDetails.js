import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, Clock, MapPin, BookOpen, User, DollarSign } from 'lucide-react';

const AssignmentDetails = ({ assignment, onClose }) => {
  const { t, language } = useApp();

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`
        bg-white/90 dark:bg-gray-800/90 rounded-2xl 
        w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-xl
        ${language === 'ar' ? 'rtl' : 'ltr'}
      `}>
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-purple-500 p-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {assignment.school}
              </h2>
              <p className="text-white/90 flex items-center mt-2">
                <Clock size={16} className={language === 'ar' ? 'ml-2' : 'mr-2'} />
                {assignment.date} • {assignment.timeSlot}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8 overflow-y-auto">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-gray-400 font-medium">
              {t('status')}
            </span>
            <span className={`
              px-4 py-2 rounded-full text-sm font-medium
              ${assignment.status === 'completed' && 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'}
              ${assignment.status === 'cancelled' && 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'}
              ${assignment.status === 'upcoming' && 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'}
            `}>
              {t(assignment.status)}
            </span>
          </div>

          {/* Details */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 space-y-4">
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <BookOpen size={18} className={language === 'ar' ? 'ml-3' : 'mr-3'} />
              <span>{t(assignment.subject)} • {assignment.grade}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <MapPin size={18} className={language === 'ar' ? 'ml-3' : 'mr-3'} />
              <span>{t('room')} {assignment.location}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <User size={18} className={language === 'ar' ? 'ml-3' : 'mr-3'} />
              <span>{assignment.teacher}</span>
            </div>
            <div className="flex items-center text-gray-600 dark:text-gray-400">
              <DollarSign size={18} className={language === 'ar' ? 'ml-3' : 'mr-3'} />
              <span>{assignment.payment.amount} SAR • {t(assignment.payment.status)}</span>
            </div>
          </div>

          {/* Notes */}
          {assignment.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {t('notes')}
              </h3>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {assignment.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-800/95 border-t border-gray-200 dark:border-gray-700 p-4 backdrop-blur-xl">
          <div className="flex justify-end gap-3">
            {assignment.status === 'upcoming' && (
              <button
                className="px-6 py-2.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors"
                onClick={onClose}
              >
                {t('cancel')}
              </button>
            )}
            <button
              className="px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors"
              onClick={onClose}
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetails; 