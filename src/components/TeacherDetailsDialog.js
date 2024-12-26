import React from 'react';
import { useApp } from '../context/AppContext';
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
  CheckCircle
} from 'lucide-react';
import { format } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';

const TeacherDetailsDialog = ({ isOpen, onClose, teacher }) => {
  const { t, language } = useApp();

  if (!isOpen || !teacher) return null;

  const { user, education } = teacher;

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
                  {user.profile_picture_url ? (
                    <img 
                      src={user.profile_picture_url} 
                      alt={user.full_name}
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
                    {user.full_name}
                  </h2>
                  <div className="flex items-center gap-2 text-white/80">
                    <MapPin className="w-4 h-4" />
                    <span>{language === 'ar' ? user.city_name_ar : user.city_name_en}</span>
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
                  {language === 'ar' ? user.subject_name_ar : user.subject_name_en}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                <div className="text-sm text-gray-500 dark:text-gray-400">{t('pricePerDay')}</div>
                <div className="mt-1 font-medium text-gray-900 dark:text-white">
                  {user.price_per_day} {t('sar')}
                </div>
              </div>
            </div>

            {/* Teaching Styles */}
            <Section icon={BookOpen} title={t('teachingStyles')}>
              <div className="flex flex-wrap gap-2">
                {user.teaching_styles?.map(style => (
                  <TeachingStyle key={style.id} style={style} />
                ))}
              </div>
            </Section>

            {/* Education History */}
            {education.history && (
              <Section icon={GraduationCap} title={t('education')}>
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('degree')}</div>
                      <div className="mt-1 font-medium text-gray-900 dark:text-white">{education.history.degree}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('major')}</div>
                      <div className="mt-1 font-medium text-gray-900 dark:text-white">{education.history.major}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('institution')}</div>
                      <div className="mt-1 font-medium text-gray-900 dark:text-white">{education.history.institution}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('graduationYear')}</div>
                      <div className="mt-1 font-medium text-gray-900 dark:text-white">{education.history.graduation_year}</div>
                    </div>
                  </div>
                  <DocumentLink url={education.history.file_url} label={t('viewDocument')} />
                </div>
              </Section>
            )}

            {/* License */}
            {education.license && (
              <Section icon={Briefcase} title={t('license')}>
                <div className="bg-gray-50 dark:bg-gray-700/30 rounded-2xl p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('licenseNumber')}</div>
                      <div className="mt-1 font-medium text-gray-900 dark:text-white">{education.license.license_number}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('issuingAuthority')}</div>
                      <div className="mt-1 font-medium text-gray-900 dark:text-white">{education.license.issuing_authority}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('issueDate')}</div>
                      <div className="mt-1 font-medium text-gray-900 dark:text-white">{formatDate(education.license.issue_date)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{t('expiryDate')}</div>
                      <div className="mt-1 font-medium text-gray-900 dark:text-white">{formatDate(education.license.expiry_date)}</div>
                    </div>
                  </div>
                  <DocumentLink url={education.license.file_url} label={t('viewDocument')} />
                </div>
              </Section>
            )}

            {/* Certifications */}
            {education.certifications?.length > 0 && (
              <Section icon={Award} title={t('certifications')}>
                <div className="space-y-4">
                  {education.certifications.map(cert => (
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
            {user.cv_file_url && (
              <div className="pt-4">
                <DocumentLink url={user.cv_file_url} label={t('viewCV')} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetailsDialog; 