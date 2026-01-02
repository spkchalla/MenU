// Date utility functions for consistent date formatting across the application

/**
 * Formats a date to DD/MM/YYYY format
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string in DD/MM/YYYY format
 */
export const formatDateToDDMMYYYY = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);

  const day = String(dateObj.getDate()).padStart(2, '0');
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const year = dateObj.getFullYear();

  return `${day}/${month}/${year}`;
};

/**
 * Formats a date to YYYY-MM-DD format (for input type="date" value)
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string in YYYY-MM-DD format
 */
export const formatDateToYYYYMMDD = (date) => {
  const dateObj = date instanceof Date ? date : new Date(date);
  return dateObj.toISOString().split('T')[0];
};
