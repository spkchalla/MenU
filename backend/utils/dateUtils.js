export const getISTDate = ()=>{
    const now = new Date();
    return new Date(now.getTime() + 5.5 *60 *60* 1000);
};

export const getISTDateString = () =>{
    const date = getISTDate();
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, "0");
    const day = String(date.getUTCDate()).padStart(2, "0");

    return `${year}-${month}-${day}`; // YYYY-MM-DD
}

export const getCurrentWeekStartDate = () => {
    const istDate = getISTDate();
    const dayOfWeek = istDate.getUTCDay(); // this is to get the day number of the day
    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // basically this is to mention monday as day1
    
    const weekStart = new Date(istDate);
    weekStart.setUTCDate(istDate.getUTCDate() - daysFromMonday);
    weekStart.setUTCHours(0, 0, 0, 0); // Set to start of day
    
    return weekStart;
};