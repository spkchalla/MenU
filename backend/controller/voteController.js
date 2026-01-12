import { castVoteUtil } from "../utils/votingUtils/castVoteUtils.js";

export const castVote = async(req, res) =>{

    try{
        const userId = req.user.id; // do not trust the userId from frontend, get from backend
        const {foodId, menuId, voteType} = req.body;
  
        const vote = await castVoteUtil({userId, foodId, menuId, voteType});

        res.status(200).json({success: true, data: vote, message: "Vote cast Successfully"});
    }catch(err){
        res.status(400).json({success: false, message: "Error in casting vote: " + err.message});
    }
}