import mongoose from "mongoose";

const voteSchema = new mongoose.Schema(
    {
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Menu",
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

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
