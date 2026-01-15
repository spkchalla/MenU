import crypto from "crypto";

export const generateVotingId = async()=>{
    return crypto.randomBytes(32).toString("hex");
}