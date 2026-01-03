import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    foodId: {
        type: String,
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

// Indexes to optimize lookups by foodId and createdAt
voteSchema.index({ foodId: 1 });
voteSchema.index({ createdAt: 1 });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
