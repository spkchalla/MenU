export const getISTDate = ()=>{
    const now = new Date();
    return new Date(now.getTime() + 5.5 *60 *60* 1000);
};

/**
 * Formats a date to DD/MM/YYYY format
 * @param {Date|string} date - Date object or date string
 * @returns {string} Formatted date string in DD/MM/YYYY format
 */
export const formatDateToDDMMYYYY = (date) => {
    const dateObj = date instanceof Date ? date : new Date(date);

    const day = String(dateObj.getUTCDate()).padStart(2, '0');
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
    const year = dateObj.getUTCFullYear();

    return `${day}/${month}/${year}`;
};