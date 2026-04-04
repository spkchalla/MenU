import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    notificationType: {
        type: String,
        enum: ["update", "new_feature", "important"],
        required: true,
    },
    title: {
        type: String,
        trim: true,
    },
    message: {
        type: String,
        required: true,
        trim: true,
    },
    isBanner: {
        type: Boolean,
        default: false,
    },
    link: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true,
    }
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;