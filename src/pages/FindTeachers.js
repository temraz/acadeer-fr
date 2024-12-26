import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { fetchWithAuth } from '../utils/api';
import { Search, Filter, X, Eye, UserPlus, Star, Download, Calendar, Phone, Mail, GraduationCap, Award, FileText, Ban } from 'lucide-react';
import Select from 'react-select';
import Swal from 'sweetalert2';
import config from '../config';
import DatePicker from 'react-datepicker';
import { registerLocale, setDefaultLocale } from "react-datepicker";
import ar from 'date-fns/locale/ar';
import "react-datepicker/dist/react-datepicker.css";
import TeacherDetailsDialog from '../components/TeacherDetailsDialog';

// Register Arabic locale
registerLocale('ar', ar);

// Add custom styles for the date picker
const customDatePickerStyles = `
  .react-datepicker {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    border: none;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    width: 100%;
    background: white;
  }

  .react-datepicker__month-container {
    width: 100%;
    float: none;
  }

  [dir="rtl"] .react-datepicker {
    direction: rtl;
  }

  .react-datepicker__header {
    background: white;
    border: none;
    padding-top: 16px;
  }

  .react-datepicker__month {
    margin: 0;
    padding: 0 16px 16px;
  }

  .react-datepicker__day-names {
    display: flex;
    justify-content: space-around;
    margin-bottom: 8px;
  }

  .react-datepicker__day-name {
    color: #6b7280;
    font-weight: 500;
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin: 0;
    flex: 1;
  }

  .react-datepicker__month {
    margin: 0;
  }

  .react-datepicker__week {
    display: flex;
    justify-content: space-around;
  }

  .react-datepicker__day {
    width: 40px;
    height: 40px;
    line-height: 40px;
    margin: 0;
    color: #1f2937;
    font-weight: 400;
    flex: 1;
    border-radius: 5px;
  }

  .react-datepicker__day:hover {
    background-color: #f3f4f6;
    border-radius: 5px;
  }

  .react-datepicker__day--selected,
  .react-datepicker__day--in-range {
    background-color: #2563eb !important;
    color: white !important;
    font-weight: 500;
    border-radius: 5px !important;
  }

  .react-datepicker__day--range-start {
    border-top-left-radius: 4px !important;
    border-bottom-left-radius: 4px !important;
  }

  .react-datepicker__day--range-end {
    border-top-right-radius: 4px !important;
    border-bottom-right-radius: 4px !important;
  }

  [dir="rtl"] .react-datepicker__day--range-start {
    border-top-left-radius: 0 !important;
    border-bottom-left-radius: 0 !important;
    border-top-right-radius: 4px !important;
    border-bottom-right-radius: 4px !important;
  }

  [dir="rtl"] .react-datepicker__day--range-end {
    border-top-right-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
    border-top-left-radius: 4px !important;
    border-bottom-left-radius: 4px !important;
  }

  .react-datepicker__day--in-selecting-range {
    background-color: #93c5fd !important;
    color: #1f2937 !important;
    border-radius: 0 !important;
  }

  .react-datepicker__day--disabled {
    color: #d1d5db !important;
    text-decoration: none !important;
  }

  .react-datepicker__day--keyboard-selected {
    background-color: #93c5fd;
    border-radius: 5px;
  }

  .react-datepicker__navigation {
    top: 16px;
  }

  [dir="rtl"] .react-datepicker__navigation--previous {
    right: auto;
    left: 2px;
    transform: rotate(180deg);
  }

  [dir="rtl"] .react-datepicker__navigation--next {
    left: auto;
    right: 2px;
    transform: rotate(180deg);
  }

  .react-datepicker__navigation-icon::before {
    border-color: #6b7280;
    border-width: 2px 2px 0 0;
  }

  .react-datepicker__current-month {
    font-weight: 600;
    font-size: 1rem;
    color: #1f2937;
    margin-bottom: 8px;
  }

  .dark .react-datepicker {
    background: #1f2937;
    border-color: #374151;
  }

  .dark .react-datepicker__header {
    background: #1f2937;
    border-color: #374151;
  }

  .dark .react-datepicker__day {
    color: #e5e7eb;
  }

  .dark .react-datepicker__day-name {
    color: #9ca3af;
  }

  .dark .react-datepicker__current-month {
    color: #e5e7eb;
  }

  .dark .react-datepicker__day:hover {
    background-color: #374151;
    border-radius: 5px;
  }

  .dark .react-datepicker__day--disabled {
    color: #4b5563 !important;
  }

  .dark .react-datepicker__navigation-icon::before {
    border-color: #9ca3af;
  }
`;

// Add weekday translations
const weekDays = {
  en: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  ar: ['احد', 'اثن', 'ثلا', 'ارب', 'خمي', 'جمع', 'سبت']
};

const FindTeachers = () => {
  const { t, language } = useApp();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [cities, setCities] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [teacherDetails, setTeacherDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedTeacherForBooking, setSelectedTeacherForBooking] = useState(null);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isBooking, setIsBooking] = useState(false);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [loadingUnavailableDates, setLoadingUnavailableDates] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Search filters
  const [filters, setFilters] = useState({
    city_id: '',
    subject_id: '',
    gender: '',
    price_per_day: ''
  });

  // Ref for intersection observer
  const observer = useRef();
  const lastTeacherElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Fetch lookup data (cities and subjects)
  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const response = await fetchWithAuth('/lookups');
        if (response.success) {
          if (response.data.cities) {
            setCities(response.data.cities);
          }
          if (response.data.subjects) {
            setSubjects(response.data.subjects);
          }
        }
      } catch (error) {
        console.error('Error fetching lookup data:', error);
      }
    };

    fetchLookupData();
  }, []);

  // Fetch teachers with filters
  const fetchTeachers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams({
        page: page.toString(),
        page_size: '100'
      });

      // Add filters if they have values
      if (filters.city_id) queryParams.append('city_id', filters.city_id);
      if (filters.subject_id) queryParams.append('subject_id', filters.subject_id);
      if (filters.gender) queryParams.append('gender', filters.gender);
      if (filters.price_per_day) queryParams.append('price_per_day', filters.price_per_day);

      const response = await fetchWithAuth(`/users/teachers?${queryParams.toString()}`);

      if (response.success) {
        const newTeachers = response.data.records;
        setTeachers(prev => page === 1 ? newTeachers : [...prev, ...newTeachers]);
        setHasMore(response.data.current_page < response.data.total_pages);
      }
    } catch (error) {
      setError(t('serverError'));
      console.error('Error fetching teachers:', error);
    } finally {
      setLoading(false);
    }
  }, [page, filters, t]);

  // Fetch teachers when page or filters change
  useEffect(() => {
    fetchTeachers();
  }, [fetchTeachers]);

  // Handle filter changes
  const handleFilterChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1); // Reset to first page when filters change
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      city_id: '',
      subject_id: '',
      gender: '',
      price_per_day: ''
    });
    setPage(1);
  };

  const handleViewDetails = async (teacherId) => {
    try {
      setLoadingDetails(true);
      setShowModal(true);
      setSelectedTeacher(teacherId);

      const response = await fetchWithAuth('/users/me');
      if (response.success) {
        setTeacherDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching teacher details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Function to fetch teacher's future bookings
  const fetchTeacherFutureBookings = async (teacherId) => {
    try {
      setLoadingUnavailableDates(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${config.API_URL}/api/bookings/teacher-future-bookings?teacher_id=${teacherId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': language
        }
      });
      const data = await response.json();
      
      if (data.success) {
        // Create array of unavailable dates
        const dates = data.data.reduce((acc, booking) => {
          const start = new Date(booking.start_date);
          const end = new Date(booking.end_date);
          const dates = [];
          let current = new Date(start);

          while (current <= end) {
            dates.push(new Date(current));
            current.setDate(current.getDate() + 1);
          }
          return [...acc, ...dates];
        }, []);
        setUnavailableDates(dates);
      }
    } catch (error) {
      console.error('Error fetching unavailable dates:', error);
    } finally {
      setLoadingUnavailableDates(false);
    }
  };

  const handleBookTeacher = async () => {
    if (!startDate || !endDate) return;

    try {
      setIsBooking(true);
      const token = localStorage.getItem('accessToken');
      
      const response = await fetch(`${config.API_URL}/api/bookings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept-Language': language
        },
        body: JSON.stringify({
          teacher_user_id: selectedTeacherForBooking.id,
          start_date: startDate.toISOString().split('T')[0],
          end_date: endDate.toISOString().split('T')[0]
        })
      });

      const data = await response.json();

      if (data.success) {
        Swal.fire({
          icon: 'success',
          title: t('bookingSuccess'),
          text: t('bookingSuccessMessage'),
          confirmButtonText: t('ok')
        });
        setShowBookingModal(false);
        setDateRange([null, null]);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: t('bookingError'),
        text: error.message || t('somethingWentWrong'),
        confirmButtonText: t('ok')
      });
    } finally {
      setIsBooking(false);
    }
  };

  // Custom function to check if a date is unavailable
  const isDateUnavailable = (date) => {
    return unavailableDates.some(unavailableDate => 
      date.getFullYear() === unavailableDate.getFullYear() &&
      date.getMonth() === unavailableDate.getMonth() &&
      date.getDate() === unavailableDate.getDate()
    );
  };

  useEffect(() => {
    // Add custom styles to head
    const styleElement = document.createElement('style');
    styleElement.textContent = customDatePickerStyles;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Add function to fetch teacher details
  const fetchTeacherDetails = async (teacherId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${config.API_URL}/api/users/users/${teacherId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': language
        }
      });

      const data = await response.json();
      if (data.success) {
        setSelectedTeacher(data.data);
        setIsDetailsDialogOpen(true);
      }
    } catch (error) {
      console.error('Error fetching teacher details:', error);
    }
  };

  // Add click handler for view button
  const handleViewTeacher = (teacherId) => {
    fetchTeacherDetails(teacherId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('findTeachers')}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {t('findPositions')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Filters Card */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg p-6 mb-12">
          {/* Main Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* City Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('city')}
              </label>
              <select
                value={filters.city_id}
                onChange={(e) => handleFilterChange('city_id', e.target.value)}
                className="w-full h-12 border border-gray-200 rounded-xl pl-4 pr-10 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">{t('city')}</option>
                {cities.map(city => (
                  <option key={city.id} value={city.id}>
                    {language === 'ar' ? city.name_ar : city.name_en}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none" style={{ top: '28px' }}>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Subject Filter - Similar structure */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('subject')}
              </label>
              <select
                value={filters.subject_id}
                onChange={(e) => handleFilterChange('subject_id', e.target.value)}
                className="w-full h-12 border border-gray-200 rounded-xl pl-4 pr-10 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              >
                <option value="">{t('subject')}</option>
                {subjects.map(subject => (
                  <option key={subject.id} value={subject.id}>
                    {language === 'ar' ? subject.name_ar : subject.name_en}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none" style={{ top: '28px' }}>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Cost Filter */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('costPerDay')}
              </label>
              <input
                type="number"
                value={filters.price_per_day}
                onChange={(e) => handleFilterChange('price_per_day', e.target.value)}
                placeholder={t('enterCostPerDay')}
                className="w-full h-12 border border-gray-200 rounded-xl px-4 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Advanced Filters Toggle */}
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center text-gray-600 hover:text-blue-600 font-medium transition-colors duration-200"
            >
              <Filter className={`w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'} transition-transform duration-200 ${showFilters ? 'transform rotate-180' : ''}`} />
              {showFilters ? t('hideAdvancedFilters') : t('showAdvancedFilters')}
            </button>
            {Object.values(filters).some(value => value !== '') && (
              <button
                onClick={resetFilters}
                className="flex items-center text-red-600 hover:text-red-700 font-medium"
              >
                <X className="w-5 h-5 mr-2" />
                {language === 'ar' ? 'إعادة تعيين المرشحات' : 'Reset Filters'}
              </button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gender Filter */}
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('gender')}
                  </label>
                  <select
                    value={filters.gender}
                    onChange={(e) => handleFilterChange('gender', e.target.value)}
                    className="w-full h-12 border border-gray-200 rounded-xl pl-4 pr-10 bg-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">{t('selectGender')}</option>
                    <option value="1">{t('male')}</option>
                    <option value="2">{t('female')}</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none" style={{ top: '28px' }}>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Teachers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {teachers.map((teacher, index) => {
            const isLastElement = index === teachers.length - 1;
            return (
              <div
                key={teacher.id}
                ref={isLastElement ? lastTeacherElementRef : null}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden group hover:shadow-xl transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={teacher.profile_picture_url || '/default-avatar.png'}
                      alt={teacher.full_name}
                      className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {teacher.full_name}
                      </h3>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, index) => (
                          <Star
                            key={index}
                            className={`w-4 h-4 ${
                              index < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className="ml-2 text-gray-600">4.5</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">{t('subject')}</p>
                        <p className="font-medium">
                          {language === 'ar' ? teacher.subject_name_ar : teacher.subject_name_en}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-600 dark:text-gray-400">{t('city')}</p>
                        <p className="font-medium">
                          {language === 'ar' ? teacher.city_name_ar : teacher.city_name_en}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400">{t('age')}</p>
                        <p className="font-medium">{teacher.age}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                          {teacher.price_per_day} {t('sarPerDay')}
                        </p>
                      </div>
                    </div>

                    <div>
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{t('teachingStyles')}</p>
                      <div className="flex flex-wrap gap-2">
                        {teacher.teaching_styles.map(style => (
                          <span
                            key={style.id}
                            className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                          >
                            {language === 'ar' ? style.style_name_ar : style.style_name_en}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button 
                      onClick={() => handleViewTeacher(teacher.id)}
                      className={`w-12 h-12 flex items-center justify-center rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors ${language === 'ar' ? 'order-2' : 'order-1'}`}
                    >
                      <Eye className="w-5 h-5 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedTeacherForBooking(teacher);
                        setShowBookingModal(true);
                        fetchTeacherFutureBookings(teacher.id);
                      }}
                      className={`flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700 transition-colors ${language === 'ar' ? 'order-1' : 'order-2'}`}
                    >
                      <UserPlus className="w-5 h-5" />
                      {t('requestSubstitute')}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center text-red-600 my-12 p-4 bg-red-50 rounded-xl">
            {error}
          </div>
        )}

        {/* No Results */}
        {!loading && teachers.length === 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 my-12 p-8 bg-white/80 dark:bg-gray-800/80 rounded-2xl backdrop-blur-xl">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-xl font-medium mb-2">{t('noResults')}</p>
            <p className="text-gray-500">{t('noResultsMessage')}</p>
          </div>
        )}
      </div>

      {/* Teacher Details Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 dark:bg-gray-800/90 rounded-2xl w-full max-w-4xl h-[90vh] my-auto relative flex flex-col overflow-hidden">
            {loadingDetails ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : teacherDetails ? (
              <>
                {/* Fixed Header Section */}
                <div className="flex-none">
                  {/* Close Button */}
                  <button
                    onClick={() => setShowModal(false)}
                    className="absolute top-6 right-6 text-gray-500 hover:text-gray-700 z-10"
                  >
                    <X className="w-6 h-6" />
                  </button>

                  {/* Hero Section */}
                  <div className="relative h-48 bg-gradient-to-r from-blue-500 to-purple-500">
                    <div className={`absolute -bottom-16 ${language === 'ar' ? 'right-8' : 'left-8'} flex items-end`}>
                      <img
                        src={teacherDetails.user.profile_picture_url || '/default-avatar.png'}
                        alt={teacherDetails.user.full_name}
                        className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-lg"
                      />
                      <div className={`${language === 'ar' ? 'mr-6' : 'ml-6'}`}>
                        <h2 className="text-3xl font-bold text-black">
                          {teacherDetails.user.full_name}
                        </h2>
                        <p className="text-black/90">
                          {language === 'ar' ? teacherDetails.user.subject_name_ar : teacherDetails.user.subject_name_en}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto">
                  <div className="px-8 pt-20 pb-8">
                    {/* Teaching Styles */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold mb-4">{t('teachingStyles')}</h3>
                      <div className="flex flex-wrap gap-2">
                        {teacherDetails.user.teaching_styles.map(style => (
                          <span
                            key={style.id}
                            className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium"
                          >
                            {language === 'ar' ? style.style_name_ar : style.style_name_en}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Quick Info */}
                    <div className="grid grid-cols-3 gap-6 mb-8">
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                        <Calendar className="w-6 h-6 text-blue-500 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('birthday')}</p>
                        <p className="font-medium">{new Date(teacherDetails.user.birthday).toLocaleDateString()}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                        <Star className="w-6 h-6 text-blue-500 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('costPerDay')}</p>
                        <p className="font-medium">{teacherDetails.user.cost_per_day} {t('sar')}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-4">
                        <Award className="w-6 h-6 text-blue-500 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('certifications')}</p>
                        <p className="font-medium">{teacherDetails.education.certifications.length}</p>
                      </div>
                    </div>

                    {/* Education Section */}
                    <div className="space-y-6">
                      {/* Education History */}
                      <div className="bg-white dark:bg-gray-700/30 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <GraduationCap className="w-5 h-5 mr-2 text-blue-500" />
                            {t('educationalBackground')}
                          </h3>
                          <a
                            href={teacherDetails.education.history.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                          >
                            <Download className="w-4 h-4" />
                            {t('view')}
                          </a>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-medium">{teacherDetails.education.history.degree}</p>
                          <p className="text-gray-600">{teacherDetails.education.history.institution}</p>
                          <p className="text-gray-600">{teacherDetails.education.history.major}</p>
                          <p className="text-sm text-gray-500">{teacherDetails.education.history.graduation_year}</p>
                        </div>
                      </div>

                      {/* Teaching License */}
                      <div className="bg-white dark:bg-gray-700/30 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-semibold flex items-center">
                            <Award className="w-5 h-5 mr-2 text-blue-500" />
                            {t('teachingLicense')}
                          </h3>
                          <a
                            href={teacherDetails.education.license.file_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                          >
                            <Download className="w-4 h-4" />
                            {t('view')}
                          </a>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xl font-medium">{teacherDetails.education.license.license_number}</p>
                          <p className="text-gray-600">{teacherDetails.education.license.issuing_authority}</p>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span>{new Date(teacherDetails.education.license.issue_date).toLocaleDateString()}</span>
                            <span>-</span>
                            <span>{new Date(teacherDetails.education.license.expiry_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Certifications */}
                      <div className="bg-white dark:bg-gray-700/30 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-lg font-semibold flex items-center mb-4">
                          <Award className="w-5 h-5 mr-2 text-blue-500" />
                          {t('certifications')}
                        </h3>
                        <div className="space-y-4">
                          {teacherDetails.education.certifications.map(cert => (
                            <div key={cert.id} className="flex items-start justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                              <div className="space-y-1">
                                <p className="font-medium">
                                  {language === 'ar' ? cert.certification.name_ar : cert.certification.name_en}
                                </p>
                                <p className="text-gray-600">{cert.issuing_authority}</p>
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                  <span>{new Date(cert.issue_date).toLocaleDateString()}</span>
                                  <span>-</span>
                                  <span>{new Date(cert.expiry_date).toLocaleDateString()}</span>
                                </div>
                              </div>
                              <a
                                href={cert.file_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 text-blue-500 hover:text-blue-600"
                              >
                                <Download className="w-4 h-4" />
                                {t('view')}
                              </a>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* CV Download */}
                    <div className="mt-8 flex justify-center">
                      <a
                        href={teacherDetails.user.cv_file_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                      >
                        <FileText className="w-5 h-5" />
                        {t('cvResume')}
                      </a>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="p-6 text-center text-gray-500">
                {t('serverError')}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold dark:text-white">
                {t('bookTeacher')}
              </h3>
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setDateRange([null, null]);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  {t('selectDates')}
                </label>
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg">
                  {loadingUnavailableDates ? (
                    <div className="flex items-center justify-center p-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {startDate && endDate && startDate.getTime() === endDate.getTime() 
                              ? t('selectedDay')
                              : t('startDate')
                            }
                          </p>
                          <p className="text-lg font-semibold text-gray-900 dark:text-white">
                            {startDate ? startDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                          </p>
                        </div>
                        {(!startDate || !endDate || startDate.getTime() !== endDate.getTime()) && (
                          <>
                            <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-4"></div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {t('endDate')} ({t('inclusive')})
                              </p>
                              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                                {endDate ? endDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : '-'}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 rounded-xl">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          {t('doubleClickForSingleDay')}
                        </p>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                          {t('dragForMultipleDays')}
                        </p>
                      </div>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                          if (!startDate) {
                            setDateRange([date, null]);
                          } else if (!endDate) {
                            if (date < startDate) {
                              setDateRange([date, null]);
                            } else {
                              setDateRange([startDate, date]);
                            }
                          } else {
                            setDateRange([date, null]);
                          }
                        }}
                        onSelect={(date) => {
                          const now = Date.now();
                          if (!window.lastClick) {
                            window.lastClick = now;
                          } else {
                            if (now - window.lastClick < 300) {
                              setDateRange([date, date]);
                            }
                            window.lastClick = now;
                          }
                        }}
                        minDate={new Date()}
                        excludeDates={unavailableDates}
                        monthsShown={1}
                        inline
                        locale={language}
                        calendarClassName="w-full"
                        dateFormat="dd/MM/yyyy"
                        formatWeekDay={nameOfDay => {
                          const date = new Date(nameOfDay);
                          return weekDays[language][date.getDay()];
                        }}
                        dayClassName={date => {
                          if (startDate && endDate && date >= startDate && date <= endDate) {
                            let className = "bg-blue-500 text-white hover:bg-blue-600";
                            if (date.getTime() === startDate.getTime()) {
                              className += language === 'ar' ? ' rounded-r-md' : ' rounded-l-md';
                            }
                            if (date.getTime() === endDate.getTime()) {
                              className += language === 'ar' ? ' rounded-l-md' : ' rounded-r-md';
                            }
                            return className;
                          }
                          if (startDate && date.getTime() === startDate.getTime() && !endDate) {
                            return "bg-blue-500 text-white hover:bg-blue-600";
                          }
                          return "";
                        }}
                        renderDayContents={(day, date) => (
                          <div className="relative flex items-center justify-center w-full h-full">
                            <span className={`${isDateUnavailable(date) ? 'text-red-500' : ''} select-none`}>
                              {day}
                            </span>
                            {isDateUnavailable(date) && (
                              <Ban className="w-3 h-3 text-red-500 absolute" style={{ opacity: 0.5 }} />
                            )}
                          </div>
                        )}
                      />
                    </>
                  )}
                </div>
              </div>

              {selectedTeacherForBooking && startDate && endDate && (
                <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('pricePerDay')}</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {selectedTeacherForBooking.price_per_day} {t('sar')}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{t('total')}</p>
                      <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                        {selectedTeacherForBooking.price_per_day * (Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1)} {t('sar')}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1} {t('days')}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => {
                  setShowBookingModal(false);
                  setDateRange([null, null]);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {t('cancel')}
              </button>
              <button
                onClick={handleBookTeacher}
                disabled={!startDate || !endDate || isBooking}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBooking ? t('booking') : t('book')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Teacher Details Dialog */}
      <TeacherDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={() => {
          setIsDetailsDialogOpen(false);
          setSelectedTeacher(null);
        }}
        teacher={selectedTeacher}
      />
    </div>
  );
};

export default FindTeachers; 