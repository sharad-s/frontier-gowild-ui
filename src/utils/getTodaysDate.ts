// utils/getTodaysDate.js
export const getTodaysDate = () => {
    const dateObj = new Date();
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${month}-${day}-${year}`;
  };
  