import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
    foodId: {
        type: String,
        required: true,
        index: true,
    },
    voteType: {
        type: String,
        enum: ["like", "dislike"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    },
});

// Indexes to speed up queries and aggregations filtering by menuId and time
voteSchema.index({ foodId: 1, voteType: 1 });

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
