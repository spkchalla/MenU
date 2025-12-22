import WeeklyMenu from "../model/menuModel.js";

export const getWeeklyMenuByDate = async (date) => {
  const baseDate = new Date(date);
  if (isNaN(baseDate)) throw new Error("Invalid date");

  const dayIndex = baseDate.getUTCDay();
  const diff = dayIndex === 0 ? -6 : 1 - dayIndex;

  const weekStartDate = new Date(baseDate);
  weekStartDate.setUTCDate(baseDate.getUTCDate() + diff);
  weekStartDate.setUTCHours(0, 0, 0, 0);

  const weeklyMenu = await WeeklyMenu.findOne({ weekStartDate });
  if (!weeklyMenu) {
    throw new Error("Weekly menu not found");
  }

  return { weeklyMenu, baseDate };
};
