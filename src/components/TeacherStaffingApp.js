import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  UserPlus, 
  Calendar, 
  Sun, 
  Moon, 
  Languages,
  Bell,
  LogOut,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
  User,
  Settings,
  ChevronDown,
  Shield
} from 'lucide-react';
import NotificationList from './NotificationList';
import NavItem from './NavItem';
import Swal from 'sweetalert2';
import config from '../config';

const TeacherStaffingApp = () => {
  const { isDarkMode, toggleDarkMode, language, toggleLanguage, t } = useApp();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [isNotificationBarOpen, setIsNotificationBarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [unreadCount, setUnreadCount] = useState(0);
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userType = parseInt(userData.user_type);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const navigation = [
    { name: 'superAdminDashboard', href: '/app/dashboard', icon: LayoutDashboard, adminOnly: true },
    { name: 'findTeachers', href: '/app', icon: Search, schoolAdminOnly: true },
    { name: 'becomeASub', href: '/app/become-substitute', icon: UserPlus, teacherOnly: true },
    { 
      name: 'schedule', 
      href: '/app/schedule', 
      icon: Calendar,
      showFor: [2, 3] // Only show for teacher (2) and school admin (3)
    },
    { 
      name: 'pendingTeachers', 
      href: '/app/pending-teachers', 
      icon: UserPlus,
      adminOnly: true 
    },
    { 
      name: 'profile', 
      href: '/app/profile', 
      icon: User,
    }
  ];

  const fetchUnreadCount = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${config.API_URL}/api/notifications?page=1&per_page=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': language
        }
      });
      const data = await response.json();
      
      if (data.success) {
        const unreadNotifications = data.data.data.filter(notification => !notification.read_at);
        setUnreadCount(unreadNotifications.length);
        // Store total unread count from response header or metadata
        const totalUnread = parseInt(data.data.unread_count) || unreadNotifications.length;
        setUnreadCount(totalUnread);
      }
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Add event listener for notification read
    const handleNotificationRead = () => {
      fetchUnreadCount();
    };
    window.addEventListener('notificationRead', handleNotificationRead);
    
    return () => {
      window.removeEventListener('notificationRead', handleNotificationRead);
    };
  }, [language]);

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
          {navigation
            .filter(item => 
              (!item.adminOnly || (item.adminOnly && userType === 1)) && 
              (!item.teacherOnly || (item.teacherOnly && userType === 2)) &&
              (!item.schoolAdminOnly || (item.schoolAdminOnly && userType === 3)) &&
              (!item.showFor || item.showFor.includes(userType))
            )
            .map((item) => (
              <NavItem 
                key={item.name}
                onClick={item.onClick || (() => navigate(item.href))}
                icon={<item.icon className={item.className} />}
                label={t(item.name)}
                active={item.href ? location.pathname === item.href : false}
                className={item.className}
              />
            ))}

          {/* Notification Menu Item */}
          <div className="relative">
            <NavItem 
              onClick={() => setIsNotificationBarOpen(!isNotificationBarOpen)}
              icon={
                <div className="relative">
                  <Bell className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
              }
              label={t('notifications')}
              active={isNotificationBarOpen}
            />
          </div>

          {/* Logout Menu Item */}
          <NavItem 
            onClick={handleLogout}
            icon={<LogOut className="w-6 h-6" />}
            label={t('logout')}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          />
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
        {/* Floating Profile Section */}
        <div className={`fixed ${language === 'ar' ? 'left-6' : 'right-6'} z-50 transition-all duration-300
                      ${isScrolled ? '-top-20 opacity-0' : 'top-6 opacity-100'}`}>
          <div className="relative flex items-center gap-3">
            {/* Notification Button */}
            <button
              onClick={() => setIsNotificationBarOpen(!isNotificationBarOpen)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg 
                       border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 
                       transition-all duration-300 group relative h-[58px] w-[58px] justify-center"
            >
              <div className="relative">
                <Bell className="w-7 h-7 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 
                                flex items-center justify-center rounded-full ring-2 ring-white dark:ring-gray-800">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </div>
            </button>

            {/* Profile Button */}
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg shadow-lg 
                       border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 
                       transition-all duration-300 group"
            >
              <div className="relative">
                {userData.profile_picture ? (
                  <img 
                    src={userData.profile_picture}
                    alt={userData.full_name}
                    className="w-10 h-10 rounded-xl object-cover ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center
                               ring-2 ring-offset-2 ring-blue-500 dark:ring-blue-400">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${getUserTypeLabel().color} 
                              ring-2 ring-white dark:ring-gray-800 flex items-center justify-center`}>
                  <Shield className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <div className="text-start">
                <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {userData.full_name}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {getUserTypeLabel().text}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" />
            </button>

            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className={`absolute ${language === 'ar' ? 'left-0' : 'right-0'} top-full mt-2 w-56 bg-white/90 dark:bg-gray-800/90 
                           backdrop-blur-lg rounded-2xl overflow-hidden shadow-lg border border-gray-200/50 dark:border-gray-700/50
                           animate-in fade-in slide-in-from-top-2 duration-200`}>
                
                <div className="border-t border-gray-200/50 dark:border-gray-700/50 py-1.5">
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      navigate('/app/profile');
                    }}
                    className="w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50
                             flex items-center gap-2.5 transition-colors group"
                  >
                    <Settings className="w-4 h-4 text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400" />
                    <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400">{t('editProfile')}</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsProfileDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20
                             flex items-center gap-2.5 transition-colors group"
                  >
                    <LogOut className="w-4 h-4 text-red-400 group-hover:text-red-500 dark:group-hover:text-red-400" />
                    <span className="group-hover:text-red-700 dark:group-hover:text-red-300">{t('logout')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>

        {/* Notification Panel */}
        <div 
          className={`fixed inset-y-0 w-96 bg-white dark:bg-gray-800 shadow-2xl transform transition-all duration-300 ease-in-out z-50 ${
            language === 'ar' 
              ? `left-0 ${isNotificationBarOpen ? 'translate-x-0 opacity-100 visible' : '-translate-x-[120%] opacity-0 invisible'}`
              : `right-0 ${isNotificationBarOpen ? 'translate-x-0 opacity-100 visible' : 'translate-x-[120%] opacity-0 invisible'}`
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="p-4 border-b dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold dark:text-white flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  {t('notifications')}
                </h2>
                <button
                  onClick={() => setIsNotificationBarOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                >
                  {language === 'ar' ? 
                    <ChevronLeft className="w-5 h-5 text-gray-500" /> :
                    <ChevronRight className="w-5 h-5 text-gray-500" />
                  }
                </button>
              </div>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
              <NotificationList />
            </div>
          </div>
        </div>

        {/* Backdrop for mobile */}
        {isNotificationBarOpen && (
          <div 
            className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
            onClick={() => setIsNotificationBarOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default TeacherStaffingApp; 