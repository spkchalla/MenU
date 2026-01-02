import WeeklyMenu from "../model/menuModel.js";
import { getWeeklyMenuByDate } from "../utils/getWeeklyMenuByDate.js";
import { getISTDate, formatDateToDDMMYYYY } from "./dateUtils.js";

// export const getWeeklyMenuByStartDate = async(weekStartDate)=>{
//     try{

//         const startDate = new Date(weekStartDate);
//         if (isNaN(startDate)) throw new Error("Invalid date format");

//         const menu = await WeeklyMenu.findOne({weekStartDate: startDate});
//         if(!menu){
//             throw new Error(`Weekly menu for the date ${startDate} not found`);
//         }
//         return menu;
//     }catch(err){
//         throw new Error("Error in fetching the menu: " + err.message);
//     }
// };

export const getTodayMenu = async () => {
  try {
    const todayDate = getISTDate();
    // figure out the start date of this date i.e., figure out the monday of this date's week
    const { weeklyMenu } = await getWeeklyMenuByDate(todayDate);

    const todayDayName = todayDate.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });

    // slice it to the day of today's date

    const todayMenu = weeklyMenu.days.find((d) => d.day === todayDayName);

    if (!todayMenu) {
      throw new Error("Today's menu not found");
    }
    // return it
    return {
      date: formatDateToDDMMYYYY(todayDate),
      ...todayMenu.toObject(),
    };
  } catch (err) {
    throw new Error("Error fetching today's menu: " + err.message);
  }
};

export const getMenuBySpecificDate = async (inputDate) => {
  try {
    const specificDate = new Date(inputDate);
    const { weeklyMenu } = await getWeeklyMenuByDate(specificDate);

    const specificDayName = specificDate.toLocaleDateString("en-US", {
      weekday: "long",
      timeZone: "UTC",
    });

    const specificDayMenu = weeklyMenu.days.find(
      (d) => d.day === specificDayName
    );

    if (!specificDayMenu) {
      throw new Error("Asked Day's menu not found");
    }
    // return it
    return {
      date: formatDateToDDMMYYYY(specificDate),
      ...specificDayMenu.toObject(),
    };
  } catch (err) {
    throw new Error(
      "Error in fetching the specific Day's menu: " + err.message
    );
  }
};

export const getCurrentMealByTime = async () => {
  try {
    const currentHour = getISTDate().getUTCHours(); // Read IST hour from UTC slot
    const currentMinutes = getISTDate().getUTCMinutes(); // Read IST minute from UTC slot
    const todayMenu = await getTodayMenu();
    // if time b/n 0:00 and 10:30 show breakfast
    if (currentHour < 10 || (currentHour === 10 && currentMinutes <= 30)) {
      return { ...todayMenu.breakfast, type: "Breakfast" };
    }
    // if time b/n 10:31 and 15:00 show lunch
    else if (currentHour < 15 || (currentHour === 15 && currentMinutes === 0)) {
      return { ...todayMenu.lunch, type: "Lunch" };
    }
    // if time b/n 15:01 and 18:30 show snacks
    else if (currentHour < 18 || (currentHour === 18 && currentMinutes <= 30)) {
      return { ...todayMenu.snacks, type: "Snacks" };
    }
    // else show dinner.
    else {
      return { ...todayMenu.dinner, type: "Dinner" };
    }
  } catch (err) {
    throw new Error("Error in fetching Current meal: " + err.message);
  }
};

export const getOtherMealsByTime = async () => {
  try {
    const currentHour = getISTDate().getUTCHours(); // Read IST hour from UTC slot
    const currentMinutes = getISTDate().getUTCMinutes(); // Read IST minute from UTC slot
    const todayMenu = await getTodayMenu();

    // Destructure to separate the current meal from the rest
    // We use the same time logic as getCurrentMealByTime

    let otherMeals;

    // Breakfast time
    if (currentHour < 10 || (currentHour === 10 && currentMinutes <= 30)) {
      const { breakfast, ...rest } = todayMenu;
      otherMeals = rest;
    }
    // Lunch time
    else if (currentHour < 15 || (currentHour === 15 && currentMinutes === 0)) {
      const { lunch, ...rest } = todayMenu;
      otherMeals = rest;
    }
    // Snacks time
    else if (currentHour < 18 || (currentHour === 18 && currentMinutes <= 30)) {
      const { snacks, ...rest } = todayMenu;
      otherMeals = rest;
    }
    // Dinner time
    else {
      const { dinner, ...rest } = todayMenu;
      otherMeals = rest;
    }

    return otherMeals;
  } catch (err) {
    throw new Error("Error in fetching Other meals: " + err.message);
  }
};

export const getspecificDayMenu = async (inputDay) => {
  try {
    const specificDay = inputDay;
    const todayDate = getISTDate();
    // figure out the start date of this date i.e., figure out the monday of this date's week
    const { weeklyMenu } = await getWeeklyMenuByDate(todayDate);
    const specificDayMeal = weeklyMenu.days.find((d) => d.day === specificDay);
    if(!specificDayMeal){
        throw new Error("Day not found in this week's menu");
    }
    return specificDayMeal;
  } catch (err) {
    throw new Error(
      `Failed to fetch the menu for the day ${inputDay} ` + err.message
    );
  }
};
