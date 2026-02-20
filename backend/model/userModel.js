import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true,
    },
    authProvider:{
        type: String,
        enum: ["local", "google"],
        required: true,
        default: "local",
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        required: true,
        default: "user",
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isBanned:{
        type: Boolean,
        default: false
    }
}, {timestamps: true});

const UserModel = mongoose.model("UserModel", userSchema);
export default UserModel;