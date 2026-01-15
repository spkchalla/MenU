import Vote from "../../model/voteModel.js";
import VoteIdentity from "../../model/voteIdentityModel.js";
import { getISTDateString } from "../dateUtils.js";

export const getTodayUserVotesUtil = async (userId) => {
    const identity = await VoteIdentity.findOne({ userId });
    if (!identity) return [];

    const voteDate = getISTDateString();
    const votes = await Vote.find({ 
        votingId: identity.votingId, 
        voteDate 
    });

    return votes;
};
