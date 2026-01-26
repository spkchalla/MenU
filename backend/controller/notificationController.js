import { createNoti, getAllNoti, updateNotificationUtil } from "../utils/notificationUtils.js";

export const createNotification = async (req, res) => {
    try {
        const { notificationType, message } = req.body;

        await createNoti({ notificationType, message });

        return res.status(201).json({ success: true, message: "Notification created Successfully" });

    } catch (err) {
        return res.status(500).json({ message: "Error in creating notification", error: err.message });
    }

};

export const getAllNotifications = async (req, res) => {
    try {
        const allNotifications = await getAllNoti();
        return res.status(200).json({
            success: true,
            message: "Successfully fetched all notifications",
            allNotifications,
        })
    } catch (err) {
        return res.status(500).json({ message: "Error in fetching all Notifications", error: err.message });
    }
};

export const updateNotification = async (req, res) => {

    try {
        const { id } = req.params;
        const notificationId = id;
        const updates = req.body;

        const updatedNotification = await updateNotificationUtil(
            notificationId,
            updates
        );

        return res.status(200).json({
            success: true,
            updatedNotification,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Error in updating Notification",
            error: err.message,
        });
    }
};