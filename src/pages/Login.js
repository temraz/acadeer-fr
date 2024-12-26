import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import config from '../config';
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2,
  Languages
} from 'lucide-react';

const Login = () => {
  const { t, language, toggleLanguage } = useApp();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState(null);
  const [touched, setTouched] = useState({});

  // Get the return URL from location state or default to '/app'
  const from = location.state?.from?.pathname || '/app';

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value) {
          return t(language === 'en' ? 'Email is required' : 'البريد الإلكتروني مطلوب');
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          return t(language === 'en' ? 'Please enter a valid email address' : 'يرجى إدخال بريد إلكتروني صحيح');
        }
        return '';
      case 'password':
        if (!value) {
          return t(language === 'en' ? 'Password is required' : 'كلمة المرور مطلوبة');
        }
        return '';
      default:
        return '';
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Validate on change if field has been touched
    if (touched[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: validateField(name, value)
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    setErrors(prev => ({
      ...prev,
      [name]: validateField(name, value)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError(null);

    // Mark all fields as touched
    const touchedFields = {};
    Object.keys(formData).forEach(key => touchedFields[key] = true);
    setTouched(touchedFields);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${config.API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': language
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      if (data.success) {
        // Store tokens in localStorage
        localStorage.setItem('accessToken', data.data.tokens.access_token);
        localStorage.setItem('refreshToken', data.data.tokens.refresh_token);
        
        // Store user data in localStorage
        localStorage.setItem('userData', JSON.stringify(data.data.user));
        
        // Redirect to the return URL or default route
        navigate(from, { replace: true });
      }
    } catch (error) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (name, label, type = 'text', icon) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon}
        <input
          type={type}
          name={name}
          value={formData[name]}
          onChange={handleInputChange}
          onBlur={handleBlur}
          className={`w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 rounded-lg border 
                   ${errors[name] && touched[name] 
                     ? 'border-red-500 dark:border-red-500' 
                     : 'border-gray-300 dark:border-gray-600'} 
                   bg-white dark:bg-gray-800 
                   text-gray-900 dark:text-white
                   placeholder-gray-500 dark:placeholder-gray-400
                   focus:ring-2 focus:border-transparent
                   ${errors[name] && touched[name]
                     ? 'focus:ring-red-500 dark:focus:ring-red-500'
                     : 'focus:ring-blue-500 dark:focus:ring-blue-400'}`}
          placeholder={t(language === 'en' 
            ? `Enter your ${name}` 
            : (name === 'email' ? 'أدخل بريدك الإلكتروني' : 'أدخل كلمة المرور'))}
        />
      </div>
      {errors[name] && touched[name] && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      {/* Left Side - Cover */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-bold mb-6">
            {t(language === 'en' ? 'Welcome Back' : 'مرحباً بعودتك')}
          </h1>
          <p className="text-xl text-blue-100">
            {t(language === 'en' 
              ? 'Sign in to continue to your account' 
              : 'سجل دخولك للمتابعة إلى حسابك')}
          </p>
        </div>
        {/* Decorative Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
            backgroundSize: '30px 30px'
          }} />
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 relative bg-white dark:bg-gray-900">
        {/* Language Toggle */}
        <div className="absolute top-4 right-4">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 rounded-lg 
                     bg-gray-100 dark:bg-gray-800 
                     text-gray-600 dark:text-gray-300 
                     hover:bg-gray-200 dark:hover:bg-gray-700
                     transition-colors duration-200"
          >
            <Languages className="w-5 h-5" />
            <span>{language === 'en' ? 'العربية' : 'English'}</span>
          </button>
        </div>

        {/* Login Form */}
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="w-full max-w-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {t(language === 'en' ? 'Sign In' : 'تسجيل الدخول')}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {t(language === 'en' ? 'Welcome back! Please enter your details' : 'مرحباً بعودتك! الرجاء إدخال بياناتك')}
                </p>
              </div>

              {renderInput(
                'email',
                t(language === 'en' ? 'Email Address' : 'البريد الإلكتروني'),
                'email',
                <Mail className="w-5 h-5 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              )}

              {renderInput(
                'password',
                t(language === 'en' ? 'Password' : 'كلمة المرور'),
                'password',
                <Lock className="w-5 h-5 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              )}

              {/* API Error Message */}
              {apiError && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm">
                  {apiError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 
                         bg-blue-600 dark:bg-blue-500 
                         text-white py-3 rounded-lg
                         hover:bg-blue-700 dark:hover:bg-blue-600 
                         focus:ring-4 focus:ring-blue-500/50 dark:focus:ring-blue-500/70 
                         transition-colors duration-200
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : language === 'en' ? (
                  <>
                    {t('Sign In')}
                    <ArrowRight className="w-5 h-5" />
                  </>
                ) : (
                  <>
                    <ArrowRight className="w-5 h-5 rotate-180" />
                    {t(language === 'en' ? 'Sign In' : 'تسجيل الدخول')}
                  </>
                )}
              </button>

              {/* Sign Up Link */}
              <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                {t(language === 'en' ? "Don't have an account?" : 'ليس لديك حساب؟')}{' '}
                <Link 
                  to="/signup"
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 font-medium"
                >
                  {t(language === 'en' ? 'Sign up' : 'إنشاء حساب')}
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 