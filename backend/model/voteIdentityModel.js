import mongoose from "mongoose";

const voteIdentitySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    votingId: {
        type: String,
        required: true,
    },
},{timestamps: true});

voteIdentitySchema.index({userId: 1}, {unique: 1});
voteIdentitySchema.index({votingId: 1}, {unique: 1});

export default mongoose.model("VoteIdentity", voteIdentitySchema);