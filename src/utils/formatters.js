/**
 * Format a date string to a more readable format
 * @param {string} dateString - Date string in format 'YYYY-MM-DD' or 'Month YYYY'
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  // Check if the date is already in 'Month YYYY' format
  if (/^[A-Za-z]+ \d{4}$/.test(dateString)) {
    return dateString;
  }
  
  // Parse the date string
  const date = new Date(dateString);
  
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return dateString;
  }
  
  // Format the date
  const options = { year: 'numeric', month: 'long' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Format a number with commas for thousands
 * @param {number} number - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (number) => {
  if (number === undefined || number === null) return '';
  
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Format a currency value
 * @param {number} value - Currency value
 * @param {string} currency - Currency code (default: 'USD')
 * @returns {string} Formatted currency value
 */
export const formatCurrency = (value, currency = 'USD') => {
  if (value === undefined || value === null) return '';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(value);
};

/**
 * Format a percentage value
 * @param {number} value - Percentage value (0-100)
 * @returns {string} Formatted percentage value
 */
export const formatPercentage = (value) => {
  if (value === undefined || value === null) return '';
  
  return `${value}%`;
};

/**
 * Truncate a string to a specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, length = 100) => {
  if (!text) return '';
  
  if (text.length <= length) {
    return text;
  }
  
  return `${text.substring(0, length)}...`;
};

/**
 * Format a phone number
 * @param {string} phoneNumber - Phone number to format
 * @returns {string} Formatted phone number
 */
export const formatPhoneNumber = (phoneNumber) => {
  if (!phoneNumber) return '';
  
  // Remove all non-numeric characters
  const cleaned = phoneNumber.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length === 10) {
    return `(${cleaned.substring(0, 3)}) ${cleaned.substring(3, 6)}-${cleaned.substring(6, 10)}`;
  } else if (cleaned.length === 11) {
    return `+${cleaned.substring(0, 1)} (${cleaned.substring(1, 4)}) ${cleaned.substring(4, 7)}-${cleaned.substring(7, 11)}`;
  }
  
  // Return original if we can't format it
  return phoneNumber;
};

/**
 * Format a name with proper capitalization
 * @param {string} name - Name to format
 * @returns {string} Formatted name
 */
export const formatName = (name) => {
  if (!name) return '';
  
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};

/**
 * Format a duration in months to years and months
 * @param {number} months - Duration in months
 * @returns {string} Formatted duration
 */
export const formatDuration = (months) => {
  if (!months) return '';
  
  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  
  if (years === 0) {
    return `${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  } else if (remainingMonths === 0) {
    return `${years} year${years !== 1 ? 's' : ''}`;
  } else {
    return `${years} year${years !== 1 ? 's' : ''} ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
  }
}; 