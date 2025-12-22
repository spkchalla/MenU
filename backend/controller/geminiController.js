import { generateStructuredResponse } from "../services/geminiServices.js";

export const generateJsonFromText = async(req, res, next) =>{
    try{
            
    //call the function from the services/geminiServices.js
        const text = req.body;
        const result =  await generateStructuredResponse(text);
        res.status(200).json(result); 

    }catch(err){
        res.status(500).json({error: err.message});
    }
}