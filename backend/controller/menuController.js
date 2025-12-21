import { generateStructuredResponse } from "../services/geminiServices.js";
import { createWeeklyMenuUtil } from "../utils/createWeeklyMenu.js";

export const createWeeklyMenu = async(req, res) =>{
    try{
        const menuText = req.body;
        const structuredMenu = await generateStructuredResponse(menuText);
        await createWeeklyMenuUtil(structuredMenu);
        res.status(200).json({message: "Menu Created Successfully!"});

    }catch(err){
        res.status(500).json({error: err.message});
    }

};
export const getWeeklyMenu = async(req,res) =>{

};

export const updateWeeklyMenu = async(req, res) =>{

};

export const deleteWeeklyMenu = async(req, res) =>{

};