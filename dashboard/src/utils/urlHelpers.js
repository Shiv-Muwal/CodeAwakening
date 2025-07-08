/**
 * Utility functions for URL validation and cleaning
 */

/**
 * Validates if a string is a valid URL
 * @param {string} string - URL string to validate
 * @returns {boolean} - Returns true if valid URL or empty, false otherwise
 */
export const isValidURL = (string) => {
  if (!string || string.trim() === "") return true; // Empty URLs are allowed
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Cleans and validates URL values
 * @param {string} url - URL to clean
 * @returns {string|undefined} - Cleaned URL or undefined if empty/invalid
 */
export const cleanURL = (url) => {
  if (!url || url === "undefined" || url === "null" || url.trim() === "") {
    return undefined;
  }
  const cleanedUrl = url.trim();
  
  // Basic URL validation - add protocol if missing
  if (cleanedUrl && !cleanedUrl.startsWith('http://') && !cleanedUrl.startsWith('https://')) {
    return `https://${cleanedUrl}`;
  }
  return cleanedUrl;
};

/**
 * Cleans URL for display purposes (handles undefined string values)
 * @param {string} url - URL to clean for display
 * @returns {string|null} - Cleaned URL or null if invalid
 */
export const cleanURLForDisplay = (url) => {
  if (!url || url === "undefined" || url === "null") {
    return null;
  }
  return url;
};

/**
 * Validates multiple URL fields
 * @param {Array} urlFields - Array of {name, value} objects
 * @returns {Object} - {isValid: boolean, errorMessage: string}
 */
export const validateURLFields = (urlFields) => {
  for (const field of urlFields) {
    if (!isValidURL(field.value)) {
      return {
        isValid: false,
        errorMessage: `Please enter a valid ${field.name}`
      };
    }
  }
  return { isValid: true, errorMessage: null };
};