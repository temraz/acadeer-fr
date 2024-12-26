import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import config from '../config';
import { 
  User, 
  Mail, 
  Phone, 
  School, 
  Upload,
  ArrowRight,
  Loader2,
  Building,
  MapPin,
  ArrowLeft,
  Languages,
  Lock,
  Check
} from 'lucide-react';

const SignUp = () => {
  const { t, language, toggleLanguage } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: selection, 2: form
  const [userType, setUserType] = useState(null); // null, 'teacher', or 'school'
  const [cities, setCities] = useState([]);
  
  const [formData, setFormData] = useState({
    // Teacher fields
    fullName: '',
    email: '',
    password: '',
    mobile: '',
    cityId: '',
    cityName: '',
    
    // School fields
    adminFullName: '',
    adminEmail: '',
    adminPassword: '',
    adminMobile: '',
    schoolNameEn: '',
    schoolNameAr: '',
    schoolCityId: '',
    schoolCityName: '',
    schoolLogo: null
  });
  const [previewLogo, setPreviewLogo] = useState(null);
  const [citySearch, setCitySearch] = useState('');
  const [isCityDropdownOpen, setIsCityDropdownOpen] = useState(false);
  const [teacherCitySearch, setTeacherCitySearch] = useState('');
  const [isTeacherCityDropdownOpen, setIsTeacherCityDropdownOpen] = useState(false);

  // Add validation state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Add new state for success message
  const [successMessage, setSuccessMessage] = useState(null);

  // Validation rules
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateMobile = (mobile) => {
    // Saudi mobile number format: 5XXXXXXXX (9 digits starting with 5)
    const mobileRegex = /^5\d{8}$/;
    return mobileRegex.test(mobile);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'fullName':
      case 'adminFullName':
        return value.length >= 3 ? '' : t(language === 'en' ? 
          'Name must be at least 3 characters long' : 
          'يجب أن يكون الاسم 3 أحرف على الأقل'
        );

      case 'email':
      case 'adminEmail':
        return validateEmail(value) ? '' : t(language === 'en' ? 
          'Please enter a valid email address' : 
          'يرجى إدخال بريد إلكتروني صحيح'
        );

      case 'mobile':
      case 'adminMobile':
        return validateMobile(value) ? '' : t(language === 'en' ? 
          'Please enter a valid Saudi mobile number (e.g., 5XXXXXXXX)' : 
          'يرجى إدخال رقم جوال سعودي صحيح (مثال: 5XXXXXXXX)'
        );

      case 'cityId':
      case 'schoolCityId':
        return value ? '' : t(language === 'en' ? 
          'Please select a city' : 
          'يرجى اختيار مدينة'
        );

      case 'schoolNameEn':
        return value.length >= 3 ? '' : t(language === 'en' ? 
          'School name must be at least 3 characters long' : 
          'يجب أن يكون اسم المدرسة 3 أحرف على الأقل'
        );

      case 'schoolNameAr':
        return value.length >= 3 ? '' : t(language === 'en' ? 
          'School name must be at least 3 characters long' : 
          'يجب أن يكون اسم المدرسة 3 أحرف على الأقل'
        );

      case 'password':
        return value.length >= 8 ? '' : t(language === 'en' ? 
          'Password must be at least 8 characters long' : 
          'يجب أن تكون كلمة المرور 8 أحرف على الأقل'
        );

      default:
        return '';
    }
  };

  // Fetch cities when component mounts
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await fetch(`${config.API_URL}/api/lookups`, {
          headers: {
            'Accept': 'application/json',
            'Accept-Language': language
          }
        });
        const data = await response.json();
        if (data.success && data.data.cities) {
          setCities(data.data.cities);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };

    fetchCities();
  }, [language]);

  // Filter cities based on search
  const filteredCities = cities.filter(city => 
    (language === 'ar' ? city.name_ar : city.name_en)
      .toLowerCase()
      .includes(citySearch.toLowerCase())
  );

  const filteredTeacherCities = cities.filter(city => 
    (language === 'ar' ? city.name_ar : city.name_en)
      .toLowerCase()
      .includes(teacherCitySearch.toLowerCase())
  );

  // Update handleInputChange to handle city selection
  const handleCitySelect = (city, isTeacher = false) => {
    if (isTeacher) {
      setFormData(prev => ({
        ...prev,
        cityId: city.id,
        cityName: language === 'ar' ? city.name_ar : city.name_en
      }));
      setTeacherCitySearch(language === 'ar' ? city.name_ar : city.name_en);
      setIsTeacherCityDropdownOpen(false);
    } else {
      setFormData(prev => ({
        ...prev,
        schoolCityId: city.id,
        schoolCityName: language === 'ar' ? city.name_ar : city.name_en
      }));
      setCitySearch(language === 'ar' ? city.name_ar : city.name_en);
      setIsCityDropdownOpen(false);
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        schoolLogo: file
      }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
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
    const fieldsToValidate = userType === 'teacher' 
      ? ['fullName', 'email', 'password', 'mobile', 'cityId']
      : ['adminFullName', 'adminEmail', 'password', 'adminMobile', 'schoolNameEn', 'schoolNameAr', 'schoolCityId'];

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formFields = userType === 'teacher' 
      ? ['fullName', 'email', 'password', 'mobile', 'cityId']
      : ['adminFullName', 'adminEmail', 'password', 'adminMobile', 'schoolNameEn', 'schoolNameAr', 'schoolCityId'];
    
    const touchedFields = {};
    formFields.forEach(field => touchedFields[field] = true);
    setTouched(touchedFields);

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setSuccessMessage(null);
    
    try {
      const requestData = userType === 'teacher' ? {
        email: formData.email,
        password: formData.password,
        user_type: 2,
        full_name: formData.fullName,
        phone_number: `+966${formData.mobile}`,
        city_id: formData.cityId,
        price_per_day: 200.00
      } : {
        name_en: formData.schoolNameEn,
        name_ar: formData.schoolNameAr,
        admin_full_name: formData.adminFullName,
        admin_email: formData.adminEmail,
        admin_phone: `+966${formData.adminMobile}`,
        password: formData.password,
        city_id: formData.schoolCityId,
        logo: formData.schoolLogo
      };

      // Determine endpoint based on user type
      const endpoint = userType === 'teacher' 
        ? '/api/auth/signup'
        : '/api/auth/school/signup';

      // Prepare request options
      const options = {
        method: 'POST',
        headers: {
          'Accept-Language': language,
          ...(userType === 'teacher' && { 'Content-Type': 'application/json' })
        },
        body: userType === 'teacher' 
          ? JSON.stringify(requestData)
          : (() => {
              const formData = new FormData();
              Object.entries(requestData).forEach(([key, value]) => {
                formData.append(key, value);
              });
              return formData;
            })()
      };

      const response = await fetch(`${config.API_URL}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // Handle successful signup
      if (data.success) {
        setSuccessMessage(data.message);
        // Wait 2 seconds before redirecting
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (error) {
      // Show error message
      setErrors(prev => ({
        ...prev,
        submit: error.message
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserTypeSelect = (type) => {
    setUserType(type);
    setStep(2);
  };

  const renderUserTypeSelection = () => (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t(language === 'en' ? 'Choose Account Type' : 'اختر نوع الحساب')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t(language === 'en' ? 'Select how you want to join our platform' : 'حدد كيف تريد الانضمام إلى منتمعنا')}
        </p>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={() => handleUserTypeSelect('teacher')}
          className="w-full p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 
                   hover:border-blue-600 dark:hover:border-blue-500 transition-colors duration-200
                   flex items-center gap-4 group"
        >
          <User className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div className={`text-left flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className="font-semibold text-lg group-hover:text-blue-600 transition-colors duration-200">
              {t(language === 'en' ? 'Join as a Teacher' : 'انضم كمعلم')}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {t(language === 'en' ? 'Find a substitute teaching opportunities and connect with schools' : 'ابحث عن فرص كمعلم بديل وتواصل مع المدارس')}
            </div>
          </div>
        </button>

        <button
          type="button"
          onClick={() => handleUserTypeSelect('school')}
          className="w-full p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 
                   hover:border-blue-600 dark:hover:border-blue-500 transition-colors duration-200
                   flex items-center gap-4 group"
        >
          <School className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div className={`text-left flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
            <div className="font-semibold text-lg group-hover:text-blue-600 transition-colors duration-200">
              {t(language === 'en' ? 'Register as a School' : 'سجل كمدرسة')}
            </div>
            <div className="text-gray-600 dark:text-gray-400">
              {t(language === 'en' ? 'Find qualified teachers and manage staffing needs' : 'ابحث عن معلمين مؤهلين وأدر احتياجات التوظيف')}
            </div>
          </div>
        </button>
      </div>
    </div>
  );

  const renderInput = (name, label, type = 'text', icon, options = {}) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {icon}
          </span>
        )}
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
          {...options}
        />
      </div>
      {errors[name] && touched[name] && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
          {errors[name]}
        </p>
      )}
    </div>
  );

  const renderMobileInput = (name, label) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {label}
      </label>
      <div className="flex flex-row-reverse">
        {language === 'en' ? (
          <>
            <div className="relative flex-1">
              <Phone className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="tel"
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pl-10 pr-4 py-2 rounded-r-lg border 
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
                placeholder="5XXXXXXXX"
                dir="ltr"
              />
            </div>
            <div className="flex-shrink-0 z-10 inline-flex items-center px-4 border 
                         border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 
                         text-gray-500 dark:text-gray-400 
                         rounded-l-lg text-sm">
              966+
            </div>
          </>
        ) : (
          <>
            <div className="relative flex-1">
              <Phone className="w-5 h-5 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <input
                type="tel"
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                onBlur={handleBlur}
                className={`w-full pr-10 pl-4 py-2 rounded-r-lg border 
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
                placeholder="5XXXXXXXX"
                dir="ltr"
              />
            </div>
            <div className="flex-shrink-0 z-10 inline-flex items-center px-4 border 
                         border-gray-300 dark:border-gray-600 
                         bg-gray-50 dark:bg-gray-700 
                         text-gray-500 dark:text-gray-400 
                         rounded-l-lg text-sm">
              966+
            </div>
          </>
        )}
      </div>
      {errors[name] && touched[name] && (
        <p className="mt-1 text-sm text-red-500 dark:text-red-400">
          {errors[name]}
        </p>
      )}
    </div>
  );

  const renderSubmitError = () => (
    errors.submit && (
      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/50 text-red-600 dark:text-red-400 text-sm">
        {errors.submit}
      </div>
    )
  );

  const renderSuccessMessage = () => (
    successMessage && (
      <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/50 text-green-600 dark:text-green-400 text-sm">
        {successMessage}
      </div>
    )
  );

  const renderTeacherForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t(language === 'en' ? 'Teacher Registration' : 'تسجيل المعلم')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t(language === 'en' ? 'Create your teacher account' : 'أنشئ حساب المعلم الخاص بك')}
        </p>
      </div>

      <div className="space-y-4">
        {renderInput('fullName', t(language === 'en' ? 'Full Name' : 'الاسم الكامل'), 
          'text', <User className="w-5 h-5" />)}
        
        {renderInput('email', t(language === 'en' ? 'Email Address' : 'البريد الإلكتروني'), 
          'email', <Mail className="w-5 h-5" />)}
        
        {renderInput('password', t(language === 'en' ? 'Password' : 'كلمة المرور'), 
          'password', <Lock className="w-5 h-5" />)}
        
        {renderMobileInput('mobile', t(language === 'en' ? 'Mobile Number' : 'رقم الجوال'))}

        {/* City Dropdown */}
        <div className="city-dropdown-container">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t(language === 'en' ? 'City' : 'المدينة')}
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={teacherCitySearch}
              onChange={(e) => {
                setTeacherCitySearch(e.target.value);
                setIsTeacherCityDropdownOpen(true);
              }}
              onFocus={() => setIsTeacherCityDropdownOpen(true)}
              placeholder={t(language === 'en' ? 'Search for a city...' : 'ابحث عن مدينة...')}
              className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {isTeacherCityDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                            border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                {filteredTeacherCities.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      handleCitySelect(city, true);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700
                             transition-colors duration-150"
                  >
                    {language === 'ar' ? city.name_ar : city.name_en}
                  </button>
                ))}
                {!filteredTeacherCities.length && (
                  <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {t(language === 'en' ? 'No cities found' : 'لم يتم العثور على مدن')}
                  </div>
                )}
              </div>
            )}
          </div>
          {formData.cityName && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{t(language === 'en' ? 'Selected:' : 'المدينة المختارة:')} {formData.cityName}</span>
            </div>
          )}
          {errors.cityId && touched.cityId && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.cityId}
            </p>
          )}
        </div>
      </div>

      {renderSubmitError()}
      {renderSuccessMessage()}
      
      <button
        type="submit"
        disabled={isLoading || successMessage}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg
                 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-colors duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : successMessage ? (
          <Check className="w-5 h-5" />
        ) : language === 'en' ? (
          <>
            {t('Create Account')}
            <ArrowRight className="w-5 h-5" />
          </>
        ) : (
          <>
            <ArrowRight className="w-5 h-5 rotate-180" />
            {t(language === 'en' ? 'Create Account' : 'إنشاء حساب')}
          </>
        )}
      </button>
    </form>
  );

  const renderSchoolForm = () => (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-md">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t(language === 'en' ? 'School Registration' : 'تسجيل المدرسة')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {t(language === 'en' ? 'Register your school' : 'سجل مدرستك')}
        </p>
      </div>

      <div className="space-y-4">
        {renderInput('adminFullName', t(language === 'en' ? 'Admin Full Name' : 'اسم المسؤول الكامل'), 
          'text', <User className="w-5 h-5" />)}
        
        {renderInput('adminEmail', t(language === 'en' ? 'Admin Email Address' : 'البريد الإلكتروني للمسؤول'), 
          'email', <Mail className="w-5 h-5" />)}
        
        {renderInput('password', t(language === 'en' ? 'Password' : 'كلمة المرور'), 
          'password', <Lock className="w-5 h-5" />)}
        
        {renderMobileInput('adminMobile', t(language === 'en' ? 'Admin Mobile Number' : 'رقم جوال المسؤول'))}

        {renderInput('schoolNameEn', t(language === 'en' ? 'School Name (English)' : 'اسم المدرسة (بالإنجليزية)'), 
          'text', <Building className="w-5 h-5" />)}
        
        {renderInput('schoolNameAr', t(language === 'en' ? 'School Name (Arabic)' : 'اسم المدرسة (بالعربية)'), 
          'text', <Building className="w-5 h-5" />)}

        {/* City Dropdown */}
        <div className="city-dropdown-container">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t(language === 'en' ? 'City' : 'المدينة')}
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={citySearch}
              onChange={(e) => {
                setCitySearch(e.target.value);
                setIsCityDropdownOpen(true);
              }}
              onFocus={() => setIsCityDropdownOpen(true)}
              placeholder={t(language === 'en' ? 'Search for a city...' : 'ابحث عن مدينة...')}
              className="w-full pl-10 rtl:pl-4 rtl:pr-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 
                       bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            {isCityDropdownOpen && (
              <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg 
                            border border-gray-200 dark:border-gray-700 max-h-60 overflow-auto">
                {filteredCities.map((city) => (
                  <button
                    key={city.id}
                    type="button"
                    onClick={() => {
                      handleCitySelect(city);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700
                             transition-colors duration-150"
                  >
                    {language === 'ar' ? city.name_ar : city.name_en}
                  </button>
                ))}
                {!filteredCities.length && (
                  <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
                    {t(language === 'en' ? 'No cities found' : 'لم يتم العثور على مدن')}
                  </div>
                )}
              </div>
            )}
          </div>
          {formData.schoolCityName && (
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{t(language === 'en' ? 'Selected:' : 'المدينة المختارة:')} {formData.schoolCityName}</span>
            </div>
          )}
          {errors.schoolCityId && touched.schoolCityId && (
            <p className="mt-1 text-sm text-red-500 dark:text-red-400">
              {errors.schoolCityId}
            </p>
          )}
        </div>

        {/* School Logo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {t(language === 'en' ? 'School Logo' : 'صورة المدرسة')}
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed 
                       border-gray-300 dark:border-gray-600 rounded-lg">
            <div className="space-y-1 text-center">
              {previewLogo ? (
                <div className="relative w-24 h-24 mx-auto">
                  <img
                    src={previewLogo}
                    alt="School Logo Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setPreviewLogo(null);
                      setFormData(prev => ({ ...prev, schoolLogo: null }));
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 
                             hover:bg-red-600 transition-colors duration-200"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ) : (
                <>
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium 
                                                         text-blue-600 dark:text-blue-400 hover:text-blue-500">
                      <span>{t(language === 'en' ? 'Upload a file' : 'رفع ملف')}</span>
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {renderSubmitError()}
      {renderSuccessMessage()}
      
      <button
        type="submit"
        disabled={isLoading || successMessage}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-3 rounded-lg
                 hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/50 transition-colors duration-200
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : successMessage ? (
          <Check className="w-5 h-5" />
        ) : language === 'en' ? (
          <>
            {t('Create Account')}
            <ArrowRight className="w-5 h-5" />
          </>
        ) : (
          <>
            <ArrowRight className="w-5 h-5 rotate-180" />
            {t(language === 'en' ? 'Create Account' : 'إنشاء حساب')}
          </>
        )}
      </button>
    </form>
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.city-dropdown-container')) {
        setIsTeacherCityDropdownOpen(false);
        setIsCityDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="min-h-screen flex bg-white dark:bg-gray-900">
      {/* Left Side - Cover */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10 flex flex-col justify-center px-12 text-white">
          <h1 className="text-5xl font-bold mb-6">
            {t(language === 'en' ? 'Join Our Educational Community' : 'انضم إلى منتمعنا التعليمي')}
          </h1>
          <p className="text-xl text-blue-100">
            {t(language === 'en' 
              ? 'Connect with schools and teachers. Make a difference in education.' 
              : 'تواصل مع المدارس والمعلمين. أحدث فرقاً في التعليم.')}
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
        {/* Navigation Controls */}
        <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center">
          {step === 2 ? (
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-2 px-4 py-2 
                       text-gray-600 dark:text-gray-300 
                       hover:text-blue-600 dark:hover:text-blue-400 
                       transition-colors duration-200
                       bg-gray-100 dark:bg-gray-800 
                       hover:bg-gray-200 dark:hover:bg-gray-700
                       rounded-lg"
            >
              {language === 'en' ? (
                <>
                  <ArrowLeft className="w-5 h-5" />
                  <span>{t('Back')}</span>
                </>
              ) : (
                <>
                  <span>{t(language === 'en' ? 'Back' : 'عودة')}</span>
                  <ArrowLeft className="w-5 h-5 rotate-180" />
                </>
              )}
            </button>
          ) : (
            <div className="w-[88px]"></div>
          )}
          
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

        {/* Form Content */}
        <div className="flex items-center justify-center min-h-screen p-8">
          <div className="w-full max-w-md mt-16">
            {step === 1 && (
              <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {t(language === 'en' ? 'Choose Account Type' : 'اختر نوع الحساب')}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    {t(language === 'en' ? 'Select how you want to join our platform' : 'حدد كيف تريد الانضمام إلى منتمعنا')}
                  </p>
                </div>

                <div className="space-y-4">
                  <button
                    type="button"
                    onClick={() => handleUserTypeSelect('teacher')}
                    className="w-full p-6 rounded-xl border-2 
                             border-gray-200 dark:border-gray-700 
                             hover:border-blue-600 dark:hover:border-blue-500 
                             bg-white dark:bg-gray-800
                             transition-colors duration-200
                             flex items-center gap-4 group"
                  >
                    <User className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div className={`text-left flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      <div className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {t(language === 'en' ? 'Join as a Teacher' : 'انضم كمعلم')}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {t(language === 'en' ? 'Find substitute teaching opportunities and connect with schools' : 'ابحث عن فرص كمعلم بديل وتواصل مع المدارس')}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleUserTypeSelect('school')}
                    className="w-full p-6 rounded-xl border-2 
                             border-gray-200 dark:border-gray-700 
                             hover:border-blue-600 dark:hover:border-blue-500 
                             bg-white dark:bg-gray-800
                             transition-colors duration-200
                             flex items-center gap-4 group"
                  >
                    <School className="w-8 h-8 text-blue-600 flex-shrink-0" />
                    <div className={`text-left flex-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      <div className="font-semibold text-lg text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-200">
                        {t(language === 'en' ? 'Register as a School' : 'سجل كمدرسة')}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {t(language === 'en' ? 'Find qualified teachers and manage staffing needs' : 'ابحث عن معلمين مؤهلين وأدر احتياجات التوظيف')}
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
            {step === 2 && userType === 'teacher' && renderTeacherForm()}
            {step === 2 && userType === 'school' && renderSchoolForm()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 