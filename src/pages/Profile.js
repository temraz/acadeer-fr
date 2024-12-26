import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import config from '../config';
import { User, Camera, X } from 'lucide-react';
import Swal from 'sweetalert2';

const Profile = () => {
  const { t, language } = useApp();
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [pictureLoading, setPictureLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone_number: '',
    city_id: ''
  });
  const [passwordData, setPasswordData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });

  // Load user data and profile picture
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    setFormData({
      full_name: userData.full_name || '',
      email: userData.email || '',
      phone_number: userData.phone_number || '',
      city_id: userData.city_id || ''
    });
    if (userData.profile_picture) {
      setPreviewUrl(userData.profile_picture);
    }
  }, []);

  // Fetch cities from lookup API
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${config.API_URL}/api/lookups`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept-Language': language
          }
        });
        const data = await response.json();
        if (data.success) {
          setCities(data.data.cities || []);
        }
      } catch (error) {
        console.error('Error fetching cities:', error);
      }
    };
    fetchCities();
  }, [language]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${config.API_URL}/api/profile/basic`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept-Language': language
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        // Update local storage with new user data
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const updatedUserData = { ...userData, ...formData };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));

        await Swal.fire({
          icon: 'success',
          title: t('success'),
          text: t('profileUpdated'),
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: error.message || t('errorUpdatingProfile')
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.new_password !== passwordData.confirm_password) {
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: t('passwordsDoNotMatch')
      });
      return;
    }

    setPasswordLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${config.API_URL}/api/profile/password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept-Language': language
        },
        body: JSON.stringify({
          current_password: passwordData.old_password,
          new_password: passwordData.new_password
        })
      });

      const data = await response.json();

      if (data.success) {
        await Swal.fire({
          icon: 'success',
          title: t('success'),
          text: t('passwordUpdated'),
          timer: 1500,
          showConfirmButton: false
        });
        setPasswordData({
          old_password: '',
          new_password: '',
          confirm_password: ''
        });
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating password:', error);
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: error.message || t('errorUpdatingPassword')
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        Swal.fire({
          icon: 'error',
          title: t('error'),
          text: t('imageSizeLimit')
        });
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handlePictureSubmit = async (e) => {
    e.preventDefault();
    if (!selectedImage) return;

    setPictureLoading(true);
    try {
      const token = localStorage.getItem('accessToken');
      const formData = new FormData();
      formData.append('profile_picture', selectedImage);

      const response = await fetch(`${config.API_URL}/api/profile/picture`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        // Update local storage with new profile picture URL
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const updatedUserData = { ...userData, profile_picture: data.data.profile_picture_url };
        localStorage.setItem('userData', JSON.stringify(updatedUserData));

        await Swal.fire({
          icon: 'success',
          title: t('success'),
          text: t('profilePictureUpdated'),
          timer: 1500,
          showConfirmButton: false
        });
        setSelectedImage(null);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      console.error('Error updating profile picture:', error);
      Swal.fire({
        icon: 'error',
        title: t('error'),
        text: error.message || t('errorUpdatingProfilePicture')
      });
    } finally {
      setPictureLoading(false);
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('profileSettings')}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {t('updateProfileInfo')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Profile Picture Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('profilePicture')}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('updateProfilePicture')}
              </p>
            </div>
            <form onSubmit={handlePictureSubmit} className="p-8">
              <div className="flex flex-col items-center space-y-6">
                {/* Profile Picture Preview */}
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 ring-4 ring-offset-4 ring-blue-500 dark:ring-blue-400">
                    {previewUrl ? (
                      <img 
                        src={previewUrl}
                        alt={t('profilePicture')}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  {previewUrl && selectedImage && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* File Input */}
                <div className="flex flex-col items-center gap-4">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg
                             hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors flex items-center gap-2"
                  >
                    <Camera className="w-5 h-5" />
                    {t('chooseImage')}
                  </button>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('maxFileSize')}
                  </p>
                </div>

                {/* Submit Button */}
                {selectedImage && (
                  <button
                    type="submit"
                    disabled={pictureLoading}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                             transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                             flex items-center gap-2"
                  >
                    {pictureLoading && (
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    )}
                    {t('uploadPicture')}
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Basic Information Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('basicInformation')}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('updateBasicInfo')}
              </p>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('fullName')}
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-colors duration-200"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('email')}
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-colors duration-200"
                    required
                  />
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('phoneNumber')}
                  </label>
                  <input
                    type="tel"
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-colors duration-200"
                    required
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('city')}
                  </label>
                  <select
                    name="city_id"
                    value={formData.city_id}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-colors duration-200"
                    required
                  >
                    <option value="">{t('selectCity')}</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {language === 'ar' ? city.name_ar : city.name_en}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                           transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-2"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  )}
                  {t('saveChanges')}
                </button>
              </div>
            </form>
          </div>

          {/* Password Update Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-100 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t('changePassword')}
              </h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('updatePasswordInfo')}
              </p>
            </div>
            <form onSubmit={handlePasswordSubmit} className="p-8 space-y-6">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t('currentPassword')}
                </label>
                <input
                  type="password"
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handlePasswordChange}
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-colors duration-200"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('newPassword')}
                  </label>
                  <input
                    type="password"
                    name="new_password"
                    value={passwordData.new_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-colors duration-200"
                    required
                  />
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {t('confirmNewPassword')}
                  </label>
                  <input
                    type="password"
                    name="confirm_password"
                    value={passwordData.confirm_password}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                             focus:ring-2 focus:ring-blue-500 focus:border-transparent
                             transition-colors duration-200"
                    required
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 
                           transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                           flex items-center gap-2"
                >
                  {passwordLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  )}
                  {t('updatePassword')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 