import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../context/AppContext';
import config from '../config';
import { 
  X, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  CreditCard, 
  Book,
  User,
  CheckCircle,
  XCircle,
  Clock,
  School,
  Loader2
} from 'lucide-react';

const BookingDetailsDialog = ({ booking, onClose, onStatusUpdate, isOpen }) => {
  const { t, language } = useApp();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleStatusUpdate = async (action) => {
    const accessToken = localStorage.getItem('accessToken');
    
    if (!accessToken) {
      setError('No access token available');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch(`${config.API_URL}/api/bookings/${booking.id}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (data.success) {
        setSuccessMessage(action === 'accept' ? 
          t(language === 'en' ? 'Booking accepted successfully' : 'تم قبول الحجز بنجاح') :
          t(language === 'en' ? 'Booking rejected successfully' : 'تم رفض الحجز بنجاح')
        );
        onStatusUpdate?.(action);
        // Close dialog after 1.5 seconds
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (err) {
      console.error('Error updating booking status:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const dialog = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative w-full max-w-lg mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl transform transition-all scale-100 opacity-100">
        {/* Header */}
        <div className="px-8 pt-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
              {t('bookingDetails')}
            </h3>
            <button
              onClick={onClose}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6">
          {/* Status Badges */}
          <div className="flex items-center gap- mb-8">
            <span className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2
              ${booking.status === 2 
                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : booking.status === 3
                  ? 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                  : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}
            >
              {booking.status === 2 ? <CheckCircle className="w-4 h-4" /> : 
               booking.status === 3 ? <XCircle className="w-4 h-4" /> : 
               <Clock className="w-4 h-4" />}
              {booking.status === 2 ? t('accepted') : booking.status === 3 ? t('rejected') : t('pending')}
            </span>
            <span className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2
              ${booking.payment_status === 1 
                ? 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : 'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
              }`}
              style={{marginRight: '0.5rem',marginLeft: '0.5rem'}} 
            >
              <CreditCard className="w-4 h-4" />
              {/* {booking.payment_status === 1 ? t('paid') : t('pending')} */}
              {t('cash')}
            </span>
          </div>

          {/* School Info */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {booking.logo_r2_link ? (
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={booking.logo_r2_link} 
                    alt={language === 'ar' ? booking.school_name_ar : booking.school_name_en}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                  <School className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              )}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {language === 'ar' ? booking.school_name_ar : booking.school_name_en}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'ar' ? booking.city_name_ar : booking.city_name_en}
                </p>
              </div>
            </div>
            <div className="ml-16 flex items-center text-gray-600 dark:text-gray-400">
              <Book className="w-5 h-5 mr-3 text-gray-400" />
              <span>{language === 'ar' ? booking.subject_name_ar : booking.subject_name_en}</span>
            </div>
          </div>

          {/* Teacher Info */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              {booking.teacher_profile_pic ? (
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center overflow-hidden">
                  <img 
                    src={booking.teacher_profile_pic} 
                    alt={booking.teacher_name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              )}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {booking.teacher_name}
                </h4>
                <p className="text-sm text-gray-500 dark:text-gray-400" dir="ltr">
                  {booking.teacher_phone_number}
                </p>
              </div>
            </div>
            <div className="ml-16 flex items-center text-gray-600 dark:text-gray-400">
              <Mail className="w-5 h-5 mr-3 text-gray-400" />
              <span>{booking.teacher_email}</span>
            </div>
          </div>

          {/* Booking Details */}
          <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('startDate')}</p>
                <div className="flex items-center text-gray-900 dark:text-white">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                  <span>
                    {new Date(booking.start_date).toLocaleDateString(language, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      calendar: 'gregory'
                    })}
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('endDate')}</p>
                <div className="flex items-center text-gray-900 dark:text-white">
                  <Calendar className="w-5 h-5 mr-2 text-gray-400" />
                  <span>
                    {new Date(booking.end_date).toLocaleDateString(language, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      calendar: 'gregory'
                    })}
                  </span>
                </div>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('pricePerDay')}</p>
                <div className="flex items-center text-gray-900 dark:text-white">
                  <CreditCard className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-lg font-semibold">{booking.price_per_day} {t('sar')}</span>
                </div>
                {(() => {
                  const startDate = new Date(booking.start_date);
                  const endDate = new Date(booking.end_date);
                  const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
                  if (days > 1) {
                    return (
                      <div className="mt-2 flex items-center text-gray-600 dark:text-gray-400">
                        <span className="text-sm">
                          {t('total')}: <span className="font-semibold text-gray-900 dark:text-white">{booking.price_per_day * days} {t('sar')}</span> ({days} {t('days')})
                        </span>
                      </div>
                    );
                  }
                  return null;
                })()}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        {booking.status === 1 && (
          <div className="px-8 py-6 bg-gray-50 dark:bg-gray-700/20 border-t border-gray-100 dark:border-gray-700 rounded-b-2xl">
            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 p-3 rounded-lg bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                {successMessage}
              </div>
            )}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleStatusUpdate('reject')}
                disabled={isLoading || successMessage}
                className="px-6 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 
                         dark:text-red-400 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 
                         disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {t('reject')}
              </button>
              <button
                onClick={() => handleStatusUpdate('accept')}
                disabled={isLoading || successMessage}
                className="px-6 py-2.5 rounded-lg text-sm font-medium bg-blue-600 text-white 
                         hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 transition-colors 
                         disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                {t('accept')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Render the dialog at the root level using portal
  return createPortal(dialog, document.body);
};

export default BookingDetailsDialog; 