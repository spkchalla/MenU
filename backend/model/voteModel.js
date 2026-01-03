import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    foodId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Menu",
        required: true,
    },
    voteType: {
        type: String,
        enum: ["like", "dislike"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
