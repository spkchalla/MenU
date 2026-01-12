import mongoose, { Types } from "mongoose";

const userPreferenceSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    allowPersonalization: {
        type: Boolean,
        default: false,
    },
});

userPreferenceSchema.index({userId: 1}, {unique: 1});

const UserPreference = mongoose.model("UserPreference", userPreferenceSchema);
export default UserPreference;