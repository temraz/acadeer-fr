import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import Swal from 'sweetalert2';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const { t, language } = useApp();
  const accessToken = localStorage.getItem('accessToken');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const receivedApplication = localStorage.getItem('receivedApplication');
  
  // Check if token exists and user data is valid
  const isAuthenticated = !!(accessToken && userData && userData.user_type);

  useEffect(() => {
    // Check if user is a teacher with pending background check
    if (isAuthenticated && 
        userData.user_type === 2 && 
        userData.background_check_status === 1 && 
        location.pathname === '/app/become-substitute') {
      // Show sweet alert only when on the become-substitute page
      Swal.fire({
        title: t('backgroundCheckPending'),
        icon: 'info',
        confirmButtonText: 'OK',
        customClass: {
          container: 'rtl-alert',
          title: 'rtl-alert',
          content: 'rtl-alert'
        }
      });
    }

    // Show processing application message when receivedApplication is 1
    if (isAuthenticated && 
        userData.user_type === 2 && 
        userData.background_check_status === 1 && 
        receivedApplication === '1') {
      Swal.fire({
        title: t('applicationReceived'),
        html: `
          <div class="text-center">
            <p class="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
              ${t('applicationReceivedMessage')}
            </p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: t('ok'),
        customClass: {
          popup: `rtl-popup ${language === 'ar' ? 'swal2-rtl' : ''}`,
          title: 'text-center text-2xl font-semibold text-green-600 !mt-4',
          htmlContainer: 'text-center !mt-4 !mx-0',
          confirmButton: 'swal-confirm-button bg-green-600 hover:bg-green-700'
        }
      });
    }
  }, [location.pathname, receivedApplication, isAuthenticated]);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    // Clear any invalid data
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userData');
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Only redirect teachers with pending background check (status 1) to become-substitute page
  // Allow teachers with approved background check (status 2) to access other pages
  if (userData.user_type === 2 && 
      userData.background_check_status === 1 && 
      location.pathname !== '/app/become-substitute' &&
      location.pathname !== '/login') {
    return <Navigate to="/app/become-substitute" replace />;
  }

  return children;
};

export default ProtectedRoute; 