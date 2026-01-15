import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
        foodId: {
            type: String,
            required: true,
            index: true,
        },
        menuId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "WeeklyMenu",
            required: true,
            index: true,
        },
        votingId: {
            type: String,
            required: true,
            index: true,
        },
        voteType: {
            type: String,
            enum: ["like", "dislike"],
            required: true,
        },
        voteDate: {
            type: String, // YYYY-MM-DD
            required: true,
            index: true,
        },
}, {timestamps: true});


// Need to write this to maintain a collective uniqueness on the collection,
// rather only on voteId
voteSchema.index(
    {foodId: 1, menuId: 1, votingId: 1, voteDate: 1},
    {unique: true},
);

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;