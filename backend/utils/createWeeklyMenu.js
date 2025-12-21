import WeeklyMenu from "../model/menuModel.js";

export const createWeeklyMenuUtil = async (menuData) => {
  try {
    const { weekStartDate, days } = menuData;
    if (!weekStartDate || !days || days.length !== 7) {
      throw new Error("Invalid input: date and exactly 7 days are required");
    }

    // --- normalize day names BEFORE creating the Mongoose object ---
    const normalizeDay = (day) => {
      const map = {
        MONDAY: "Monday",
        TUESDAY: "Tuesday",
        WEDNESDAY: "Wednesday",
        THURSDAY: "Thursday",
        FRIDAY: "Friday",
        SATURDAY: "Saturday",
        SUNDAY: "Sunday",
      };
      return map[day?.toUpperCase()] || day;
    };

    // normalize the days first
    const normalizedDays = days.map((d) => ({
      ...d,
      day: normalizeDay(d.day),
    }));

    const menu = WeeklyMenu({
      weekStartDate: new Date(weekStartDate),
      days: normalizedDays,
    });

    const savedMenu = await menu.save();

    return savedMenu.toObject();
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("Menu for this week already exists");
    }
    throw new Error("Error creating weekly menu: " + err.message);
  }
};
