import Notification from "../model/notificationModel.js";
import UserNotification from "../model/userNotificationModel.js";

// Admin: Create Notification
export const createNotification = async (req, res) => {
    try {
        const { notificationType, title, message, isBanner, link } = req.body;
        const notification = await Notification.create({
            notificationType,
            title,
            message,
            isBanner,
            link
        });
        return res.status(201).json({ success: true, message: "Notification created successfully", notification });
    } catch (err) {
        return res.status(500).json({ message: "Error in creating notification", error: err.message });
    }
};

// Admin: Get All Notifications (with optional date filter)
export const getAllNotificationsAdmin = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        let query = {};
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }
        const notifications = await Notification.find(query).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, notifications });
    } catch (err) {
        return res.status(500).json({ message: "Error in fetching notifications", error: err.message });
    }
};

// User: Get Notifications for current user (with optional date filter)
export const getNotificationsForUser = async (req, res) => {
    try {
        const userId = req.user.id;
        const { startDate, endDate } = req.query;

        let query = {};
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate) query.createdAt.$gte = new Date(startDate);
            if (endDate) query.createdAt.$lte = new Date(endDate);
        }

        const notifications = await Notification.find(query).sort({ createdAt: -1 }).lean();

        // Fetch user-specific status
        const userStatuses = await UserNotification.find({ userId }).lean();
        const statusMap = userStatuses.reduce((acc, curr) => {
            acc[curr.notificationId.toString()] = curr;
            return acc;
        }, {});

        const result = notifications.map(n => ({
            ...n,
            isRead: statusMap[n._id.toString()]?.isRead || false,
            viewCount: statusMap[n._id.toString()]?.viewCount || 0
        }));

        return res.status(200).json({ success: true, notifications: result });
    } catch (err) {
        return res.status(500).json({ message: "Error in fetching notifications", error: err.message });
    }
};

// User: Get Latest Banner Notification
export const getLatestBanner = async (req, res) => {
    try {
        const userId = req.user.id;
        const latestBanner = await Notification.findOne({ isBanner: true }).sort({ createdAt: -1 }).lean();

        if (!latestBanner) return res.status(200).json({ success: true, banner: null });

        const userStatus = await UserNotification.findOne({ userId, notificationId: latestBanner._id });

        if (userStatus && userStatus.viewCount >= 2) {
            return res.status(200).json({ success: true, banner: null, hasUnread: !userStatus.isRead });
        }

        return res.status(200).json({
            success: true,
            banner: {
                ...latestBanner,
                viewCount: userStatus ? userStatus.viewCount : 0
            }
        });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching latest banner", error: err.message });
    }
};

// User: Update View Count (triggered when banner is seen)
export const updateViewCount = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.params;

        await UserNotification.findOneAndUpdate(
            { userId, notificationId },
            { $inc: { viewCount: 1 }, lastViewedAt: Date.now() },
            { upsert: true, new: true }
        );

        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ message: "Error updating view count", error: err.message });
    }
};

// User: Mark a specific notification as read
export const markAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const { notificationId } = req.params;

        await UserNotification.findOneAndUpdate(
            { userId, notificationId },
            { isRead: true },
            { upsert: true, new: true }
        );

        return res.status(200).json({ success: true, message: "Marked as read" });
    } catch (err) {
        return res.status(500).json({ message: "Error marking as read", error: err.message });
    }
};

// User: Mark all as read
export const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;
        const allNotifications = await Notification.find({}, "_id");

        const operations = allNotifications.map(n => ({
            updateOne: {
                filter: { userId, notificationId: n._id },
                update: { isRead: true },
                upsert: true
            }
        }));

        await UserNotification.bulkWrite(operations);

        return res.status(200).json({ success: true, message: "All marked as read" });
    } catch (err) {
        return res.status(500).json({ message: "Error marking all as read", error: err.message });
    }
};

// Admin: Update Notification
export const updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedNotification = await Notification.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({ success: true, updatedNotification });
    } catch (err) {
        return res.status(500).json({ message: "Error updating notification", error: err.message });
    }
};

// Admin: Delete Notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification.findByIdAndDelete(id);
        // Also cleanup user statuses
        await UserNotification.deleteMany({ notificationId: id });
        return res.status(200).json({ success: true, message: "Notification deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting notification", error: err.message });
    }
};

// User: Get Unread Status
export const getUnreadStatus = async (req, res) => {
    try {
        const userId = req.user.id;
        const allNotifications = await Notification.find({}, "_id");
        const readNotifications = await UserNotification.find({ userId, isRead: true }, "notificationId");

        const readIds = new Set(readNotifications.map(n => n.notificationId.toString()));
        const hasUnread = allNotifications.some(n => !readIds.has(n._id.toString()));

        return res.status(200).json({ success: true, hasUnread });
    } catch (err) {
        return res.status(500).json({ message: "Error fetching unread status", error: err.message });
    }
};