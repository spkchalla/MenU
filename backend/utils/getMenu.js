import WeeklyMenu from "../model/menuModel.js";

export const getWeeklyMenu = async(weekStartDate)=>{
    try{

        const startDate = new Date(weekStartDate);
        if (isNaN(startDate)) throw new Error("Invalid date format");

        const menu = await WeeklyMenu.findOne({weekStartDate: startDate});
        if(!menu){
            throw new Error(`Weekly menu for the date ${startDate} not found`);
        }
        return menu;
    }catch(err){
        throw new Error("Error in fetching the menu: " + err.message);
    }
};