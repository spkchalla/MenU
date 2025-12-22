import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        required: true,
        default: user,
    },
    isApproved: {
        type: Boolean,
        default: false,
    }
}, {timestamps: true});

const UserModel = mongoose.model("UserModel", userSchema);
export default UserModel;