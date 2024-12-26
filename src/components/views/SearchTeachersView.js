import React, { useState, useEffect } from 'react';
import { Search, Filter, MapPin } from 'lucide-react';
import TeacherCard from '../TeacherCard';
import { useApp } from '../../context/AppContext';

const SearchTeachersView = () => {
  const { t, language } = useApp();
  const [filters, setFilters] = useState({
    subject: '',
    grade: '',
    availability: '',
    location: '',
    certification: ''
  });
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Common input classes for consistency
  const inputClasses = "w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors";
  const selectClasses = "w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 outline-none transition-colors";

  // Simulated search function
  const searchTeachers = () => {
    setLoading(true);
    setTimeout(() => {
      const mockTeachers = [
        {
          id: 1,
          name: "Emily Rodriguez",
          subjects: ["Mathematics", "Science"],
          availability: "Immediate",
          rating: 4.8,
          location: "New York, NY",
          pricePerDay: 350,
          certifications: ["K-12 Math", "STEM Specialist"],
          profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
          education: [
            {
              degree: "Master of Education in Mathematics",
              institution: "Columbia University",
              year: "2018"
            },
            {
              degree: "Bachelor of Science in Mathematics",
              institution: "NYU",
              year: "2016"
            }
          ],
          experience: [
            {
              position: "High School Math Teacher",
              school: "Brooklyn Technical High School",
              years: "2018-2023"
            }
          ],
          documents: [
            { name: "Teaching License", type: "pdf" },
            { name: "STEM Certification", type: "pdf" },
            { name: "Background Check", type: "pdf" }
          ],
          teachingStyle: {
            description: "Interactive and technology-driven approach focusing on real-world applications",
            methods: ["Project-based Learning", "Digital Tools", "Group Work"]
          },
          schedule: [
            "Monday-Friday: 8AM-3PM",
            "Available for after-school programs"
          ],
          preferences: [
            "High School Level",
            "Advanced Mathematics",
            "Long-term assignments"
          ],
          contactInfo: {
            email: "emily.rodriguez@email.com",
            phone: "(555) 123-4567"
          },
          backgroundCheck: {
            status: "verified",
            lastUpdated: "2024-01-15"
          },
          reviews: [
            {
              school: "Brooklyn Tech HS",
              rating: 5,
              comment: "Excellent at explaining complex concepts to students.",
              date: "Dec 2023"
            }
          ]
        },
        {
          id: 2,
          name: "Michael Chang",
          subjects: ["English", "History"],
          availability: "Next Week",
          rating: 4.5,
          location: "Boston, MA",
          pricePerDay: 300,
          certifications: ["English Literature", "Social Studies"],
          profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
          education: [
            {
              degree: "Master of Arts in English",
              institution: "Harvard University",
              year: "2019"
            }
          ],
          experience: [
            {
              position: "English Teacher",
              school: "Boston Public Schools",
              years: "2019-2023"
            }
          ],
          documents: [
            { name: "Teaching License", type: "pdf" },
            { name: "English Certification", type: "pdf" }
          ],
          teachingStyle: {
            description: "Literature-focused approach with emphasis on critical thinking",
            methods: ["Discussion-based", "Writing Workshops", "Peer Review"]
          },
          schedule: [
            "Monday-Friday: 9AM-4PM",
            "Available for evening tutoring"
          ],
          preferences: [
            "Middle and High School",
            "Literature Focus",
            "Writing Intensive"
          ],
          contactInfo: {
            email: "michael.chang@email.com",
            phone: "(555) 234-5678"
          },
          backgroundCheck: {
            status: "verified",
            lastUpdated: "2024-01-10"
          },
          reviews: [
            {
              school: "Boston High",
              rating: 4,
              comment: "Great at engaging students in literature discussions.",
              date: "Nov 2023"
            }
          ]
        },
        {
          id: 3,
          name: "Sarah Johnson",
          subjects: ["Biology", "Chemistry"],
          availability: "Immediate",
          rating: 4.7,
          location: "Chicago, IL",
          pricePerDay: 325,
          certifications: ["High School Science", "Lab Safety Certified"],
          profileImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
          education: [
            {
              degree: "Master of Science in Biology",
              institution: "University of Chicago",
              year: "2017"
            }
          ],
          experience: [
            {
              position: "Science Teacher",
              school: "Chicago Science Academy",
              years: "2017-2023"
            }
          ],
          documents: [
            { name: "Teaching License", type: "pdf" },
            { name: "Lab Safety Certificate", type: "pdf" }
          ],
          teachingStyle: {
            description: "Hands-on laboratory experience with theoretical foundations",
            methods: ["Lab Work", "Scientific Method", "Research Projects"]
          },
          schedule: [
            "Monday-Friday: 8AM-3PM",
            "Lab sessions available"
          ],
          preferences: [
            "High School Level",
            "Laboratory Focus",
            "Research Projects"
          ],
          contactInfo: {
            email: "sarah.johnson@email.com",
            phone: "(555) 345-6789"
          },
          backgroundCheck: {
            status: "verified",
            lastUpdated: "2024-01-05"
          },
          reviews: [
            {
              school: "Chicago Science Academy",
              rating: 5,
              comment: "Excellent lab instructor and very safety conscious.",
              date: "Oct 2023"
            }
          ]
        }
      ];
      setTeachers(mockTeachers);
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    searchTeachers();
  }, []);

  return (
    <div className={`${language === 'ar' ? 'rtl' : 'ltr'}`}>
      <h1 className="text-3xl font-bold mb-6 dark:text-white">{t('findTeachers')}</h1>
      
      {/* Search and Filter Section */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder={t('searchPlaceholder')}
              className={inputClasses + " pl-10"}
            />
            <Search className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
          </div>

          <select 
            className={selectClasses}
            value={filters.subject}
            onChange={(e) => setFilters({...filters, subject: e.target.value})}
          >
            <option value="">{t('selectSubject')}</option>
            <option value="math">{t('mathematics')}</option>
            <option value="science">{t('science')}</option>
            <option value="english">{t('english')}</option>
            <option value="history">{t('history')}</option>
          </select>

          <select 
            className={selectClasses}
            value={filters.availability}
            onChange={(e) => setFilters({...filters, availability: e.target.value})}
          >
            <option value="">{t('availability')}</option>
            <option value="immediate">{t('immediate')}</option>
            <option value="nextweek">{t('nextWeek')}</option>
          </select>
        </div>

        {/* Advanced Filters Toggle */}
        <div className="flex justify-between items-center mt-4">
          <button 
            onClick={() => setAdvancedFiltersOpen(!advancedFiltersOpen)}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
          >
            <Filter className="mr-2" />
            {advancedFiltersOpen ? t('hideAdvancedFilters') : t('showAdvancedFilters')}
          </button>
        </div>

        {/* Advanced Filters */}
        {advancedFiltersOpen && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <select 
              className={selectClasses}
              value={filters.grade}
              onChange={(e) => setFilters({...filters, grade: e.target.value})}
            >
              <option value="">{t('gradeLevel')}</option>
              <option value="elementary">{t('elementary')}</option>
              <option value="middle">{t('middleSchool')}</option>
              <option value="high">{t('highSchool')}</option>
            </select>

            <select 
              className={selectClasses}
              value={filters.certification}
              onChange={(e) => setFilters({...filters, certification: e.target.value})}
            >
              <option value="">{t('certification')}</option>
              <option value="stem">STEM Certified</option>
              <option value="ela">ELA Certified</option>
              <option value="special">Special Education</option>
            </select>

            <div className="relative">
              <input 
                type="text" 
                placeholder={t('location')}
                className={inputClasses + " pl-10"}
              />
              <MapPin className="absolute left-3 top-3.5 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      <div>
        <h2 className="text-2xl font-semibold mb-6 dark:text-white">
          {loading ? t('searching') : `${teachers.length} ${t('teachersFound')}`}
        </h2>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 dark:border-blue-400"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map(teacher => (
              <TeacherCard 
                key={teacher.id}
                {...teacher}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchTeachersView; 