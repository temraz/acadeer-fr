import React, { useState } from 'react';
import { Search, Filter, MapPin, Clock, DollarSign, GraduationCap, Building2, BookOpen, Calendar } from 'lucide-react';
import { useApp } from '../context/AppContext';

const ListJobs = () => {
  const { t, language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [filters, setFilters] = useState({
    jobType: [],
    subjects: [],
    gradeLevel: [],
    salary: [0, 10000],
    location: [],
  });

  // Sample data - replace with actual API call
  const jobListings = [
    {
      id: 1,
      title: t('emergencyMathSubTeacher'),
      school: t('internationalAcademy'),
      schoolLogo: "https://www.iacad.gov.ae/images/logo-new.png", // Dubai Islamic Affairs logo
      location: t('dubai'),
      type: t('temporary'),
      salary: '250 AED/day',
      subject: t('mathematics'),
      gradeLevel: t('highSchool'),
      requirements: [
        t('validTeachingLicense'),
        t('mathEducationExp'),
        t('availableShortNotice'),
        t('classroomManagement')
      ],
      description: t('emergencyMathSubDesc'),
      postedDate: '2024-01-15',
      applicationDeadline: '2024-02-15',
      duration: t('twoToThreeMonths'),
      schedule: t('mondayToFriday'),
      benefits: [
        t('competitiveDailyRate'),
        t('transportAllowance'),
        t('flexibleScheduling'),
        t('priorityFuture')
      ]
    },
    {
      id: 2,
      title: t('longTermScienceSub'),
      school: t('americanSchool'),
      schoolLogo: "https://www.americanschooluae.com/images/logo.png", // American School UAE logo
      location: t('abuDhabi'),
      type: t('longTerm'),
      salary: '300 AED/day',
      subject: t('science'),
      gradeLevel: t('middleSchool'),
      requirements: [
        t('scienceDegree'),
        t('teachingCertPreferred'),
        t('labSafety'),
        t('twoYearsExp')
      ],
      description: t('longTermScienceDesc'),
      postedDate: '2024-01-16',
      applicationDeadline: '2024-02-20',
      duration: t('fourMonthsMaternity'),
      schedule: t('sundayToThursday'),
      benefits: [
        t('monthlyBonus'),
        t('healthInsurance'),
        t('profDevelopment'),
        t('schoolEvents')
      ]
    },
    {
      id: 3,
      title: t('onCallElementarySub'),
      school: t('britishSchool'),
      schoolLogo: "https://bsak.ae/wp-content/themes/bsak/images/logo.png", // British School Al Khubairat logo
      location: t('dubai'),
      type: t('onCall'),
      salary: '200-275 AED/day',
      subject: t('allSubjects'),
      gradeLevel: t('elementary'),
      requirements: [
        t('elementaryBackground'),
        t('flexibleAvailability'),
        t('youngLearnerExp'),
        t('positiveAttitude')
      ],
      description: t('onCallElementaryDesc'),
      postedDate: '2024-01-17',
      applicationDeadline: '2024-03-01',
      duration: t('ongoing'),
      schedule: t('flexibleAsNeeded'),
      benefits: [
        t('competitiveRates'),
        t('chooseAvailability'),
        t('regularTraining'),
        t('networkStaff')
      ]
    }
  ];

  const FilterPanel = ({ filters, setFilters }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('jobType')}
          </label>
          <div className="space-y-2">
            {['On-Call', 'Long-term', 'Temporary', 'Emergency'].map(type => (
              <label key={type} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={filters.jobType.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...filters.jobType, type]
                      : filters.jobType.filter(t => t !== type);
                    setFilters({ ...filters, jobType: newTypes });
                  }}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('subjects')}
          </label>
          <div className="space-y-2">
            {['All Subjects', 'Mathematics', 'Science', 'English', 'Social Studies', 'Languages', 'Physical Education'].map(subject => (
              <label key={subject} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={filters.subjects.includes(subject)}
                  onChange={(e) => {
                    const newSubjects = e.target.checked
                      ? [...filters.subjects, subject]
                      : filters.subjects.filter(s => s !== subject);
                    setFilters({ ...filters, subjects: newSubjects });
                  }}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{subject}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('gradeLevel')}
          </label>
          <div className="space-y-2">
            {['Elementary', 'Middle School', 'High School'].map(level => (
              <label key={level} className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-blue-600"
                  checked={filters.gradeLevel.includes(level)}
                  onChange={(e) => {
                    const newLevels = e.target.checked
                      ? [...filters.gradeLevel, level]
                      : filters.gradeLevel.filter(l => l !== level);
                    setFilters({ ...filters, gradeLevel: newLevels });
                  }}
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const JobCard = ({ job, onClick }) => (
    <div 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700 hover:border-blue-100 dark:hover:border-blue-900"
      onClick={() => onClick(job)}
    >
      <div className="relative">
        {/* School Logo Banner */}
        <div className="h-32 w-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 flex items-center justify-center p-4">
          <img 
            src={job.schoolLogo}
            alt={job.school}
            className="h-24 w-auto object-contain"
          />
        </div>
        
        {/* Job Type Badge */}
        <span className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium ${
          job.type === t('temporary') 
            ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-200'
            : job.type === t('longTerm')
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200'
            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200'
        }`}>
          {job.type}
        </span>
      </div>

      <div className="p-6">
        {/* Title and School */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Building2 size={18} className="mr-2 flex-shrink-0" />
            {job.school}
          </div>
        </div>

        {/* Subject and Grade Level */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <BookOpen size={18} className="mr-2 flex-shrink-0" />
            {job.subject}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <GraduationCap size={18} className="mr-2 flex-shrink-0" />
            {job.gradeLevel}
          </div>
        </div>

        {/* Location and Salary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <MapPin size={18} className="mr-2 flex-shrink-0" />
            {job.location}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <DollarSign size={18} className="mr-2 flex-shrink-0" />
            {job.salary}
          </div>
        </div>

        {/* Duration and Schedule */}
        <div className="border-t dark:border-gray-700 pt-4 mt-4 space-y-2">
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Clock size={18} className="mr-2 flex-shrink-0" />
            <span className="font-medium mr-2">{t('duration')}:</span> {job.duration}
          </div>
          <div className="flex items-center text-gray-600 dark:text-gray-300">
            <Calendar size={18} className="mr-2 flex-shrink-0" />
            <span className="font-medium mr-2">{t('workingHours')}:</span> {job.schedule}
          </div>
        </div>

        {/* Apply Button */}
        <div className="mt-6">
          <button
            className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg 
                     transition-colors duration-200 font-medium flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              console.log('Applying for job:', job.id);
            }}
          >
            {t('applyNow')}
          </button>
        </div>
      </div>
    </div>
  );

  const JobDetails = ({ job, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{job.title}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('schoolInfo')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Building2 size={18} className="mr-2" />
                  {job.school}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <MapPin size={18} className="mr-2" />
                  {job.location}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('assignmentDetails')}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock size={18} className="mr-2" />
                  {job.type}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <DollarSign size={18} className="mr-2" />
                  {job.salary}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <GraduationCap size={18} className="mr-2" />
                  {job.subject}
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-300">
                  <Clock size={18} className="mr-2" />
                  {t('gradeLevel')}: {job.gradeLevel}
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('schedule')}
              </h3>
              <div className="text-gray-600 dark:text-gray-300">
                <p><strong>{t('duration')}:</strong> {job.duration}</p>
                <p><strong>{t('workingHours')}:</strong> {job.schedule}</p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('description')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">{job.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('requirements')}
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                {job.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t('benefits')}
              </h3>
              <ul className="list-disc list-inside text-gray-600 dark:text-gray-300">
                {job.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
            </div>

            <div className="flex justify-end pt-6">
              <button
                className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                         transition-colors duration-200 font-medium"
                onClick={() => {
                  // Handle apply action
                  console.log('Applying for job:', job.id);
                }}
              >
                {t('applyNow')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('availableSubJobs')}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t('subJobListingDescription')}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder={t('searchJobs')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border dark:border-gray-700 rounded-lg
                       bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="flex items-center px-4 py-2 bg-white dark:bg-gray-800 
                     border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            <Filter size={20} className="mr-2" />
            {t('filters')}
          </button>
        </div>

        {/* Filter Panel */}
        {filterOpen && <FilterPanel filters={filters} setFilters={setFilters} />}

        {/* Job Listings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobListings.map(job => (
            <JobCard
              key={job.id}
              job={job}
              onClick={() => setSelectedJob(job)}
            />
          ))}
        </div>

        {/* Job Details Modal */}
        {selectedJob && (
          <JobDetails
            job={selectedJob}
            onClose={() => setSelectedJob(null)}
          />
        )}
      </div>
    </div>
  );
};

export default ListJobs; 