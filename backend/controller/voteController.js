import { castVoteUtil } from "../utils/votingUtils/castVoteUtils.js";
import { getTodayUserVotesUtil } from "../utils/votingUtils/getUserVotesUtils.js";

export const castVote = async(req, res) =>{

    try{
        const userId = req.user.userId; // do not trust the userId from frontend, get from backend
        const {foodName, voteType} = req.body;
  
        const vote = await castVoteUtil({userId, foodName, voteType});
const message = vote.voteType === null ? "Vote removed successfully" : "Vote cast successfully";
res.status(200).json({success: true, data: vote, message});
    }catch(err){
        res.status(400).json({success: false, message: "Error in casting vote: " + err.message});
    }
}

export const getUserTodayVotes = async (req, res) => {
    try {
        const userId = req.user.userId;
        const votes = await getTodayUserVotesUtil(userId);
        res.status(200).json({ success: true, votes });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
}