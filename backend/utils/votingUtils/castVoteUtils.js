import Vote from "../../model/voteModel.js";
import mongoose from "mongoose";
import VoteIdentity from "../../model/voteIdentityModel.js";
import WeeklyMenu from "../../model/menuModel.js";
import { getISTDate, getISTDateString } from "../dateUtils.js";
import { toFoodId } from "../generateFoodIdUtils.js";
import { getTodayMenu } from "../getMenu.js";


export const castVoteUtil = async({userId, foodName, voteType}) =>{

    if(!mongoose.Types.ObjectId.isValid(userId)) throw new Error("userId is invalid");

    if(typeof foodName !== 'string') throw new Error("Invalid food name");

    const menuId = (await getTodayMenu()).menuId;       

    if(!mongoose.Types.ObjectId.isValid(menuId)) throw new Error("menuId is invalid");

    if(!['like', 'dislike'].includes(voteType)) throw new Error("vote must be either 'like' or 'dislike' ");

    const foodId = toFoodId(foodName);

    let identity = await VoteIdentity.findOne({userId});

    if(!identity) {
        const { generateVotingId } = await import("./generateVotingIdUtils.js");
        const votingId = await generateVotingId();
        identity = await VoteIdentity.create({
            userId,
            votingId,
        });
    }

    // Rigorous Check: Does the menu exist?
    const menu = await WeeklyMenu.findById(menuId);
    if(!menu) throw new Error("Target menu not found in database");

    const todayIST = getISTDate();
    const voteDate = getISTDateString();
    
    // Rigorous Check: Is the foodId served today in this menu?
    const dayName = todayIST.toLocaleDateString("en-US", {
        weekday: "long",
        timeZone: "UTC",
    });

    const dayData = menu.days.find(d => d.day === dayName);
    if(!dayData) throw new Error(`Today (${dayName}) is not registered in this menu`);

    const allItemsToday = [
        ...(dayData.breakfast?.items || []),
        ...(dayData.lunch?.items || []),
        ...(dayData.snacks?.items || []),
        ...(dayData.dinner?.items || []),
    ].map(item => toFoodId(item));

    if(!allItemsToday.includes(foodId)) {
        throw new Error(`Food '${foodId}' is not found in today's menu (${dayName})`);
    }

    const votingId = identity.votingId;
    
   const existingVote = await Vote.findOne({votingId, foodId, menuId, voteDate});
if(existingVote){
    if(existingVote.voteType === voteType){
        
        await Vote.deleteOne({_id: existingVote._id});
        return { voteType: null, message: "Vote removed" };
    }else{
        
        existingVote.voteType = voteType;
        await existingVote.save();
        return existingVote;
    }
}
    const vote = await Vote.create({
        votingId,
        foodId,
        menuId,
        voteType,
        voteDate,
    });
    return vote;

}