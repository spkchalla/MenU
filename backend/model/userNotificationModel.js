import mongoose from "mongoose";

const userNotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    notificationId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
        required: true,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    lastViewedAt: {
        type: Date,
        default: Date.now,
    }
}, { timestamps: true });

// Ensure a user has only one record per notification
userNotificationSchema.index({ userId: 1, notificationId: 1 }, { unique: true });

const UserNotification = mongoose.model("UserNotification", userNotificationSchema);
export default UserNotification;
