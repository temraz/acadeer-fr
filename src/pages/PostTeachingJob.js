import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Calendar, Clock, Building2, GraduationCap, 
  DollarSign, FileText, MapPin, AlertCircle 
} from 'lucide-react';
import FormField from '../components/FormField';
import FileUpload from '../components/FileUpload';

const PostTeachingJob = () => {
  const { t, language } = useApp();
  const [formData, setFormData] = useState({
    schoolName: '',
    jobTitle: '',
    subject: '',
    gradeLevel: '',
    startDate: '',
    endDate: '',
    timeSlot: '',
    rate: '',
    location: '',
    requirements: '',
    description: '',
    documents: [],
    urgencyLevel: 'normal',
    preferredQualifications: '',
    additionalNotes: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
  };

  return (
    <div className={`p-8 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white mb-2">
            {t('postTeachingJob')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {t('postJobDescription')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* School Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold dark:text-white flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              {t('schoolInformation')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label={t('schoolName')}
                name="schoolName"
                value={formData.schoolName}
                onChange={handleInputChange}
                required
                rtl={language === 'ar'}
              />
              <FormField
                label={t('location')}
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                rtl={language === 'ar'}
              />
            </div>
          </div>

          {/* Job Details */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold dark:text-white flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              {t('jobDetails')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label={t('jobTitle')}
                name="jobTitle"
                value={formData.jobTitle}
                onChange={handleInputChange}
                required
                rtl={language === 'ar'}
              />
              <FormField
                label={t('subject')}
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                rtl={language === 'ar'}
              />
              <FormField
                label={t('gradeLevel')}
                name="gradeLevel"
                value={formData.gradeLevel}
                onChange={handleInputChange}
                required
                rtl={language === 'ar'}
              />
              <FormField
                label={t('rate')}
                name="rate"
                type="number"
                value={formData.rate}
                onChange={handleInputChange}
                placeholder={t('ratePerHour')}
                required
                rtl={language === 'ar'}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                label={t('startDate')}
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                rtl={language === 'ar'}
              />
              <FormField
                label={t('endDate')}
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                rtl={language === 'ar'}
              />
              <FormField
                label={t('timeSlot')}
                name="timeSlot"
                value={formData.timeSlot}
                onChange={handleInputChange}
                placeholder="9:00 AM - 3:00 PM"
                required
                rtl={language === 'ar'}
              />
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-medium dark:text-gray-300">
                {t('urgencyLevel')}
              </label>
              <div className="flex gap-4">
                {['urgent', 'high', 'normal'].map(level => (
                  <label key={level} className="flex items-center">
                    <input
                      type="radio"
                      name="urgencyLevel"
                      value={level}
                      checked={formData.urgencyLevel === level}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-2 text-gray-700 dark:text-gray-300">
                      {t(level)}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Requirements and Description */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold dark:text-white flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {t('requirementsAndDescription')}
            </h2>
            
            <div className="space-y-6">
              <FormField
                label={t('requirements')}
                name="requirements"
                value={formData.requirements}
                onChange={handleInputChange}
                multiline
                rows={4}
                rtl={language === 'ar'}
              />
              <FormField
                label={t('jobDescription')}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={4}
                required
                rtl={language === 'ar'}
              />
              <FormField
                label={t('preferredQualifications')}
                name="preferredQualifications"
                value={formData.preferredQualifications}
                onChange={handleInputChange}
                multiline
                rows={4}
                rtl={language === 'ar'}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold dark:text-white flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              {t('contactInformation')}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                label={t('contactPerson')}
                name="contactPerson"
                value={formData.contactPerson}
                onChange={handleInputChange}
                required
                rtl={language === 'ar'}
              />
              <FormField
                label={t('contactEmail')}
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
                rtl={language === 'ar'}
              />
              <FormField
                label={t('contactPhone')}
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                required
                rtl={language === 'ar'}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                       transition-colors duration-200 font-medium"
            >
              {t('postJob')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostTeachingJob; 