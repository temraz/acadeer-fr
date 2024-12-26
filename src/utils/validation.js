export const validateField = (name, value) => {
  const errors = [];

  switch (name) {
    case 'email':
      if (!value) {
        errors.push('Email is required');
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        errors.push('Invalid email format');
      }
      break;

    case 'phone':
      if (!value) {
        errors.push('Phone number is required');
      } else if (!/^\+?[\d\s-]{10,}$/.test(value)) {
        errors.push('Invalid phone number format');
      }
      break;

    case 'firstName':
    case 'lastName':
      if (!value) {
        errors.push(`${name === 'firstName' ? 'First' : 'Last'} name is required`);
      } else if (value.length < 2) {
        errors.push('Name must be at least 2 characters long');
      }
      break;

    case 'teachingLicense.number':
      if (!value) {
        errors.push('License number is required');
      }
      break;

    case 'documents':
      const requiredDocs = ['resume', 'teachingCertificate'];
      requiredDocs.forEach(doc => {
        if (!value[doc]) {
          errors.push(`${doc === 'resume' ? 'Resume/CV' : 'Teaching Certificate'} is required`);
        }
      });
      break;

    default:
      break;
  }

  return errors;
};

export const validateStep = (step, formData) => {
  const errors = {};

  switch (step) {
    case 1:
      // Personal Information
      ['firstName', 'lastName', 'email', 'phone'].forEach(field => {
        const fieldErrors = validateField(field, formData[field]);
        if (fieldErrors.length > 0) {
          errors[field] = fieldErrors;
        }
      });
      break;

    case 2:
      // Education & Certifications
      if (formData.education.length === 0) {
        errors.education = ['At least one education entry is required'];
      }
      
      const licenseErrors = validateField('teachingLicense.number', formData.teachingLicense.number);
      if (licenseErrors.length > 0) {
        errors.teachingLicense = licenseErrors;
      }
      break;

    case 3:
      // Teaching Preferences
      if (formData.subjects.length === 0) {
        errors.subjects = ['Please select at least one subject'];
      }
      if (!formData.availability.immediateStart && !formData.availability.startDate) {
        errors.availability = ['Please specify your availability'];
      }
      break;

    case 4:
      // Documents
      const documentErrors = validateField('documents', formData.documents);
      if (documentErrors.length > 0) {
        errors.documents = documentErrors;
      }
      break;

    default:
      break;
  }

  return errors;
}; 