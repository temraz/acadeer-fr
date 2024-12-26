import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Search,
  Eye,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  UserCheck
} from 'lucide-react';
import config from '../config';
import Swal from 'sweetalert2';

const PendingTeachers = () => {
  const { t, language } = useApp();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 100,
    totalPages: 0,
    totalRecords: 0
  });

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (language === 'ar') {
      // Format date in Arabic with Gregorian calendar
      const formatter = new Intl.DateTimeFormat('ar-SA', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        calendar: 'gregory',
        numberingSystem: 'arab'
      });
      return formatter.format(date);
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric'
    });
  };

  // Debounce search query
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchTeachers(1);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const fetchTeachers = async (page = 1) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('accessToken');
      const response = await fetch(
        `${config.API_URL}/api/users/pending-teachers?page=${page}&page_size=${pagination.pageSize}&search=${searchQuery}&sort=${sortField}&direction=${sortDirection}`, 
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept-Language': language
          }
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch teachers');
      }

      setTeachers(data.data.records);
      setPagination({
        currentPage: data.data.current_page,
        pageSize: data.data.page_size,
        totalPages: data.data.total_pages,
        totalRecords: data.data.total_records
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [language, sortField, sortDirection]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchTeachers(newPage);
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleView = async (teacher) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${config.API_URL}/api/users/users/${teacher.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Language': language
        }
      });

      const data = await response.json();
      if (!data.success) {
        throw new Error(data.message);
      }

      const teacherData = data.data;
      const FileActions = ({ url, label }) => `
        <div class="flex gap-2 mt-2">
          <a href="${url}" target="_blank" 
             class="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200">
            <svg class="w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
            </svg>
            ${t('view')}
          </a>
          <a href="${url}" download 
             class="inline-flex items-center px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors duration-200">
            <svg class="w-5 h-5 ${language === 'ar' ? 'ml-2' : 'mr-2'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            ${t('download')}
          </a>
        </div>
      `;

      Swal.fire({
        title: teacherData.user.full_name,
        html: `
          <div class="space-y-8 text-${language === 'ar' ? 'right' : 'left'} max-h-[70vh] overflow-y-auto px-4">
            <!-- Profile Header -->
            <div class="relative bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 overflow-hidden">
              <div class="absolute inset-0 bg-pattern opacity-10"></div>
              <div class="relative flex items-center gap-6">
                <div class="flex-shrink-0">
                  ${teacherData.user.profile_picture_url 
                    ? `<img src="${teacherData.user.profile_picture_url}" alt="${teacherData.user.full_name}" 
                        class="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg ring-4 ring-blue-400 ring-opacity-50">`
                    : `<div class="w-32 h-32 rounded-full bg-white flex items-center justify-center border-4 border-white shadow-lg ring-4 ring-blue-400 ring-opacity-50">
                        <span class="text-blue-600 text-4xl font-bold">${teacherData.user.full_name.charAt(0)}</span>
                      </div>`
                  }
                </div>
                <div class="flex-1">
                  <h3 class="text-3xl font-bold text-white mb-3">${teacherData.user.full_name}</h3>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="flex items-center gap-2 bg-white bg-opacity-10 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                      <span class="text-white text-sm font-medium break-all">${teacherData.user.email}</span>
                    </div>
                    <div class="flex items-center gap-2 bg-white bg-opacity-10 rounded-lg px-3 py-2 backdrop-blur-sm">
                      <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                      <span class="text-white text-sm font-medium" dir="ltr">${teacherData.user.phone_number}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Personal Information & Teaching Styles -->
            <div class="grid grid-cols-2 gap-6">
              <!-- Personal Information -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <h4 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                    </svg>
                    ${t('personalInfo')}
                  </h4>
                </div>
                <div class="p-6 space-y-4">
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">${t('gender')}</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      ${teacherData.user.gender === 1 ? t('male') : t('female')}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">${t('birthday')}</span>
                    <span class="font-medium text-gray-900 dark:text-white">
                      ${formatDate(teacherData.user.birthday)}
                    </span>
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-sm text-gray-500 dark:text-gray-400">${t('costPerDay')}</span>
                    <span class="font-medium text-gray-900 dark:text-white" dir="ltr">
                      ${teacherData.user.cost_per_day} ${t('sar')}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Teaching Styles -->
              <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <h4 class="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
                    </svg>
                    ${t('teachingStyles')}
                  </h4>
                </div>
                <div class="p-6">
                  <div class="flex flex-wrap gap-2">
                    ${teacherData.user.teaching_styles.map(style => `
                      <span class="px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-medium flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                        </svg>
                        ${language === 'ar' ? style.style_name_ar : style.style_name_en}
                      </span>
                    `).join('')}
                  </div>
                </div>
              </div>
            </div>

            <!-- CV Section -->
            <div class="border-b pb-6">
              <h4 class="font-semibold text-gray-700 mb-4">${t('cv')}</h4>
              ${teacherData.user.cv_file_url ? FileActions({ url: teacherData.user.cv_file_url, label: t('cv') }) : '-'}
            </div>

            <!-- Education History -->
            <div class="border-b pb-6">
              <h4 class="font-semibold text-gray-700 mb-4">${t('educationHistory')}</h4>
              ${teacherData.education.history ? `
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p class="text-sm text-gray-500">${t('degree')}</p>
                      <p class="font-medium">${teacherData.education.history.degree}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">${t('institution')}</p>
                      <p class="font-medium">${teacherData.education.history.institution}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">${t('major')}</p>
                      <p class="font-medium">${teacherData.education.history.major}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">${t('graduationYear')}</p>
                      <p class="font-medium">${teacherData.education.history.graduation_year}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">${t('gpa')}</p>
                      <p class="font-medium" dir="ltr">
                        ${teacherData.education.history.gpa}
                      </p>
                    </div>
                  </div>
                  ${FileActions({ url: teacherData.education.history.file_url, label: t('educationFile') })}
                </div>
              ` : '-'}
            </div>

            <!-- Teaching License -->
            <div class="border-b pb-6">
              <h4 class="font-semibold text-gray-700 mb-4">${t('teachingLicense')}</h4>
              ${teacherData.education.license ? `
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p class="text-sm text-gray-500">${t('licenseNumber')}</p>
                      <p class="font-medium">${teacherData.education.license.license_number}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">${t('issuingAuthority')}</p>
                      <p class="font-medium">${teacherData.education.license.issuing_authority}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">${t('issueDate')}</p>
                      <p class="font-medium">${formatDate(teacherData.education.license.issue_date)}</p>
                    </div>
                    <div>
                      <p class="text-sm text-gray-500">${t('expiryDate')}</p>
                      <p class="font-medium">${formatDate(teacherData.education.license.expiry_date)}</p>
                    </div>
                  </div>
                  ${FileActions({ url: teacherData.education.license.file_url, label: t('licenseFile') })}
                </div>
              ` : '-'}
            </div>

            <!-- Certifications -->
            <div>
              <h4 class="font-semibold text-gray-700 mb-4">${t('certifications')}</h4>
              <div class="space-y-4">
                ${teacherData.education.certifications.map(cert => `
                  <div class="bg-gray-50 p-4 rounded-lg">
                    <div class="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p class="text-sm text-gray-500">${t('certificateName')}</p>
                        <p class="font-medium">${language === 'ar' ? cert.certification.name_ar : cert.certification.name_en}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">${t('issuingAuthority')}</p>
                        <p class="font-medium">${cert.issuing_authority}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">${t('issueDate')}</p>
                        <p class="font-medium">${formatDate(cert.issue_date)}</p>
                      </div>
                      <div>
                        <p class="text-sm text-gray-500">${t('expiryDate')}</p>
                        <p class="font-medium">${formatDate(cert.expiry_date)}</p>
                      </div>
                    </div>
                    ${FileActions({ url: cert.file_url, label: t('certificateFile') })}
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        `,
        showCancelButton: true,
        showConfirmButton: true,
        confirmButtonText: t('approve'),
        cancelButtonText: t('close'),
        customClass: {
          container: language === 'ar' ? 'rtl' : 'ltr',
          popup: 'swal2-popup-xl',
          confirmButton: 'swal-confirm-button bg-green-600 hover:bg-green-700',
          cancelButton: 'swal-cancel-button'
        },
        width: '80%'
      }).then((result) => {
        if (result.isConfirmed) {
          handleApprove(teacher);
        }
      });
    } catch (error) {
      Swal.fire({
        title: 'Error',
        text: error.message || t('serverError'),
        icon: 'error',
        customClass: {
          container: language === 'ar' ? 'rtl' : 'ltr',
          confirmButton: 'swal-confirm-button'
        }
      });
    }
  };

  const handleApprove = (teacher) => {
    Swal.fire({
      title: t('confirmApproval'),
      text: t('approvalConfirmationMessage'),
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: t('approve'),
      cancelButtonText: t('cancel'),
      customClass: {
        container: language === 'ar' ? 'rtl' : 'ltr',
        confirmButton: 'swal-confirm-button bg-green-600 hover:bg-green-700',
        cancelButton: 'swal-cancel-button'
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = localStorage.getItem('accessToken');
          const response = await fetch(`${config.API_URL}/api/users/teachers/${teacher.id}/approve`, {
            method: 'PUT',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept-Language': language
            }
          });

          const data = await response.json();

          if (data.success) {
            // Remove the approved teacher from the list
            setTeachers(teachers.filter(t => t.id !== teacher.id));
            
            Swal.fire({
              title: t('approved'),
              text: t('teacherApprovedMessage'),
              icon: 'success',
              customClass: {
                container: language === 'ar' ? 'rtl' : 'ltr',
                confirmButton: 'swal-confirm-button'
              }
            });
          } else {
            throw new Error(data.message);
          }
        } catch (error) {
          Swal.fire({
            title: 'Error',
            text: error.message || t('serverError'),
            icon: 'error',
            customClass: {
              container: language === 'ar' ? 'rtl' : 'ltr',
              confirmButton: 'swal-confirm-button'
            }
          });
        }
      }
    });
  };

  if (loading && teachers.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={`p-8 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <UserCheck className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('pendingTeachers')}
          </h1>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          {t('pendingTeachersDesc')}
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t('searchTeachersPlaceholder')}
            className={`w-full px-4 py-3 ${language === 'ar' ? 'pr-12 pl-4' : 'pl-12 pr-4'} 
                     text-gray-900 dark:text-white bg-white dark:bg-gray-800 
                     border border-gray-300 dark:border-gray-700 rounded-lg 
                     focus:ring-2 focus:ring-blue-500 text-${language === 'ar' ? 'right' : 'left'}`}
          />
          <Search className={`absolute ${language === 'ar' ? 'right-3' : 'left-3'} top-3.5 h-5 w-5 text-gray-400`} />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                {[
                  { field: 'full_name', label: t('fullName') },
                  { field: 'email', label: t('email') },
                  { field: 'phone_number', label: t('phoneNumber') },
                  { field: 'city_id', label: t('city') },
                  { field: 'created_at', label: t('applicationDate') },
                  { field: null, label: t('tableActions') }
                ].map((column) => (
                  <th
                    key={column.field || 'actions'}
                    className={`px-6 py-3 text-${language === 'ar' ? 'right' : 'left'} 
                             text-xs font-medium text-gray-500 dark:text-gray-400 
                             uppercase tracking-wider cursor-pointer`}
                    onClick={() => column.field && handleSort(column.field)}
                  >
                    <div className="flex items-center gap-1">
                      <span>{column.label}</span>
                      {column.field && column.field === sortField && (
                        sortDirection === 'asc' ? 
                          <ChevronUp className="w-4 h-4" /> : 
                          <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {teachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-gray-50 dark:hover:bg-gray-900">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        {teacher.profile_picture_url ? (
                          <img
                            src={teacher.profile_picture_url}
                            alt={teacher.full_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-500 dark:text-gray-400 text-sm">
                              {teacher.full_name.charAt(0)}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className={`${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {teacher.full_name}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {teacher.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {teacher.phone_number}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {language === 'ar' ? teacher.city_name_ar : teacher.city_name_en}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    ${formatDate(teacher.created_at)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    <div className={`flex gap-2 ${language === 'ar' ? 'justify-end' : 'justify-start'}`}>
                      <button
                        onClick={() => handleView(teacher)}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        title={t('view')}
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleApprove(teacher)}
                        className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                        title={t('approve')}
                      >
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${pagination.currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {t('previous')}
              </button>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className={`relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                  ${pagination.currentPage === pagination.totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-gray-50'}`}
              >
                {t('next')}
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-400">
                  {t('showingResults', {
                    start: (pagination.currentPage - 1) * pagination.pageSize + 1,
                    end: Math.min(pagination.currentPage * pagination.pageSize, pagination.totalRecords),
                    total: pagination.totalRecords
                  })}
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                    disabled={pagination.currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium
                      ${pagination.currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    {t('previous')}
                  </button>
                  {[...Array(pagination.totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                        ${pagination.currentPage === index + 1
                          ? 'z-10 bg-blue-600 text-white'
                          : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                    disabled={pagination.currentPage === pagination.totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium
                      ${pagination.currentPage === pagination.totalPages
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                  >
                    {t('next')}
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingTeachers; 