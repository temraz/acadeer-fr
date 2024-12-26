import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import config from '../config';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import { 
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Loader2,
  User,
  MapPin,
  Book,
  Clock,
  CreditCard
} from 'lucide-react';
import BookingDetailsDialog from '../components/BookingDetailsDialog';

const SchoolSchedule = () => {
  const { t, language } = useApp();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [bookings, setBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchBookings = async (date) => {
    setIsLoading(true);
    setError(null);

    try {
      const accessToken = localStorage.getItem('accessToken');
      const formattedDate = format(date, 'yyyy-MM-dd');

      const response = await fetch(`${config.API_URL}/api/school/bookings?date=${formattedDate}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Accept': 'application/json',
          'Accept-Language': language
        }
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (data.success) {
        setBookings(data.data || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(selectedDate);
  }, [selectedDate, language]);

  const handleBookingClick = (booking) => {
    setSelectedBooking(booking);
    setIsDialogOpen(true);
  };

  const handleStatusUpdate = async (action) => {
    await fetchBookings(selectedDate);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('schoolSchedule')}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {t('viewAndManageBookings')}
          </p>
        </div>
        
        <div className="relative">
          <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <CalendarIcon className="w-5 h-5 text-gray-500" />
            <span className="text-gray-900 dark:text-white">
              {format(selectedDate, 'MMMM d, yyyy', { locale: language === 'ar' ? ar : enUS })}
            </span>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : error ? (
        <div className="bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 p-4 rounded-lg">
          {error}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            {t('noBookingsFound')}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div 
              key={booking.id}
              onClick={() => handleBookingClick(booking)}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 
                        p-6 hover:border-blue-500 dark:hover:border-blue-400 transition-colors cursor-pointer"
            >
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
                  {booking.payment_status === 1 ? t('paid') : t('pending')}
                </span>
              </div>

              {/* Teacher Info */}
              <div className="flex items-center gap-4">
                {booking.teacher_profile_pic ? (
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
                )}
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {booking.teacher_name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Book className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {language === 'ar' ? booking.subject_name_ar : booking.subject_name_en}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date */}
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{format(new Date(booking.start_date), 'MMM d, yyyy', { locale: language === 'ar' ? ar : enUS })}</span>
                  {booking.price_per_day && (
                    <span className="font-medium">{booking.price_per_day} {t('sar')}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <BookingDetailsDialog
          booking={selectedBooking}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedBooking(null);
          }}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
};

export default SchoolSchedule; 