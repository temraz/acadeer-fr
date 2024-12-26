import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  UserPlus, 
  Calendar, 
  ClipboardList, 
  Sun, 
  Moon, 
  Languages,
  Bell,
  BellOff,
  ChevronRight,
  ChevronLeft,
  GraduationCap,
  LayoutDashboard,
  CalendarDays,
  Users,
  User,
  LogOut,
  Settings,
  ChevronDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import NotificationList from './NotificationList';
import Swal from 'sweetalert2';

const Layout = () => {
  const { isDarkMode, toggleDarkMode, language, toggleLanguage, t } = useApp();
  const location = useLocation();
  const navigate = useNavigate();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isNotificationBarOpen, setIsNotificationBarOpen] = useState(true);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userType = parseInt(userData.user_type);

  // Function to get user type label
  const getUserTypeLabel = () => {
    switch (userType) {
      case 1:
        return { text: t('superAdmin'), color: 'bg-purple-500' };
      case 2:
        return { text: t('teacher'), color: 'bg-blue-500' };
      case 3:
        return { text: t('admin'), color: 'bg-green-500' };
      default:
        return { text: t('user'), color: 'bg-gray-500' };
    }
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: t('confirmLogout'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: t('yes'),
      cancelButtonText: t('cancel'),
      reverseButtons: language === 'ar',
    });

    if (result.isConfirmed) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      
      await Swal.fire({
        title: t('loggedOut'),
        icon: 'success',
        timer: 1000,
        showConfirmButton: false
      });
      
      navigate('/login');
    }
  };

  console.log('Current user type:', userType);

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center h-24 p-3 rounded-lg w-20 transition-all duration-300 ${
          isActive
            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
        }`
      }
    >
      <Icon size={28} strokeWidth={isActive(to) ? 2.5 : 1.5} />
      <span className="text-xs mt-2 text-center">{label}</span>
    </NavLink>
  );

  const menuItems = [
    {
      title: t('dashboard'),
      path: '/app/dashboard',
      icon: LayoutDashboard,
      userTypes: [1], // Only for super admin
    },
    {
      title: t('findTeachers'),
      path: '/app/find-teachers',
      icon: Search,
      userTypes: [3], // Only for school admin
    },
    {
      title: t('schedule'),
      path: '/app/schedule',
      icon: Calendar,
      userTypes: [2, 3], // For teachers and school admin
    },
    {
      title: t('schoolSchedule'),
      path: '/app/school-schedule',
      icon: CalendarDays,
      userTypes: [3], // Only for school admin
    },
    {
      title: t('assignments'),
      path: '/app/assignments',
      icon: GraduationCap,
      userTypes: [2], // Only for teachers
    },
    {
      title: t('pendingTeachers'),
      path: '/app/pending-teachers',
      icon: Users,
      userTypes: [1], // Only for super admin
    },
    {
      title: t('profile'),
      path: '/app/profile',
      icon: User,
      userTypes: [1, 2, 3], // For all users
    }
  ];

  // Filter menu items based on user type with debug logging
  const filteredMenuItems = menuItems.filter(item => {
    const isAllowed = item.userTypes.includes(userType);
    console.log(`Menu item ${item.title}: allowed=${isAllowed}, userTypes=${item.userTypes}, currentType=${userType}`);
    return isAllowed;
  });

  return (
    <div className={`flex h-screen bg-gray-50 dark:bg-gray-900 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Sidebar Navigation */}
      <div className="w-24 bg-white dark:bg-gray-800 shadow-md flex flex-col items-center py-6">
        <div className="mb-8">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/2436/2436876.png"
            alt="App Logo" 
            className="w-16 h-16 rounded-full"
          />
        </div>
        <nav className="flex flex-col items-center space-y-6">
          {filteredMenuItems.map((item, index) => (
            <NavItem
              key={index}
              to={item.path}
              icon={item.icon}
              label={item.title}
            />
          ))}
        </nav>

        {/* Theme and Language Toggle */}
        <div className="mt-auto pt-6 space-y-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Languages size={24} />
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header with Profile Dropdown */}
        <header className="bg-white dark:bg-gray-800 shadow-md">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-end items-center">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  {userData.profile_pic ? (
                    <img 
                      src={userData.profile_pic}
                      alt={userData.full_name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  )}
                  <div className="text-start">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {userData.full_name}
                    </div>
                    <div className={`text-xs px-1.5 py-0.5 rounded-full ${getUserTypeLabel().color} text-white inline-flex items-center`}>
                      {getUserTypeLabel().text}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 z-50">
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        navigate('/app/profile');
                      }}
                      className="w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <Settings className="w-4 h-4" />
                      {t('editProfile')}
                    </button>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false);
                        handleLogout();
                      }}
                      className="w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      {t('logout')}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>

      {/* Notification Sidebar with Collapse */}
      <div 
        className={`${
          isNotificationBarOpen ? 'w-96' : 'w-12'
        } bg-white dark:bg-gray-800 shadow-lg border-l dark:border-gray-700 transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 border-b dark:border-gray-700 flex justify-between items-center">
          {isNotificationBarOpen && (
            <>
              <h2 className="text-2xl font-semibold dark:text-white">{t('notifications')}</h2>
              <div className="flex items-center space-x-4">
               
              </div>
            </>
          )}
          <button
            onClick={() => setIsNotificationBarOpen(!isNotificationBarOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            {isNotificationBarOpen ? 
              (language === 'ar' ? <ChevronRight size={24} /> : <ChevronLeft size={24} />) : 
              (language === 'ar' ? <ChevronLeft size={24} /> : <ChevronRight size={24} />)
            }
          </button>
        </div>
        {isNotificationBarOpen && (
          notificationsEnabled ? <NotificationList /> : (
            <div className="p-6 text-center text-gray-500">
              {t('notificationsOff')}
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Layout; 