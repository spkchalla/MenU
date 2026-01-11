import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
    {
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WeeklyMenu",
            required: true,
        },
        voteType: {
            type: String,
            enum: ["like", "dislike"],
            required: true,
        },
    },
    { timestamps: true }
);

// Indexes to speed up queries and aggregations filtering by menuId and time
voteSchema.index({ menuId: 1 });
voteSchema.index({ createdAt: 1 });
voteSchema.index({ menuId: 1, createdAt: 1 });

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
