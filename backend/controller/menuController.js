import WeeklyMenu from "../model/menuModel.js";
import { generateStructuredResponse } from "../services/geminiServices.js";
import { createWeeklyMenuUtil } from "../utils/createWeeklyMenu.js";
import {
  getCurrentMealByTime,
  getMenuBySpecificDate,
  getOtherMealsByTime,
  getspecificDayMenu,
  getTodayMenu,
} from "../utils/getMenu.js";
import { getWeeklyMenuByDate } from "../utils/getWeeklyMenuByDate.js";

export const createWeeklyMenu = async (req, res) => {
  try {
    const menuText = req.body;
    const structuredMenu = await generateStructuredResponse(menuText);
    await createWeeklyMenuUtil(structuredMenu);
    res.status(200).json({ message: "Menu Created Successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const showTodayMenu = async (req, res) => {
  try {
    const todayMenu = await getTodayMenu();
    res.status(200).json({
      message: "Successfully fetched today's menu",
      menu: todayMenu,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to get the menu, Server error" });
  }
};
export const getSpecificMenu = async (req, res) => {
  try {
    const inputDate = req.params.date;
    if (!inputDate) {
      return res.status(400).json({ message: "Date parameter is required" });
    }
    const specificDayMenu = await getMenuBySpecificDate(inputDate);
    res
      .status(200)
      .json({
        message: `Successfully fetched Menu of ${inputDate}`,
        menu: specificDayMenu,
      });
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ message: "Menu not found for this date" });
    }
    res.status(500).json({ message: "Failed to fetch menu, Server Error" });
  }
};

export const getWeeklyMenu = async (req, res) => {
  try {
    const { date } = req.params;
    const { weeklyMenu } = await getWeeklyMenuByDate(date);
    res.status(200).json({
      message: "Successfully fetched weekly menu",
      weeklyMenu,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch weekly menu: " + err.message });
  }
};

export const currentMeal = async (req, res) => {
  try {
    const meal = await getCurrentMealByTime();

    res.status(200).json({
      message: "Successfully fetched current meal",
      meal,
    });
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ message: "Current meal not found" });
    }
    res.status(500).json({
      message: "Couldn't fetch current meal: Server error",
      error: err.message,
    });
  }
};

export const otherMeals = async (req, res) => {
  try {
    const otherMeal = await getOtherMealsByTime();

    res.status(200).json({
      message: "Successfully fetched other meals",
      otherMeal,
    });
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ message: "Other meals not found" });
    }
    res.status(500).json({
      message: "Couldn't fetch other meals: Server error",
      error: err.message,
    });
  }
};

export const specificDayMenu = async (req, res) => {
  try {
    const inputDay =
      req.params.day.charAt(0).toUpperCase() +
      req.params.day.slice(1).toLowerCase();
    if (!inputDay) {
      throw new Error("Day is required: ");
    }
    const mealOfThisDay = await getspecificDayMenu(inputDay);

    res.status(200).json({
      message: `Successfully fetched ${inputDay} Menu`,
      mealOfThisDay,
    });
  } catch (err) {
    if (err.message.includes("not found")) {
      return res.status(404).json({ message: "Menu not found for this day" });
    }
    res.status(500).json({
      message: "Failed to fetch the menu :" + err.message,
    });
  }
};

export const updateWeeklyMenu = async (req, res) => {
  try {
    const { weekStartDate } = req.params;
    const eniterNewMenu = req.body;

    const updatedMenu = await WeeklyMenu.findOneAndUpdate(
      { weekStartDate: weekStartDate },
      eniterNewMenu,
      { new: true }
    );
    if (!updatedMenu) throw new Error("Menu not found");
    res.status(200).json({ message: "Menu updated Successfully.", menu: updatedMenu });
  } catch (err) {
    res.status(500).json({ message: "Failed to update the Menu" + err.message });
  }
};

export const getAllMenus = async (req, res) => {
  try {
    const menus = await WeeklyMenu.find().sort({ weekStartDate: -1 });
    res.status(200).json({
      message: "Successfully fetched all menus",
      menus,
    });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch menus: " + err.message });
  }
};

export const deleteWeeklyMenu = async (req, res) => {
  try {
    const { weekStartDate } = req.params;

    const deleteMenu = await WeeklyMenu.findOneAndDelete({
      weekStartDate: weekStartDate,
    });
    if (!deleteMenu) throw new Error("Menu not found to delete");
    res.status(200).json({ message: "Menu deletd Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete Menu" + err.message });
  }
};
