import WeeklyMenu from "../model/menuModel.js";

export const deleteWeeklyMenuUtil = async (weekStartDate) => {
  try {
    const deletedMenu = await WeeklyMenu.findOneAndDelete({
      weekStartDate: new Date(weekStartDate),
    });
    
    if (!deletedMenu) {
      throw new Error("Menu not found");
    }
    
    return deletedMenu;
  } catch (err) {
    throw new Error("Error deleting weekly menu: " + err.message);
  }
};
