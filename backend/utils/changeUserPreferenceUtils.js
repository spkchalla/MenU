import userPreferenceModel from "../model/userPreferenceModel.js";

export const changeUserPreference = async(userId, newUserPreference) =>{
    try{
        if(!userId) throw new Error("user id is required");

        if(typeof newPreference !== "boolean") throw new Error("newPreference should be boolean");

    const updatedPreference = await userPreferenceModel.findOneAndUpdate(
        {userId},
        {newUserPreference},
        {new: true, }
    );

    return updatedPreference;
    
    }catch(err){
        throw new Error("Error in updatng User Preference" + err.message);
    }
};