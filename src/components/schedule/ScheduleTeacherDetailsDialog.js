import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  User, 
  MapPin, 
  Calendar,
  GraduationCap,
  Award,
  FileText,
  Briefcase,
  BookOpen,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import config from '../../config';

const ScheduleTeacherDetailsDialog = ({ isOpen, onClose, teacherId }) => {
  const { t, language } = useApp();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      if (!teacherId) return;
      
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('accessToken');
        const response = await fetch(`${config.API_URL}/api/users/users/${teacherId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept-Language': language
          }
        });

        const data = await response.json();
        if (data.success) {
          setTeacher(data.data);
        } else {
          setError(data.message || 'Failed to fetch teacher details');
        }
      } catch (err) {
        setError('An error occurred while fetching teacher details');
        console.error('Error fetching teacher details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && teacherId) {
      fetchTeacherDetails();
    }
  }, [isOpen, teacherId, language]);

  if (!isOpen) return null;

  const formatDate = (date) => {
    if (!date) return '';
    return format(new Date(date), 'MMM d, yyyy', { locale: language === 'ar' ? ar : enUS });
  };

  const TeachingStyle = ({ style }) => (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm">
      <BookOpen className="w-4 h-4" />
      <span>{language === 'ar' ? style.style_name_ar : style.style_name_en}</span>
    </div>
  );

  const DocumentLink = ({ url, label }) => (
    <a 
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
    >
      <FileText className="w-4 h-4" />
      <span>{label}</span>
    </a>
  );

  const Section = ({ icon: Icon, title, children }) => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </div>
        <h4 className="text-base font-medium text-gray-900 dark:text-white">
          {title}
        </h4>
      </div>
      {children}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-red-500 dark:text-red-400">{error}</div>
            </div>
          ) : teacher ? (
            <>
              {/* Header */}
              <div className="relative h-48 bg-gradient-to-br from-blue-500 to-purple-500 overflow-hidden">
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/10 hover:bg-black/20 transition-colors"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
                
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/50 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white shadow-lg">
                      {teacher.user.profile_picture_url ? (
                        <img 
                          src={teacher.user.profile_picture_url} 
                          alt={teacher.user.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h2 className="text-2xl font-semibold text-white">
                        {teacher.user.full_name}
                      </h2>
                      <div className="flex items-center gap-2 text-white/80">
                        <MapPin className="w-4 h-4" />
                        <span>{language === 'ar' ? teacher.user.city_name_ar : teacher.user.city_name_en}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-8">
                {/* Quick Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('subject')}</div>
                    <div className="mt-1 font-medium text-gray-900 dark:text-white">
                      {language === 'ar' ? teacher.user.subject_name_ar : teacher.user.subject_name_en}
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('pricePerDay')}</div>
                    <div className="mt-1 font-medium text-gray-900 dark:text-white">
                      {teacher.user.price_per_day} {t('sar')}
                    </div>
                  </div>
                </div>

                {/* Teaching Styles */}
                <Section icon={BookOpen} title={t('teachingStyles')}>
                  <div className="flex flex-wrap gap-2">
                    {teacher.user.teaching_styles?.map(style => (
                      <TeachingStyle key={style.id} style={style} />
                    ))}
                  </div>
                </Section>

                {/* Education History */}
                {teacher.education.history && (
                  <Section icon={GraduationCap} title={t('education')}>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{t('degree')}</div>
                          <div className="mt-1 font-medium text-gray-900 dark:text-white">{teacher.education.history.degree}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{t('major')}</div>
                          <div className="mt-1 font-medium text-gray-900 dark:text-white">{teacher.education.history.major}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{t('institution')}</div>
                          <div className="mt-1 font-medium text-gray-900 dark:text-white">{teacher.education.history.institution}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{t('graduationYear')}</div>
                          <div className="mt-1 font-medium text-gray-900 dark:text-white">{teacher.education.history.graduation_year}</div>
                        </div>
                      </div>
                      <DocumentLink url={teacher.education.history.file_url} label={t('viewDocument')} />
                    </div>
                  </Section>
                )}

                {/* License */}
                {teacher.education.license && (
                  <Section icon={Briefcase} title={t('license')}>
                    <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{t('licenseNumber')}</div>
                          <div className="mt-1 font-medium text-gray-900 dark:text-white">{teacher.education.license.license_number}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{t('issuingAuthority')}</div>
                          <div className="mt-1 font-medium text-gray-900 dark:text-white">{teacher.education.license.issuing_authority}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{t('issueDate')}</div>
                          <div className="mt-1 font-medium text-gray-900 dark:text-white">{formatDate(teacher.education.license.issue_date)}</div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{t('expiryDate')}</div>
                          <div className="mt-1 font-medium text-gray-900 dark:text-white">{formatDate(teacher.education.license.expiry_date)}</div>
                        </div>
                      </div>
                      <DocumentLink url={teacher.education.license.file_url} label={t('viewDocument')} />
                    </div>
                  </Section>
                )}

                {/* Certifications */}
                {teacher.education.certifications?.length > 0 && (
                  <Section icon={Award} title={t('certifications')}>
                    <div className="space-y-4">
                      {teacher.education.certifications.map(cert => (
                        <div key={cert.id} className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{t('certification')}</div>
                              <div className="mt-1 font-medium text-gray-900 dark:text-white">
                                {language === 'ar' ? cert.certification.name_ar : cert.certification.name_en}
                              </div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{t('issuingAuthority')}</div>
                              <div className="mt-1 font-medium text-gray-900 dark:text-white">{cert.issuing_authority}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{t('issueDate')}</div>
                              <div className="mt-1 font-medium text-gray-900 dark:text-white">{formatDate(cert.issue_date)}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{t('expiryDate')}</div>
                              <div className="mt-1 font-medium text-gray-900 dark:text-white">{formatDate(cert.expiry_date)}</div>
                            </div>
                          </div>
                          <DocumentLink url={cert.file_url} label={t('viewDocument')} />
                        </div>
                      ))}
                    </div>
                  </Section>
                )}

                {/* CV */}
                {teacher.user.cv_file_url && (
                  <div className="pt-4">
                    <DocumentLink url={teacher.user.cv_file_url} label={t('viewCV')} />
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ScheduleTeacherDetailsDialog; 