/**
 * Validate an email address
 * @param {string} email - Email address to validate
 * @returns {boolean} Whether the email is valid
 */
export const isValidEmail = (email) => {
  if (!email) return false;
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate a phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} Whether the phone number is valid
 */
export const isValidPhone = (phone) => {
  if (!phone) return false;
  
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  
  // Check if the cleaned phone number has a valid length
  return cleaned.length >= 10 && cleaned.length <= 15;
};

/**
 * Validate a URL
 * @param {string} url - URL to validate
 * @returns {boolean} Whether the URL is valid
 */
export const isValidUrl = (url) => {
  if (!url) return false;
  
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validate a date string
 * @param {string} dateString - Date string to validate
 * @returns {boolean} Whether the date string is valid
 */
export const isValidDate = (dateString) => {
  if (!dateString) return false;
  
  // Check if the date is in 'Month YYYY' format
  if (/^[A-Za-z]+ \d{4}$/.test(dateString)) {
    return true;
  }
  
  // Parse the date string
  const date = new Date(dateString);
  
  // Check if the date is valid
  return !isNaN(date.getTime());
};

/**
 * Validate a percentage value
 * @param {number} value - Percentage value to validate
 * @returns {boolean} Whether the percentage value is valid
 */
export const isValidPercentage = (value) => {
  if (value === undefined || value === null) return false;
  
  return value >= 0 && value <= 100;
};

/**
 * Validate required fields in an object
 * @param {Object} data - Data object to validate
 * @param {Array} requiredFields - Array of required field names
 * @returns {Object} Validation result with isValid and errors properties
 */
export const validateRequiredFields = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach((field) => {
    if (!data[field]) {
      errors[field] = 'This field is required';
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate a skill proficiency value
 * @param {number} proficiency - Proficiency value to validate
 * @returns {boolean} Whether the proficiency value is valid
 */
export const isValidProficiency = (proficiency) => {
  if (proficiency === undefined || proficiency === null) return false;
  
  return proficiency >= 0 && proficiency <= 100;
};

/**
 * Validate a year value
 * @param {number|string} year - Year value to validate
 * @returns {boolean} Whether the year value is valid
 */
export const isValidYear = (year) => {
  if (!year) return false;
  
  const yearNumber = parseInt(year, 10);
  const currentYear = new Date().getFullYear();
  
  return !isNaN(yearNumber) && yearNumber >= 1900 && yearNumber <= currentYear + 10;
}; 