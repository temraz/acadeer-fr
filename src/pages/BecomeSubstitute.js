import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Upload, Plus, Minus, Check, X, FileText, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Select from 'react-select';
import FormField from '../components/FormField';
import FileUpload from '../components/FileUpload';
import { getUserProfile, updateUserProfile, ensureValidToken, fetchWithAuth } from '../utils/api';
import Swal from 'sweetalert2';
import config from '../config';

const BecomeSubstitute = () => {
  const { t, language } = useApp();
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cities, setCities] = useState([]);
  const [teachingStyles, setTeachingStyles] = useState([]);
  const [certificationTypes, setCertificationTypes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const steps = [t('personalInfo'), t('qualifications'), t('documents')];

  // Merge validationMessages declarations at the beginning of the component
  const validationMessages = {
    en: {
      validationError: 'Please Complete Required Fields',
      educationFileRequired: 'Please upload your education certificate',
      licenseFileRequired: 'Please upload your teaching license',
      certificateFileRequired: 'Please upload your certification document',
      degreeRequired: 'Please enter your degree',
      institutionRequired: 'Please enter your institution name',
      majorRequired: 'Please enter your major',
      graduationYearRequired: 'Please enter your graduation year',
      gpaRequired: 'Please enter your GPA',
      licenseNumberRequired: 'Please enter your license number',
      issuingAuthorityRequired: 'Please enter the issuing authority',
      issueDateRequired: 'Please enter the issue date',
      expirationDateRequired: 'Please enter the expiration date',
      certificateTypeRequired: 'Please select a certificate type',
      addAtLeastOneEducation: 'Please add at least one education history',
      addAtLeastOneRecord: 'Please add at least one record',
      fileRequired: 'Please upload the required file',
      unknownError: 'An error occurred. Please try again.',
      error: 'Error'
    },
    ar: {
      validationError: 'يرجى إكمال الحقول المطلوبة',
      educationFileRequired: 'يرجى تحميل شهادة التعليم',
      licenseFileRequired: 'يرجى تحميل رخصة التدريس',
      certificateFileRequired: 'يرجى تحميل وثيقة الشهادة',
      degreeRequired: 'يرجى إدخال الدرجة العلمية',
      institutionRequired: 'يرجى إدخال اسم المؤسسة التعليمية',
      majorRequired: 'يرجى إدخال التخصص',
      graduationYearRequired: 'يرجى إدخال سنة التخرج',
      gpaRequired: 'يرجى إدخال المعدل التراكمي',
      licenseNumberRequired: 'يرجى إدخال رقم الرخصة',
      issuingAuthorityRequired: 'يرجى إدخال الجهة المصدرة',
      issueDateRequired: 'يرجى إدخال تاريخ الإصدار',
      expirationDateRequired: 'يرجى إدخال تاريخ الانتهاء',
      certificateTypeRequired: 'يرجى اختيار نوع الشهادة',
      addAtLeastOneEducation: 'يرجى إضافة حجل تعليمي واحد على الأقل',
      addAtLeastOneRecord: 'يرجى إضافة سجل واحد على الأقل',
      fileRequired: 'يرجى تحميل الملف المطلوب',
      unknownError: 'حدث خطأ. يرجى المحاولة مرة أخرى.',
      error: 'خطأ'
    }
  };

  // Update the SweetAlert styles
  useEffect(() => {
    const sweetAlertStyles = `
      .rtl-popup {
        direction: ${language === 'ar' ? 'rtl' : 'ltr'};
      }
      .error-item {
        padding: 8px 15px;
        margin: 8px 0;
        background-color: #FEF2F2;
        border-radius: 6px;
        color: #4B5563;
        font-size: 14px;
        line-height: 1.5;
        text-align: ${language === 'ar' ? 'right' : 'left'};
      }
      .swal2-html-container {
        margin: 1em 0 !important;
        text-align: ${language === 'ar' ? 'right' : 'left'} !important;
      }
      .swal2-title {
        font-size: 1.25rem !important;
        // color: #EF4444 !important;
        font-weight: 600 !important;
        padding: 10px !important;
        text-align: center;
      }
      .swal-confirm-button {
        background-color: #3B82F6 !important;
        color: white !important;
        border-radius: 8px !important;
        padding: 10px 24px !important;
        font-size: 14px !important;
        font-weight: 500 !important;
      }
    `;

    const styleTag = document.createElement('style');
    styleTag.innerHTML = sweetAlertStyles;
    document.head.appendChild(styleTag);

    return () => {
      document.head.removeChild(styleTag);
    };
  }, [language]);

  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
    city_id: '',
    state: '',
    cost_per_day: '',
    teaching_styles: [], // Array of selected teaching style IDs
    subject_id: '',
    
    // Professional Information
    education: [{
      degree: '',
      institution: '',
      graduationYear: '',
      major: '',
      file: null,
      gpa: ''
    }],
    certifications: [{
      certificationId: '',
      name: '',
      issuingAuthority: '',
      issueDate: '',
      expirationDate: '',
      file: null
    }],
    teachingLicense: {
      number: '',
      state: '',
      issueDate: '',
      expirationDate: '',
      file: null,
      status: 'active'
    },
    
    // Teaching Preferences
    subjects: [],
    gradeLevel: [],
    availability: {
      immediateStart: false,
      startDate: '',
      schedule: {
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false
      },
      preferredHours: {
        fullTime: false,
        partTime: false,
        morningOnly: false,
        afternoonOnly: false
      }
    },
    
    // Documents
    documents: {
      resume: null,
      teachingCertificate: null,
      backgroundCheck: null,
      transcripts: null,
      recommendationLetters: []
    },
    profilePicture: null,
    cv: null,
    experienceCertificates: [],
  });

  // Add new state for tracking if education data is loaded
  const [educationDataLoaded, setEducationDataLoaded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileResponse, lookupsData] = await Promise.all([
          fetchWithAuth('/users/me'),
          fetchWithAuth('/lookups')
        ]);

        console.log('Profile Response:', profileResponse);
        console.log('Lookups Response:', lookupsData);

        // Pre-fill form with user data
        if (profileResponse.success && profileResponse.data?.user) {
          const userData = profileResponse.data.user;
          console.log('Setting form data with:', userData);
          
          // Store all required values in localStorage
          localStorage.setItem('receivedApplication', userData.received_application ? 1 : 0);
          localStorage.setItem('backgroundCheckStatus', userData.background_check_status);
          localStorage.setItem('userType', userData.user_type);
          
          const formUpdate = {
            fullName: userData.full_name || '',
            email: userData.email || '',
            phone: userData.phone_number || '',
            city_id: userData.city_id?.toString() || '',
            cost_per_day: userData.cost_per_day?.toString() || '',
            gender: userData.gender?.toString() || '',
            dateOfBirth: userData.birthday ? userData.birthday.split('T')[0] : '',
            teaching_styles: userData.teaching_styles?.map(style => style.id) || [],
            subject_id: userData.subject_id?.toString() || '',
            profilePicture: null,
            profilePictureUrl: userData.profile_picture_url || null,
            cv: null,
            cvUrl: userData.cv_file_url || null,
            cvFileName: userData.cv_file ? userData.cv_file.split('/').pop() : null,
            hasExistingProfilePic: !!userData.profile_picture_url,
            hasExistingCV: !!userData.cv_file_url
          };

          console.log('Form update object:', formUpdate);
          setFormData(prevData => ({
            ...prevData,
            ...formUpdate
          }));
        }

        // Set cities, teaching styles, and subjects from lookup data
        if (lookupsData.success) {
          if (lookupsData.data.cities) {
            setCities(lookupsData.data.cities);
          }
          if (lookupsData.data.teaching_styles) {
            setTeachingStyles(lookupsData.data.teaching_styles);
          }
          if (lookupsData.data.subjects) {
            setSubjects(lookupsData.data.subjects);
          }
          if (lookupsData.data.certifications) {
            setCertificationTypes(lookupsData.data.certifications);
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [language]);

  // Update education data fetching
  useEffect(() => {
    const fetchEducationData = async () => {
      if (step === 2 && !educationDataLoaded) {
        try {
          setLoading(true);

          // Fetch all education data in parallel
          const [historyResponse, licenseResponse, certificationsResponse] = await Promise.all([
            fetchWithAuth('/users/profile/education/history'),
            fetchWithAuth('/users/profile/education/license'),
            fetchWithAuth('/users/profile/education/certifications')
          ]);

          // Update form data with fetched education history
          if (historyResponse.success && historyResponse.data) {
            const educationHistory = Array.isArray(historyResponse.data) 
              ? historyResponse.data 
              : [historyResponse.data];

            const formattedEducation = educationHistory.map(edu => ({
              id: edu.id,
              degree: edu.degree || '',
              institution: edu.institution || '',
              major: edu.major || '',
              graduationYear: edu.graduation_year?.toString() || '',
              gpa: edu.gpa?.toString() || '',
              file: null,
              fileUrl: edu.file_url || null,
              fileName: edu.file || null,
              isExisting: true
            }));

            setFormData(prev => ({
              ...prev,
              education: formattedEducation.length > 0 ? formattedEducation : prev.education
            }));
          }

          // Update form data with fetched license data
          if (licenseResponse.success && licenseResponse.data) {
            const license = licenseResponse.data;
            setFormData(prev => ({
              ...prev,
              teachingLicense: {
                ...prev.teachingLicense,
                id: license.id,
                number: license.license_number || '',
                state: license.issuing_authority || '',
                issueDate: license.issue_date ? license.issue_date.split('T')[0] : '',
                expirationDate: license.expiry_date ? license.expiry_date.split('T')[0] : '',
                status: license.status || 'active',
                file: null,
                fileUrl: license.file_url || null,
                fileName: license.file || null,
                isExisting: true
              }
            }));
          }

          // Update form data with fetched certifications
          if (certificationsResponse.success && certificationsResponse.data) {
            const certifications = Array.isArray(certificationsResponse.data)
              ? certificationsResponse.data
              : [certificationsResponse.data];

            const formattedCertifications = certifications.map(cert => ({
              id: cert.id,
              certificationId: cert.certification_id?.toString() || '',
              name: cert.certification?.name_en || '',
              issuingAuthority: cert.issuing_authority || '',
              issueDate: cert.issue_date ? cert.issue_date.split('T')[0] : '',
              expirationDate: cert.expiry_date ? cert.expiry_date.split('T')[0] : '',
              file: null,
              fileUrl: cert.file_url || null,
              fileName: cert.file || null,
              isExisting: true
            }));

            setFormData(prev => ({
              ...prev,
              certifications: formattedCertifications.length > 0 ? formattedCertifications : prev.certifications
            }));
          }

          setEducationDataLoaded(true);
        } catch (error) {
          console.error('Error fetching education data:', error);
          setError(t('errorFetchingEducation'));
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEducationData();
  }, [step, language, educationDataLoaded]);

  const handleInputChange = (e) => {
    const { name, value, type } = e.target;
    if (type === 'select-multiple') {
      const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedOptions
      }));
    } else if (name === 'phone') {
      // Handle phone number input
      let phoneNumber = value;
      if (!phoneNumber.startsWith('+966')) {
        phoneNumber = '+966' + phoneNumber.replace(/^\+966/, '');
      }
      setFormData(prev => ({
        ...prev,
        [name]: phoneNumber
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? e.target.checked : value
      }));
    }
  };

  const handleFileChange = (field, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: file
    }));
  };

  const handleEducationFileChange = (index, file) => {
    const newEducation = [...formData.education];
    newEducation[index] = {
      ...newEducation[index],
      file: file
    };
    setFormData(prev => ({
      ...prev,
      education: newEducation
    }));
  };

  const handleLicenseFileChange = (file) => {
    setFormData(prev => ({
      ...prev,
      teachingLicense: {
        ...prev.teachingLicense,
        file: file
      }
    }));
  };

  const handleCertificationFileChange = (index, file) => {
    const newCertifications = [...formData.certifications];
    newCertifications[index] = {
      ...newCertifications[index],
      file: file
    };
    setFormData(prev => ({
      ...prev,
      certifications: newCertifications
    }));
  };

  const handleExperienceCertificateAdd = (file) => {
    setFormData(prev => ({
      ...prev,
      experienceCertificates: [...prev.experienceCertificates, file]
    }));
  };

  const validateStep = (currentStep) => {
    console.log('Starting validation for step:', currentStep);
    let newErrors = {};
    let errorMessages = [];
    const currentLang = language || 'ar';

    if (currentStep === 1) {
      // Full Name Validation
      if (!formData.fullName?.trim()) {
        newErrors.fullName = true;
        errorMessages.push(t('enterFullName'));
      }

      // Email Validation
      if (!formData.email?.trim()) {
        newErrors.email = true;
        errorMessages.push(t('enterEmail'));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = true;
        errorMessages.push(language === 'ar' ? 'يرجى إ��خال بريد إلكتروني صحيح' : 'Please enter a valid email');
      }

      // Phone Validation
      if (!formData.phone?.trim()) {
        newErrors.phone = true;
        errorMessages.push(t('enterPhone'));
      } else if (!/^\+966\d{9}$/.test(formData.phone)) {
        newErrors.phone = true;
        errorMessages.push(language === 'ar' ? 'يجب أن يبدأ رقم الهاتف بـ +966 ويتكون من 9 أرقام' : 'Phone number must start with +966 and contain 9 digits');
      }

      // Subject Validation
      if (!formData.subject_id) {
        newErrors.subject_id = true;
        errorMessages.push(t('subjectRequired'));
      }

      // City Validation
      if (!formData.city_id) {
        newErrors.city_id = true;
        errorMessages.push(t('enterCity'));
      }

      // Date of Birth Validation
      if (!formData.dateOfBirth) {
        newErrors.dateOfBirth = true;
        errorMessages.push(t('dateOfBirthRequired'));
      } else {
        // Check if age is at least 18 years
        const birthDate = new Date(formData.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (age < 18 || (age === 18 && monthDiff < 0)) {
          newErrors.dateOfBirth = true;
          errorMessages.push(language === 'ar' ? 'يجب أن يكون عمرك 18 عاماً على الأقل' : 'You must be at least 18 years old');
        }
      }

      // Gender Validation
      if (!formData.gender) {
        newErrors.gender = true;
        errorMessages.push(t('selectGender'));
      }

      // Teaching Styles Validation
      if (!formData.teaching_styles || formData.teaching_styles.length === 0) {
        newErrors.teaching_styles = true;
        errorMessages.push(t('teachingStyleRequired'));
      } else if (formData.teaching_styles.length > 5) {
        newErrors.teaching_styles = true;
        errorMessages.push(t('teachingStyleMax'));
      }

      // Cost per day Validation
      if (!formData.cost_per_day) {
        newErrors.cost_per_day = true;
        errorMessages.push(t('costPerDayRequired'));
      } else {
        const cost = parseFloat(formData.cost_per_day);
        if (cost < 100) {
          newErrors.cost_per_day = true;
          errorMessages.push(t('costPerDayMin'));
        } else if (cost > 2000) {
          newErrors.cost_per_day = true;
          errorMessages.push(t('costPerDayMax'));
        }
      }
    }

    // Education History Validation
    if (currentStep === 2) {
      if (!formData.education || formData.education.length === 0) {
        errorMessages.push(validationMessages[currentLang].addAtLeastOneEducation);
      } else {
        const educationErrors = {};
        formData.education.forEach((edu, index) => {
          if (!edu.isExisting) { // Only validate non-existing records
            const eduErrors = {};
            
            if (!edu.degree?.trim()) {
              eduErrors.degreeRequired = true;
              errorMessages.push(`${t('degree')} #${index + 1}: ${validationMessages[currentLang].degreeRequired}`);
            }
            if (!edu.institution?.trim()) {
              eduErrors.institutionRequired = true;
              errorMessages.push(`${t('institution')} #${index + 1}: ${validationMessages[currentLang].institutionRequired}`);
            }
            if (!edu.major?.trim()) {
              eduErrors.majorRequired = true;
              errorMessages.push(`${t('major')} #${index + 1}: ${validationMessages[currentLang].majorRequired}`);
            }
            if (!edu.graduationYear) {
              eduErrors.graduationYearRequired = true;
              errorMessages.push(`${t('graduationYear')} #${index + 1}: ${validationMessages[currentLang].graduationYearRequired}`);
            }
            if (!edu.gpa) {
              eduErrors.gpaRequired = true;
              errorMessages.push(`${t('gpa')} #${index + 1}: ${validationMessages[currentLang].gpaRequired}`);
            }
            if (!edu.file && !edu.fileUrl) {
              eduErrors.educationFileRequired = true;
              errorMessages.push(`${t('educationDocument')} #${index + 1}: ${validationMessages[currentLang].educationFileRequired}`);
            }

            if (Object.keys(eduErrors).length > 0) {
              educationErrors[index] = eduErrors;
            }
          }
        });

        if (Object.keys(educationErrors).length > 0) {
          newErrors.education = educationErrors;
        }
      }

      // License validation
      if (!formData.teachingLicense.isExisting) {
        const licenseErrors = {};
        const license = formData.teachingLicense;

        if (!license.number?.trim()) {
          licenseErrors.licenseNumberRequired = true;
          errorMessages.push(validationMessages[currentLang].licenseNumberRequired);
        }
        if (!license.state?.trim()) {
          licenseErrors.issuingAuthorityRequired = true;
          errorMessages.push(validationMessages[currentLang].issuingAuthorityRequired);
        }
        if (!license.issueDate) {
          licenseErrors.issueDateRequired = true;
          errorMessages.push(validationMessages[currentLang].issueDateRequired);
        }
        if (!license.expirationDate) {
          licenseErrors.expirationDateRequired = true;
          errorMessages.push(validationMessages[currentLang].expirationDateRequired);
        }
        if (!license.file && !license.fileUrl) {
          licenseErrors.licenseFileRequired = true;
          errorMessages.push(`${t('licenseDocument')}: ${validationMessages[currentLang].licenseFileRequired}`);
        }

        if (Object.keys(licenseErrors).length > 0) {
          newErrors.teachingLicense = licenseErrors;
        }
      }

      // Certification validation
      if (formData.certifications.length > 0) {
        const certificationErrors = {};
        formData.certifications.forEach((cert, index) => {
          if (!cert.isExisting) { // Only validate non-existing records
            const certErrors = {};

            if (!cert.certificationId) {
              certErrors.certificateTypeRequired = true;
              errorMessages.push(`${t('certificateType')} #${index + 1}: ${validationMessages[currentLang].certificateTypeRequired}`);
            }
            if (!cert.issuingAuthority?.trim()) {
              certErrors.issuingAuthorityRequired = true;
              errorMessages.push(`${t('issuingAuthority')} #${index + 1}: ${validationMessages[currentLang].issuingAuthorityRequired}`);
            }
            if (!cert.issueDate) {
              certErrors.issueDateRequired = true;
              errorMessages.push(`${t('issueDate')} #${index + 1}: ${validationMessages[currentLang].issueDateRequired}`);
            }
            if (!cert.expirationDate) {
              certErrors.expirationDateRequired = true;
              errorMessages.push(`${t('expirationDate')} #${index + 1}: ${validationMessages[currentLang].expirationDateRequired}`);
            }
            if (!cert.file && !cert.fileUrl) {
              certErrors.certificateFileRequired = true;
              errorMessages.push(`${t('certificateDocument')} #${index + 1}: ${validationMessages[currentLang].certificateFileRequired}`);
            }

            if (Object.keys(certErrors).length > 0) {
              certificationErrors[index] = certErrors;
            }
          }
        });

        if (Object.keys(certificationErrors).length > 0) {
          newErrors.certifications = certificationErrors;
        }
      }
    }

    // Update the errors state
    setErrors(newErrors);

    const isValid = errorMessages.length === 0;
    console.log('Validation result:', isValid);
    console.log('Validation errors:', newErrors);

    if (!isValid) {
      // Show errors in SweetAlert with custom styling
      const uniqueErrors = [...new Set(errorMessages)]; // Remove duplicates
      Swal.fire({
        icon: 'warning',
        title: validationMessages[currentLang].validationError,
        html: uniqueErrors.map(msg => `<div class="error-item">${msg}</div>`).join(''),
        confirmButtonText: t('ok'),
        customClass: {
          popup: `rtl-popup ${language === 'ar' ? 'swal2-rtl' : ''}`,
          title: 'swal2-title',
          htmlContainer: 'swal2-html-container',
          confirmButton: 'swal-confirm-button'
        }
      });
    }

    return isValid;
  };

  // Update the formatErrorMessage function
  const formatErrorMessage = (message) => {
    if (typeof message !== 'string') return t('unknownError');

    // Handle file required errors
    if (message.toLowerCase().includes('file') && message.toLowerCase().includes('required')) {
      if (message.toLowerCase().includes('education')) {
        return t('educationFileRequired');
      }
      if (message.toLowerCase().includes('license')) {
        return t('licenseFileRequired');
      }
      if (message.toLowerCase().includes('certificate')) {
        return t('certificateFileRequired');
      }
      return t('fileRequired');
    }

    // Handle certification ID errors
    if (message.toLowerCase().includes('certificationid')) {
      return t('certificateTypeRequired');
    }

    return message;
  };

  // Remove the second validationMessages declaration
  // Update the showErrorAlert function to use the existing validationMessages
  const showErrorAlert = (error) => {
    const errorMessage = formatErrorMessage(error.message);
    Swal.fire({
      icon: 'error',
      title: validationMessages[language || 'ar'].error,
      text: errorMessage,
      confirmButtonText: t('ok'),
      customClass: {
        popup: `rtl-popup ${language === 'ar' ? 'swal2-rtl' : ''}`,
        title: 'swal2-title',
        htmlContainer: 'swal2-html-container',
        confirmButton: 'swal-confirm-button'
      }
    });
  };

  // Add loading state for form submission
  const [submitting, setSubmitting] = useState(false);

  // Update handleNext function
  const handleNext = async () => {
    console.log('handleNext called, current step:', step);
    const isValid = validateStep(step);
    
    if (isValid) {
      try {
        setSubmitting(true);
        
        if (step === 1) {
          const profileData = {
            full_name: formData.fullName,
            email: formData.email,
            phone_number: formData.phone,
            city_id: parseInt(formData.city_id),
            cost_per_day: parseFloat(formData.cost_per_day),
            gender: parseInt(formData.gender),
            birthday: formData.dateOfBirth,
            teaching_style_ids: formData.teaching_styles,
            subject_id: parseInt(formData.subject_id)
          };

          const response = await updateUserProfile(profileData);
          if (response.success) {
            setStep(prev => prev + 1);
          } else {
            showErrorAlert({ message: response.message });
          }
        } else if (step === 2) {
          let hasError = false;

          // Check if we have any new records to submit
          const hasNewEducation = formData.education.some(edu => !edu.isExisting);
          const hasNewLicense = !formData.teachingLicense.isExisting;
          const hasNewCertifications = formData.certifications.some(cert => !cert.isExisting);

          // Only submit education histories if there are new ones
          if (hasNewEducation) {
            console.log('Submitting new education histories...');
            const eduFormData = new FormData();
            
            const newEducationRecords = formData.education.filter(edu => !edu.isExisting);
            console.log('New education records to submit:', newEducationRecords);
            
            newEducationRecords.forEach((edu, index) => {
              eduFormData.append(`histories[${index}][degree]`, edu.degree);
              eduFormData.append(`histories[${index}][institution]`, edu.institution);
              eduFormData.append(`histories[${index}][major]`, edu.major);
              eduFormData.append(`histories[${index}][graduation_year]`, edu.graduationYear);
              eduFormData.append(`histories[${index}][gpa]`, edu.gpa);
              if (edu.file) {
                eduFormData.append(`histories[${index}][file]`, edu.file);
              }
            });

            try {
              const eduResponse = await fetchWithAuth('/users/profile/education/histories', {
                method: 'PUT',
                body: eduFormData
              });

              console.log('Education submission response:', eduResponse);

              if (!eduResponse.success) {
                const errorMessage = eduResponse.message || 'Failed to update education histories';
                throw new Error(errorMessage);
              }
            } catch (error) {
              console.error('Education submission error details:', error);
              throw error;
            }
          }

          // Only submit license if it's new
          if (hasNewLicense) {
            console.log('Submitting new teaching license...');
            const licenseFormData = new FormData();
            licenseFormData.append('license_number', formData.teachingLicense.number);
            licenseFormData.append('issuing_authority', formData.teachingLicense.state);
            licenseFormData.append('issue_date', formData.teachingLicense.issueDate);
            licenseFormData.append('expiry_date', formData.teachingLicense.expirationDate);
            licenseFormData.append('status', 'active');
            if (formData.teachingLicense.file) {
              licenseFormData.append('file', formData.teachingLicense.file);
            }

            const licenseResponse = await fetchWithAuth('/users/profile/education/license', {
              method: 'PUT',
              body: licenseFormData
            });

            if (!licenseResponse.success) {
              hasError = true;
              throw new Error(licenseResponse.message || 'Failed to update teaching license');
            }
          }

          // Only submit certifications if there are new ones
          if (hasNewCertifications) {
            console.log('Submitting new certifications...');
            const certFormData = new FormData();
            
            formData.certifications
              .filter(cert => !cert.isExisting)
              .forEach((cert, index) => {
                certFormData.append(`certifications[${index}][certification_id]`, cert.certificationId);
                certFormData.append(`certifications[${index}][issue_date]`, cert.issueDate);
                certFormData.append(`certifications[${index}][expiry_date]`, cert.expirationDate);
                certFormData.append(`certifications[${index}][issuing_authority]`, cert.issuingAuthority);
                if (cert.file) {
                  certFormData.append(`certifications[${index}][file]`, cert.file);
                }
              });

            const certResponse = await fetchWithAuth('/users/profile/education/certifications', {
              method: 'POST',
              body: certFormData
            });

            if (!certResponse.success) {
              hasError = true;
              throw new Error(certResponse.message || 'Failed to update certifications');
            }
          }

          if (!hasError) {
            setError(null);
            setStep(prev => prev + 1);
          }
        } else if (step === 3) {
          // Handle file uploads
          const filesFormData = new FormData();
          
          if (formData.profilePicture) {
            console.log('Uploading profile picture:', formData.profilePicture);
            filesFormData.append('profile_picture', formData.profilePicture);
          }
          
          if (formData.cv) {
            console.log('Uploading CV:', formData.cv);
            filesFormData.append('cv', formData.cv);
          }

          console.log('Sending files to server...');
          const response = await fetchWithAuth('/users/profile/files', {
            method: 'PUT',
            body: filesFormData
          });

          console.log('Server response:', response);
          
          if (!response.success) {
            throw new Error(response.message || 'Failed to upload files');
          }

          // Show success message and update localStorage
          Swal.fire({
            icon: 'success',
            title: t('applicationReceived'),
            html: `
              <div class="text-center">
                <p class="text-gray-600 dark:text-gray-300 text-base leading-relaxed">
                  ${t('applicationReceivedDesc')}
                </p>
              </div>
            `,
            confirmButtonText: t('ok'),
            customClass: {
              popup: `rtl-popup ${language === 'ar' ? 'swal2-rtl' : ''}`,
              title: 'text-center text-2xl font-semibold text-green-600 !mt-4',
              htmlContainer: 'text-center !mt-4 !mx-0',
              confirmButton: 'swal-confirm-button bg-green-600 hover:bg-green-700'
            }
          });

          localStorage.setItem('receivedApplication', '1');
          localStorage.setItem('backgroundCheckStatus', '1');

        }
      } catch (error) {
        console.error('Error in handleNext:', error);
        showErrorAlert(error);
      } finally {
        setSubmitting(false);
      }
    }
  };

  // Custom styles for react-select
  const selectStyles = {
    control: (base, state) => ({
      ...base,
      minHeight: '42px',
      background: 'white',
      borderColor: errors?.teaching_styles ? '#ef4444' : state.isFocused ? '#3b82f6' : '#e5e7eb',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      '&:hover': {
        borderColor: state.isFocused ? '#3b82f6' : '#e5e7eb'
      },
      direction: language === 'ar' ? 'rtl' : 'ltr'
    }),
    menu: (base) => ({
      ...base,
      direction: language === 'ar' ? 'rtl' : 'ltr',
      textAlign: language === 'ar' ? 'right' : 'left',
      zIndex: 9999,
      position: 'absolute',
      width: '100%',
      marginTop: '4px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      backgroundColor: 'white'
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999
    }),
    option: (base, state) => ({
      ...base,
      background: state.isSelected ? '#3b82f6' : state.isFocused ? '#e5e7eb' : 'white',
      color: state.isSelected ? 'white' : '#111827',
      padding: '8px 12px',
      cursor: 'pointer',
      '&:active': {
        background: '#3b82f6'
      }
    }),
    multiValue: (base) => ({
      ...base,
      background: '#e5e7eb',
      borderRadius: '4px'
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: '#111827',
      padding: '2px 6px'
    }),
    multiValueRemove: (base) => ({
      ...base,
      color: '#4b5563',
      ':hover': {
        background: '#d1d5db',
        color: '#111827'
      }
    }),
    placeholder: (base) => ({
      ...base,
      color: '#9ca3af'
    })
  };

  // Transform teaching styles for react-select
  const teachingStyleOptions = teachingStyles.map(style => ({
    value: style.id,
    label: language === 'ar' ? style.style_name_ar : style.style_name_en
  }));

  // Handle teaching styles change
  const handleTeachingStylesChange = (selectedOptions) => {
    setFormData(prev => ({
      ...prev,
      teaching_styles: selectedOptions ? selectedOptions.map(option => option.value) : []
    }));
  };

  // Get selected teaching styles for the controlled component
  const selectedTeachingStyles = teachingStyleOptions.filter(option => 
    formData.teaching_styles.includes(option.value)
  );

  // Update the FileWithPreview component
  const FileWithPreview = ({ file, fileUrl, fileName, onDelete, label, accept, onChange, required, error, rtl }) => {
    return (
      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
        
        {(fileUrl && fileName) ? (
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {fileName}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {/* View Button */}
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                >
                  {t('view')}
                </a>
                {/* Download Button */}
                <a
                  href={fileUrl}
                  download
                  className="px-3 py-1 text-sm bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors"
                >
                  {t('download')}
                </a>
                {/* Delete Button */}
                <button
                  onClick={onDelete}
                  className="p-1 text-red-600 hover:text-red-700 rounded-full hover:bg-red-50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <FileUpload
            accept={accept}
            value={file}
            onChange={onChange}
            required={required}
            error={error}
            rtl={rtl}
          />
        )}
        
        {error && (
          <p className="mt-1 text-sm text-red-500">{error}</p>
        )}
      </div>
    );
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  if (loading) {
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

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className={`space-y-8 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <div className="border-b dark:border-gray-700 pb-4">
              <h2 className="text-2xl font-semibold dark:text-white">{t('personalInfo')}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('personalInfoDesc')}
              </p>
            </div>

            <div className="grid gap-8">
              {/* Full Name and Subject Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={t('fullName')}
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  placeholder={t('enterFullName')}
                  required
                  error={errors?.fullName}
                  rtl={language === 'ar'}
                />

                <div className={language === 'ar' ? 'rtl' : 'ltr'}>
                  <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                    {t('subject')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="subject_id"
                    value={formData.subject_id}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg bg-white dark:bg-gray-700 
                             text-gray-900 dark:text-white border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             ${errors?.subject_id ? 'border-red-500' : ''}
                             ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                    required
                  >
                    <option value="">{t('selectSubject')}</option>
                    {subjects.map(subject => (
                      <option key={subject.id} value={subject.id}>
                        {language === 'ar' ? subject.name_ar : subject.name_en}
                      </option>
                    ))}
                  </select>
                  {errors?.subject_id && (
                    <p className="mt-1 text-sm text-red-500">{t('subjectRequired')}</p>
                  )}
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={t('emailAddress')}
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder={t('enterEmail')}
                  required
                  error={errors?.email}
                  rtl={language === 'ar'}
                />

                <FormField
                  label={t('phoneNumber')}
                  name="phone"
                  type="tel"
                  value={formData.phone || '+966'}
                  onChange={handleInputChange}
                  placeholder="+966XXXXXXXXX"
                  required
                  error={errors?.phone}
                  rtl={language === 'ar'}
                />
              </div>

              {/* Location Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={language === 'ar' ? 'rtl' : 'ltr'}>
                  <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                    {t('city')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="city_id"
                    value={formData.city_id}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg bg-white dark:bg-gray-700 
                             text-gray-900 dark:text-white border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             ${errors?.city_id ? 'border-red-500' : ''}
                             ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <option value="">{t('enterCity')}</option>
                    {cities.map(city => (
                      <option key={city.id} value={city.id}>
                        {language === 'ar' ? city.name_ar : city.name_en}
                      </option>
                    ))}
                  </select>
                  {errors?.city_id && (
                    <p className="mt-1 text-sm text-red-500">{errors.city_id}</p>
                  )}
                </div>
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label={t('dateOfBirth')}
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  required
                  error={errors?.dateOfBirth}
                  rtl={language === 'ar'}
                />

                <div className={language === 'ar' ? 'rtl' : 'ltr'}>
                  <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                    {t('gender')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className={`w-full p-2 border rounded-lg bg-white dark:bg-gray-700 
                             text-gray-900 dark:text-white border-gray-300 dark:border-gray-600
                             focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                             ${errors?.gender ? 'border-red-500' : ''}
                             ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    dir={language === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <option value="">{t('selectGender')}</option>
                    <option value="1">{t('male')}</option>
                    <option value="2">{t('female')}</option>
                  </select>
                  {errors?.gender && (
                    <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                  )}
                </div>
              </div>

              {/* Teaching Style */}
              <div className={language === 'ar' ? 'rtl' : 'ltr'}>
                <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                  {t('teachingStyle')}
                  <span className="text-red-500 ml-1">*</span>
                </label>
                <Select
                  isMulti
                  options={teachingStyleOptions}
                  value={selectedTeachingStyles}
                  onChange={handleTeachingStylesChange}
                  styles={selectStyles}
                  placeholder={t('selectTeachingStyle')}
                  className="react-select-container"
                  classNamePrefix="react-select"
                  noOptionsMessage={() => language === 'ar' ? 'لا توجد خيارت' : 'No options'}
                  isRtl={language === 'ar'}
                  menuPortalTarget={document.body}
                  menuPosition="fixed"
                />
                {errors?.teaching_styles && (
                  <p className="mt-1 text-sm text-red-500">{errors.teaching_styles}</p>
                )}
              </div>

              {/* Cost per day field - Amplified Design */}
              <div className="mt-3">
                <div className={`bg-gray-50 dark:bg-gray-800/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
                  <label className="block text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3">
                    {t('costPerDay')}
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      name="cost_per_day"
                      value={formData.cost_per_day}
                      onChange={handleInputChange}
                      placeholder={t('enterCostPerDay')}
                      className={`w-full pl-12 pr-16 py-3 text-lg font-medium border rounded-lg
                               bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                               border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500
                               ${errors?.cost_per_day ? 'border-red-500' : ''}
                               ${language === 'ar' ? 'text-right' : 'text-left'}`}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 font-medium">SAR</span>
                    </div>
                  </div>
                  {errors?.cost_per_day && (
                    <p className="mt-2 text-sm text-red-500">{errors.cost_per_day}</p>
                  )}
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    {language === 'ar' 
                      ? 'أدخل السعر اليومي المطلوب (الحد الأدنى 100 ريال والحد الأقصى 2000 ريال)'
                      : 'Enter your desired daily rate (minimum 100 SAR and maximum 2000 SAR)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className={`space-y-8 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <div className="border-b dark:border-gray-700 pb-4">
              <h2 className="text-2xl font-semibold dark:text-white">{t('educationalBackground')}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('qualificationsDesc')}
              </p>
            </div>

            {/* Education Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold dark:text-white">
                  {t('educationHistory')}
                  <span className="text-red-500 ml-1">*</span>
                </h3>
                <div className="flex items-center gap-4">
                  {formData.education.some(edu => edu.isExisting) && (
                    <button
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          education: prev.education.filter(edu => !edu.isExisting)
                        }));
                      }}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center"
                    >
                      <X size={18} className={`${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                      {t('deleteAll')}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        education: [...prev.education, { degree: '', institution: '', graduationYear: '', major: '', file: null, gpa: '' }]
                      }));
                    }}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center"
                  >
                    <Plus size={18} className={`${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {t('addEducation')}
                  </button>
                </div>
              </div>

              {formData.education.map((edu, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-4 border border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      label={t('degree')}
                      name={`education[${index}].degree`}
                      value={edu.degree}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index].degree = e.target.value;
                        setFormData(prev => ({ ...prev, education: newEducation }));
                      }}
                      required={!edu.isExisting}
                      disabled={edu.isExisting}
                      error={errors?.education?.[index]?.degree}
                      rtl={language === 'ar'}
                    />
                    <FormField
                      label={t('major')}
                      name={`education[${index}].major`}
                      value={edu.major}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index].major = e.target.value;
                        setFormData(prev => ({ ...prev, education: newEducation }));
                      }}
                      required={!edu.isExisting}
                      disabled={edu.isExisting}
                      error={errors?.education?.[index]?.major}
                      rtl={language === 'ar'}
                    />
                    <FormField
                      label={t('institution')}
                      name={`education[${index}].institution`}
                      value={edu.institution}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index].institution = e.target.value;
                        setFormData(prev => ({ ...prev, education: newEducation }));
                      }}
                      required={!edu.isExisting}
                      disabled={edu.isExisting}
                      error={errors?.education?.[index]?.institution}
                      rtl={language === 'ar'}
                    />
                    <FormField
                      label={t('graduationYear')}
                      name={`education[${index}].graduationYear`}
                      type="number"
                      value={edu.graduationYear}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        newEducation[index].graduationYear = e.target.value;
                        setFormData(prev => ({ ...prev, education: newEducation }));
                      }}
                      required={!edu.isExisting}
                      disabled={edu.isExisting}
                      error={errors?.education?.[index]?.graduationYear}
                      rtl={language === 'ar'}
                    />
                    <FormField
                      label={t('gpa')}
                      name={`education[${index}].gpa`}
                      type="number"
                      step="0.01"
                      min="0"
                      max="100"
                      value={edu.gpa}
                      onChange={(e) => {
                        const newEducation = [...formData.education];
                        // Ensure the value doesn't exceed 100
                        const value = Math.min(parseFloat(e.target.value), 100);
                        newEducation[index].gpa = value;
                        setFormData(prev => ({ ...prev, education: newEducation }));
                      }}
                      required={!edu.isExisting}
                      disabled={edu.isExisting}
                      error={errors?.education?.[index]?.gpa}
                      rtl={language === 'ar'}
                    />
                    <div className="col-span-2">
                      <FileWithPreview
                        label={t('educationDocument')}
                        accept=".pdf"
                        file={edu.file}
                        fileUrl={edu.fileUrl}
                        fileName={edu.fileName}
                        onChange={(file) => handleEducationFileChange(index, file)}
                        onDelete={() => {
                          const newEducation = [...formData.education];
                          newEducation[index] = {
                            ...newEducation[index],
                            file: null,
                            fileUrl: null,
                            fileName: null
                          };
                          setFormData(prev => ({ ...prev, education: newEducation }));
                        }}
                        required={!edu.fileUrl}
                        error={errors?.education?.[index]?.educationFileRequired}
                        rtl={language === 'ar'}
                      />
                    </div>
                  </div>
                  {formData.education.length > 1 && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            education: prev.education.filter((_, i) => i !== index)
                          }));
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center"
                      >
                        <Minus size={18} className={`${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                        {t('removeEducation')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Teaching License Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold dark:text-white">{t('teachingLicense')}</h3>
                {formData.teachingLicense.isExisting && (
                  <button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        teachingLicense: {
                          number: '',
                          state: '',
                          issueDate: '',
                          expirationDate: '',
                          file: null,
                          status: 'active',
                          isExisting: false
                        }
                      }));
                    }}
                    className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center"
                  >
                    <X size={18} className={`${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {t('delete')}
                  </button>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-100 dark:border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    label={t('licenseNumber')}
                    name="teachingLicense.number"
                    value={formData.teachingLicense.number}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        teachingLicense: {
                          ...prev.teachingLicense,
                          number: e.target.value
                        }
                      }));
                    }}
                    required={!formData.teachingLicense.isExisting}
                    disabled={formData.teachingLicense.isExisting}
                    error={errors?.teachingLicense?.number}
                    rtl={language === 'ar'}
                  />
                  <FormField
                    label={t('issuingAuthority')}
                    name="teachingLicense.state"
                    value={formData.teachingLicense.state}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        teachingLicense: {
                          ...prev.teachingLicense,
                          state: e.target.value
                        }
                      }));
                    }}
                    required={!formData.teachingLicense.isExisting}
                    disabled={formData.teachingLicense.isExisting}
                    error={errors?.teachingLicense?.state}
                    rtl={language === 'ar'}
                  />
                  <FormField
                    label={t('issueDate')}
                    name="teachingLicense.issueDate"
                    type="date"
                    value={formData.teachingLicense.issueDate}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        teachingLicense: {
                          ...prev.teachingLicense,
                          issueDate: e.target.value
                        }
                      }));
                    }}
                    required={!formData.teachingLicense.isExisting}
                    disabled={formData.teachingLicense.isExisting}
                    error={errors?.teachingLicense?.issueDate}
                    rtl={language === 'ar'}
                  />
                  <FormField
                    label={t('expirationDate')}
                    name="teachingLicense.expirationDate"
                    type="date"
                    value={formData.teachingLicense.expirationDate}
                    onChange={(e) => {
                      setFormData(prev => ({
                        ...prev,
                        teachingLicense: {
                          ...prev.teachingLicense,
                          expirationDate: e.target.value
                        }
                      }));
                    }}
                    required={!formData.teachingLicense.isExisting}
                    disabled={formData.teachingLicense.isExisting}
                    error={errors?.teachingLicense?.expirationDate}
                    rtl={language === 'ar'}
                  />
                  <div className="col-span-3">
                    <FileWithPreview
                      label={t('licenseDocument')}
                      accept=".pdf"
                      file={formData.teachingLicense.file}
                      fileUrl={formData.teachingLicense.fileUrl}
                      fileName={formData.teachingLicense.fileName}
                      onChange={handleLicenseFileChange}
                      onDelete={() => {
                        setFormData(prev => ({
                          ...prev,
                          teachingLicense: {
                            ...prev.teachingLicense,
                            file: null,
                            fileUrl: null,
                            fileName: null
                          }
                        }));
                      }}
                      required={!formData.teachingLicense.isExisting}
                      disabled={formData.teachingLicense.isExisting}
                      error={errors?.teachingLicense?.licenseFileRequired}
                      rtl={language === 'ar'}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold dark:text-white">{t('additionalCertifications')}</h3>
                <div className="flex items-center gap-4">
                  {formData.certifications.some(cert => cert.isExisting) && (
                    <button
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          certifications: prev.certifications.filter(cert => !cert.isExisting)
                        }));
                      }}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center"
                    >
                      <X size={18} className={`${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                      {t('deleteAll')}
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        certifications: [...prev.certifications, {
                          certificationId: '',
                          name: '',
                          issuingAuthority: '',
                          issueDate: '',
                          expirationDate: '',
                          file: null
                        }]
                      }));
                    }}
                    className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors duration-200 flex items-center"
                  >
                    <Plus size={18} className={`${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {t('addCertification')}
                  </button>
                </div>
              </div>

              {formData.certifications.map((cert, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 mb-4 border border-gray-100 dark:border-gray-700">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className={language === 'ar' ? 'rtl' : 'ltr'}>
                      <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                        {t('certificateType')}
                        {!cert.isExisting && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <select
                        name={`certifications[${index}].certificationId`}
                        value={cert.certificationId}
                        onChange={(e) => {
                          const newCerts = [...formData.certifications];
                          const selectedCert = certificationTypes.find(c => c.id.toString() === e.target.value);
                          newCerts[index] = {
                            ...newCerts[index],
                            certificationId: e.target.value,
                            name: selectedCert ? (language === 'ar' ? selectedCert.name_ar : selectedCert.name_en) : ''
                          };
                          setFormData(prev => ({ ...prev, certifications: newCerts }));
                        }}
                        disabled={cert.isExisting}
                        className={`w-full p-2 border rounded-lg bg-white dark:bg-gray-700 
                                 text-gray-900 dark:text-white border-gray-300 dark:border-gray-600
                                 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400
                                 ${errors?.certifications?.[index]?.certificationId ? 'border-red-500' : ''}
                                 ${language === 'ar' ? 'text-right' : 'text-left'}
                                 ${cert.isExisting ? 'bg-gray-100 cursor-not-allowed' : ''}`}
                        dir={language === 'ar' ? 'rtl' : 'ltr'}
                        required={!cert.isExisting}
                      >
                        <option value="">{t('selectCertificateType')}</option>
                        {certificationTypes.map(certType => (
                          <option key={certType.id} value={certType.id}>
                            {language === 'ar' ? certType.name_ar : certType.name_en}
                          </option>
                        ))}
                      </select>
                      {errors?.certifications?.[index]?.certificationId && (
                        <p className="mt-1 text-sm text-red-500">{errors.certifications[index].certificationId}</p>
                      )}
                    </div>
                    <FormField
                      label={t('issuingAuthority')}
                      name={`certifications[${index}].issuingAuthority`}
                      value={cert.issuingAuthority}
                      onChange={(e) => {
                        const newCerts = [...formData.certifications];
                        newCerts[index].issuingAuthority = e.target.value;
                        setFormData(prev => ({ ...prev, certifications: newCerts }));
                      }}
                      required={!cert.isExisting}
                      disabled={cert.isExisting}
                      error={errors?.certifications?.[index]?.issuingAuthority}
                      rtl={language === 'ar'}
                    />
                    <FormField
                      label={t('issueDate')}
                      name={`certifications[${index}].issueDate`}
                      type="date"
                      value={cert.issueDate}
                      onChange={(e) => {
                        const newCerts = [...formData.certifications];
                        newCerts[index].issueDate = e.target.value;
                        setFormData(prev => ({ ...prev, certifications: newCerts }));
                      }}
                      required={!cert.isExisting}
                      disabled={cert.isExisting}
                      error={errors?.certifications?.[index]?.issueDate}
                      rtl={language === 'ar'}
                    />
                    <FormField
                      label={t('expirationDate')}
                      name={`certifications[${index}].expirationDate`}
                      type="date"
                      value={cert.expirationDate}
                      onChange={(e) => {
                        const newCerts = [...formData.certifications];
                        newCerts[index].expirationDate = e.target.value;
                        setFormData(prev => ({ ...prev, certifications: newCerts }));
                      }}
                      required={!cert.isExisting}
                      disabled={cert.isExisting}
                      error={errors?.certifications?.[index]?.expirationDate}
                      rtl={language === 'ar'}
                    />
                    <div className="col-span-3">
                      <FileWithPreview
                        label={t('certificateDocument')}
                        accept=".pdf"
                        file={cert.file}
                        fileUrl={cert.fileUrl}
                        fileName={cert.fileName}
                        onChange={(file) => handleCertificationFileChange(index, file)}
                        onDelete={() => {
                          const newCerts = [...formData.certifications];
                          newCerts[index] = {
                            ...newCerts[index],
                            file: null,
                            fileUrl: null,
                            fileName: null
                          };
                          setFormData(prev => ({ ...prev, certifications: newCerts }));
                        }}
                        required={!cert.isExisting}
                        disabled={cert.isExisting}
                        error={errors?.certifications?.[index]?.certificateFileRequired}
                        rtl={language === 'ar'}
                      />
                    </div>
                  </div>

                  {formData.certifications.length > 1 && (
                    <div className="mt-4 flex justify-end">
                      <button
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            certifications: prev.certifications.filter((_, i) => i !== index)
                          }));
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors duration-200 flex items-center"
                      >
                        <Minus size={18} className={`${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                        {t('removeCertification')}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className={`space-y-8 ${language === 'ar' ? 'rtl' : 'ltr'}`}>
            <div className="border-b dark:border-gray-700 pb-4">
              <h2 className="text-2xl font-semibold dark:text-white">{t('documents')}</h2>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {t('documentsDesc')}
              </p>
            </div>

            {/* Profile Picture */}
            <div className="flex justify-center">
              <div className="w-full max-w-md">
                {formData.profilePictureUrl ? (
                  <div className="text-center">
                    <div className="relative inline-block">
                      <img 
                        src={formData.profilePictureUrl}
                        alt="Profile"
                        className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                      />
                      <button
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            profilePictureUrl: null,
                            hasExistingProfilePic: false
                          }));
                        }}
                        className="absolute -top-2 -right-2 p-1 bg-red-100 rounded-full text-red-600 hover:bg-red-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <FileUpload
                    label={t('profilePicture')}
                    accept="image/*"
                    value={formData.profilePicture}
                    onChange={(file) => handleFileChange('profilePicture', file)}
                    required
                    error={errors?.profilePicture}
                    previewType="circle"
                    rtl={language === 'ar'}
                  />
                )}
              </div>
            </div>

            {/* CV Upload */}
            <div className="w-full">
              {formData.cvUrl ? (
                <div className="border rounded-lg p-4 relative">
                  <div className="flex items-center justify-between">
                    <a 
                      href={formData.cvUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700 flex items-center"
                    >
                      <FileText className="w-5 h-5 mr-2" />
                      {formData.cvFileName || 'CV File'}
                    </a>
                    <button
                      onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          cvUrl: null,
                          cvFileName: null,
                          hasExistingCV: false
                        }));
                      }}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <FileUpload
                  label={t('cvResume')}
                  accept=".pdf"
                  value={formData.cv}
                  onChange={(file) => handleFileChange('cv', file)}
                  required
                  error={errors?.cv}
                  rtl={language === 'ar'}
                />
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500">
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('joinTeaching')}
          </h1>
          <p className="text-xl text-white/90 max-w-2xl">
            {t('makeADifference')}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-8">
        {/* Form Container */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg overflow-hidden">
          {/* Progress Steps */}
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between max-w-3xl mx-auto">
              {steps.map((label, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="flex items-center">
                    <div className={`
                      w-10 h-10 rounded-full flex items-center justify-center
                      transition-all duration-300
                      ${step > index + 1 
                        ? 'bg-green-500 dark:bg-green-600' 
                        : step === index + 1 
                          ? 'bg-blue-600 dark:bg-blue-500' 
                          : 'bg-gray-200 dark:bg-gray-700'
                      }
                      text-white font-semibold
                    `}>
                      {step > index + 1 ? <Check className="w-5 h-5" /> : index + 1}
                    </div>
                    {index < steps.length - 1 && (
                      <div className={`
                        w-24 md:w-32 h-1 mx-2
                        transition-all duration-300
                        ${step > index + 1 
                          ? 'bg-green-500 dark:bg-green-600' 
                          : 'bg-gray-200 dark:bg-gray-700'
                        }
                      `} />
                    )}
                  </div>
                  <span className={`
                    mt-2 text-sm font-medium
                    ${step === index + 1 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : 'text-gray-500 dark:text-gray-400'
                    }
                  `}>
                    {t(label)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            <div className="max-w-3xl mx-auto">
              {renderStep()}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-3xl mx-auto flex justify-between">
              {step > 1 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white transition-colors flex items-center gap-2"
                >
                  <ChevronLeft className="w-5 h-5" />
                  {t('previous')}
                </button>
              )}
              <div className={step > 1 ? 'ml-auto' : ''}>
                <button
                  onClick={handleNext}
                  disabled={submitting}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      {t('submitting')}
                    </>
                  ) : (
                    <>
                      {step === steps.length ? t('submitApplication') : t('continue')}
                      <ChevronRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeSubstitute; 