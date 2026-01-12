import Vote from "../../model/voteModel.js";
import mongoose from "mongoose";
import VoteIdentity from "../../model/voteIdentityModel.js";
import { getISTDateString } from "../dateUtils.js";


export const castVoteUtil = async({userId, foodId, menuId, voteType}) =>{

    if(!mongoose.Types.ObjectId.isValid(userId)) throw new Error("userId is invalid");

    if(typeof foodId !== 'string' || !foodId.trim()) throw new Error("Invalid food Id");

    if(!mongoose.Types.ObjectId.isValid(menuId)) throw new Error("menuId is invalid");

    if(!['like', 'dislike'].includes(voteType)) throw new Error("vote must be either 'like' or 'dislike' ");

    const identity = await VoteIdentity.findOne({userId});

    if(!identity) throw new Error("Voting Identity not found");

    const voteDate = getISTDateString();
    const votingId = identity.votingId;
    
    const existingVote = await Vote.findOne({votingId, foodId, menuId, voteDate});
    if(existingVote){
        if(existingVote.voteType === voteType){
            return existingVote; // this is already the same thing he voted previously
        }else{
            existingVote.voteType = voteType; // Here I am toggling the vote

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