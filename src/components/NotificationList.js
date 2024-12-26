import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { Bell, Check, School, Calendar, Clock, CheckCircle2, XCircle, UserCheck, BadgeCheck, X } from 'lucide-react';
import config from '../config';
import { format, formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import BookingDetailsDialog from './BookingDetailsDialog';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const NotificationList = () => {
  const { t, language } = useApp();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const observer = useRef();
  const lastNotificationRef = useRef();
  const navigate = useNavigate();

  // Function to format date based on language
  const formatDate = (date) => {
    const dateObj = new Date(date);
    return formatDistanceToNow(dateObj, {
      addSuffix: true,
      locale: language === 'ar' ? ar : enUS
    });
  };

  // Fetch notifications
  const fetchNotifications = async (pageNum) => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${config.API_URL}/api/notifications?page=${pageNum}&per_page=10`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept-Language': language
          }
        }
      );
      const data = await response.json();
      
      if (data.success) {
        setNotifications(prev => pageNum === 1 ? data.data.data : [...prev, ...data.data.data]);
        setHasMore(data.data.current_page < data.data.total_pages);
      } else {
        setError(data.message || 'Error fetching notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError(t('errorFetchingNotifications'));
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer callback
  const lastNotificationElementRef = useCallback(node => {
    if (loading) return;
    
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    }, {
      threshold: 0.5,
      rootMargin: '100px'
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  // Initial fetch and pagination
  useEffect(() => {
    setPage(1);
    setNotifications([]);
    fetchNotifications(1);
  }, [language]);

  useEffect(() => {
    if (page > 1) {
      fetchNotifications(page);
    }
  }, [page]);

  // Function to mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${config.API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': language
        }
      });

      if (response.ok) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read_at: new Date().toISOString() }
              : notification
          )
        );
        // Update the unread count in the parent component
        window.dispatchEvent(new CustomEvent('notificationRead'));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Fetch booking details
  const fetchBookingDetails = async (bookingId) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${config.API_URL}/api/bookings/${bookingId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': language
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setSelectedBooking(data.data);
        setIsDialogOpen(true);
      } else {
        console.error('Error fetching booking details:', data.message);
      }
    } catch (error) {
      console.error('Error fetching booking details:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'profile_approved':
        return <BadgeCheck className="w-8 h-8 text-green-500" />;
      case 'new_booking':
        return <Calendar className="w-8 h-8 text-indigo-500" />;
      case 'booking_request':
        return <Calendar className="w-8 h-8 text-blue-500" />;
      case 'booking_accept':
        return <CheckCircle2 className="w-8 h-8 text-green-500" />;
      case 'booking_reject':
        return <X className="w-8 h-8 text-red-500" />;
      default:
        return <Bell className="w-8 h-8 text-gray-400" />;
    }
  };

  // Handle notification click
  const handleNotificationClick = async (notification) => {
    console.log('Notification clicked:', notification); // Debug log
    if (['new_booking', 'booking_accept', 'booking_reject'].includes(notification.type) && notification.refrence_column_id) {
      await fetchBookingDetails(notification.refrence_column_id);
      // Mark as read after opening the dialog
      if (!notification.read_at) {
        await markAsRead(notification.id);
      }
    }
    if (notification.type === 'profile_approved') {
      // Mark as read before navigation
      if (!notification.read_at) {
        await markAsRead(notification.id);
      }
      navigate('/app/schedule');
    }
  };

  // Handle booking actions
  const handleBookingAction = async (action) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${config.API_URL}/api/bookings/${selectedBooking.id}/${action}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': language
        }
      });
      const data = await response.json();
      
      if (data.success) {
        await Swal.fire({
          icon: 'success',
          title: t('success'),
          text: t(`booking${action}Success`),
          timer: 1500,
          showConfirmButton: false
        });
        setIsDialogOpen(false);
        setSelectedBooking(null);
        // Refresh notifications
        setPage(1);
        setNotifications([]);
        fetchNotifications(1);
      } else {
        Swal.fire({
          icon: 'error',
          title: t('error'),
          text: data.message || t(`booking${action}Error`)
        });
      }
    } catch (error) {
      console.error(`Error ${action}ing booking:`, error);
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: t(`booking${action}Error`)
      });
    }
  };

  return (
    <div className="h-full">
      {notifications.map((notification, index) => {
        const isLast = index === notifications.length - 1;
        const isUnread = !notification.read_at;
        
        return (
          <div
            key={notification.id}
            ref={isLast ? lastNotificationElementRef : null}
            onClick={() => handleNotificationClick(notification)}
            className={`group relative p-4 transition-all duration-200 cursor-pointer
              ${isUnread ? 'bg-blue-50/50 dark:bg-blue-900/10' : 'bg-white dark:bg-gray-800'}
              ${index !== notifications.length - 1 ? 'border-b dark:border-gray-700' : ''}`}
          >
            {/* Notification Content */}
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center
                ${isUnread ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                {getNotificationIcon(notification.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className={`text-sm font-semibold 
                      ${isUnread ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                      {language === 'ar' ? notification.title_ar : notification.title_en}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {language === 'ar' ? notification.message_ar : notification.message_en}
                    </p>
                  </div>
                  
                  {/* Mark as Read Button */}
                  {isUnread && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent notification click
                        markAsRead(notification.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-full"
                      title={t('markAsRead')}
                    >
                      <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </button>
                  )}
                </div>

                {/* Meta Information */}
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <School className="w-3 h-3" />
                    <span>{language === 'ar' ? notification.school_name_ar : notification.school_name_en}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{formatDate(notification.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center p-4">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-500 border-t-transparent"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="text-center py-4 text-red-500 dark:text-red-400">
          {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && notifications.length === 0 && !error && (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <Bell className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-gray-500 dark:text-gray-400">{t('noNotifications')}</p>
        </div>
      )}

      {/* Booking Details Dialog */}
      {selectedBooking && (
        <BookingDetailsDialog
          booking={selectedBooking}
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedBooking(null);
          }}
          onAccept={() => handleBookingAction('accept')}
          onReject={() => handleBookingAction('reject')}
        />
      )}
    </div>
  );
};

export default NotificationList; 