import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Book, 
  CheckCircle, 
  XCircle,
  CalendarCheck,
  CalendarX,
  School
} from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format, parseISO } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import ScheduleCard from '../components/schedule/ScheduleCard';
import ScheduleTeacherDetailsDialog from '../components/schedule/ScheduleTeacherDetailsDialog';
import config from '../config';

const Schedule = () => {
  const { t, language } = useApp();
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [scheduleData, setScheduleData] = useState({
    total_assignments: 0,
    confirmed_assignments: 0,
    pending_assignments: 0,
    total_schools: 0,
    booked_dates: [],
    pending_dates: []
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [error, setError] = useState(null);
  const [selectedTeacherId, setSelectedTeacherId] = useState(null);
  const [isTeacherDialogOpen, setIsTeacherDialogOpen] = useState(false);

  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const isSchool = userData.user_type === 3;

  // Fetch schedule data
  const fetchScheduleData = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      
      const endpoint = isSchool 
        ? `${config.API_URL}/api/bookings/school-schedule`
        : `${config.API_URL}/api/bookings/teacher-schedule`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': language
        }
      });
      const data = await response.json();

      if (data.success) {
        // For both school admin and teacher
        setScheduleData({
          ...data.data,
          booked_dates: data.data.booked_dates || [],
          pending_dates: []
        });
      } else {
        setError(data.message || 'Error fetching schedule data');
      }
    } catch (error) {
      console.error('Error fetching schedule data:', error);
      setError(t('errorFetchingSchedule'));
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings for selected date
  const fetchBookings = async (date) => {
    try {
      setLoadingBookings(true);
      const token = localStorage.getItem('accessToken');
      const formattedDate = format(date, 'yyyy-MM-dd');
      
      const endpoint = isSchool
        ? `${config.API_URL}/api/bookings/school-bookings-by-date?date=${formattedDate}`
        : `${config.API_URL}/api/bookings/teacher-bookings-by-date?date=${formattedDate}`;

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': language
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const bookings = isSchool ? data.data : data.data || [];
        setBookings(bookings);

        // Update calendar colors based on booking status
        if (isSchool) {
          const confirmedDates = [];
          const pendingDates = [];

          bookings.forEach(booking => {
            const bookingDate = format(new Date(booking.start_date), 'yyyy-MM-dd');
            if (booking.status === 2) {
              confirmedDates.push(bookingDate);
            } else {
              pendingDates.push(bookingDate);
            }
          });

          // Update only the dates for the selected day
          setScheduleData(prev => {
            const newBookedDates = prev.booked_dates.filter(date => date !== formattedDate);
            const newPendingDates = prev.pending_dates.filter(date => date !== formattedDate);

            if (confirmedDates.length > 0) {
              newBookedDates.push(formattedDate);
            }
            if (pendingDates.length > 0) {
              newPendingDates.push(formattedDate);
            }

            return {
              ...prev,
              booked_dates: newBookedDates,
              pending_dates: newPendingDates
            };
          });
        }
      } else {
        console.error('Error fetching bookings:', data.message);
        setBookings([]);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    fetchScheduleData();
  }, [language]);

  // Calendar modifiers for highlighting dates with schedules
  const modifiers = {
    booked: scheduleData.booked_dates.map(date => parseISO(date)),
    pending: scheduleData.pending_dates.map(date => parseISO(date))
  };

  const modifiersStyles = {
    booked: {
      backgroundColor: '#DEF7EC',
      color: '#03543F',
      borderRadius: '100%'
    },
    pending: {
      backgroundColor: '#FEF3C7',
      color: '#92400E',
      borderRadius: '100%'
    }
  };

  // Handle date selection
  const handleDateSelect = (date) => {
    setSelectedDate(date);
    if (date) {
      fetchBookings(date);
    } else {
      setBookings([]);
    }
  };

  // Statistics cards data
  const statsCards = [
    {
      title: t('totalAssignments'),
      value: scheduleData.total_assignments,
      icon: Calendar,
      color: 'blue'
    },
    {
      title: t('confirmedAssignments'),
      value: scheduleData.confirmed_assignments,
      icon: CalendarCheck,
      color: 'green'
    },
    {
      title: t('pendingAssignments'),
      value: scheduleData.pending_assignments,
      icon: CalendarX,
      color: 'yellow'
    },
    {
      title: isSchool ? t('totalTeachers') : t('schools'),
      value: isSchool ? scheduleData.total_teachers : scheduleData.total_schools,
      icon: School,
      color: 'purple'
    }
  ];

  // Calendar footer legend
  const calendarFooter = (
    <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-green-100 dark:bg-green-900/30" />
        <span>{t('confirmedDate')}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-yellow-100 dark:bg-yellow-900/30" />
        <span>{t('pendingDate')}</span>
      </div>
    </div>
  );

  // Handle booking card click
  const handleBookingClick = (booking) => {
    if (isSchool && booking.teacher_id) {
      setSelectedTeacherId(booking.teacher_id);
      setIsTeacherDialogOpen(true);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500 dark:text-red-400">
          <p>{error}</p>
          <button 
            onClick={fetchScheduleData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {t('tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gray-50/50 dark:bg-gray-900 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('schedule')}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl font-light">
            {t('scheduleDesc')}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6
                          border border-gray-200/50 dark:border-gray-700/50 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {stat.title}
                    </p>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </h3>
                  </div>
                  <div className={`p-3 rounded-xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30`}>
                    <IconComponent 
                      className={`w-6 h-6 text-${stat.color}-600 dark:text-${stat.color}-400`} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Calendar and Schedule Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Calendar - 3 columns */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm p-6 
                          border border-gray-200/50 dark:border-gray-700/50 sticky top-8">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="!font-sans"
                locale={language === 'ar' ? ar : enUS}
                dir={language === 'ar' ? 'rtl' : 'ltr'}
                showOutsideDays={true}
                weekStartsOn={language === 'ar' ? 6 : 0}
                classNames={{
                  day: 'w-10 h-10 m-0.5',
                  nav_button_previous: language === 'ar' ? 'rdp-nav_button_next' : 'rdp-nav_button_previous',
                  nav_button_next: language === 'ar' ? 'rdp-nav_button_previous' : 'rdp-nav_button_next',
                }}
                footer={calendarFooter}
              />
            </div>
          </div>

          {/* Schedule Cards - 9 columns */}
          <div className="lg:col-span-9">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {selectedDate ? (
                  loadingBookings ? (
                    <div className="col-span-full flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  ) : bookings && bookings.length > 0 ? (
                    bookings.map(booking => (
                      <div 
                        key={booking.id}
                        onClick={() => handleBookingClick(booking)}
                        className="cursor-pointer"
                      >
                        <ScheduleCard booking={booking} />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 
                                  rounded-2xl border border-gray-200/50 dark:border-gray-700/50 
                                  text-gray-500 dark:text-gray-400">
                      {t('noSchedulesForDate')}
                    </div>
                  )
                ) : (
                  <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 
                                rounded-2xl border border-gray-200/50 dark:border-gray-700/50 
                                text-gray-500 dark:text-gray-400">
                    {t('selectDate')}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Teacher Details Dialog */}
      {isSchool && selectedTeacherId && (
        <ScheduleTeacherDetailsDialog
          isOpen={isTeacherDialogOpen}
          onClose={() => {
            setIsTeacherDialogOpen(false);
            setSelectedTeacherId(null);
          }}
          teacherId={selectedTeacherId}
        />
      )}
    </div>
  );
};

export default Schedule; 