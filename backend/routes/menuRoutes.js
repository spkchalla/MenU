import express from "express";
import {createWeeklyMenu, updateWeeklyMenu, deleteWeeklyMenu, showTodayMenu, getSpecificMenu, currentMeal, otherMeals, specificDayMenu} from "../controller/menuController.js"

const menuRouter = express.Router();

menuRouter.post('/createMenu', express.text(), createWeeklyMenu);
menuRouter.get('/todayMenu', showTodayMenu);
menuRouter.get('/specificDay/:date', getSpecificMenu);
menuRouter.get('/currentMeal', currentMeal);
menuRouter.get('/otherMeals', otherMeals);
menuRouter.get('/dayOfPresentWeek/:day', specificDayMenu);
//menuRouter.get("/:weekStartDate", getWeeklyMenu);
menuRouter.put("/updateMenu/:weekStartDate", updateWeeklyMenu);
menuRouter.delete("/deleteMenu/:weekStartDate", deleteWeeklyMenu);

export default menuRouter;