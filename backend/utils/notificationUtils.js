import notificationModel from "../model/notificationModel.js";

export const createNoti = async ({ notificationType, message }) => {
    const notification = await notificationModel.create({
        notificationType,
        message,
    });
    return notification;
};

export const getAllNoti = async () => {
    try {
        const notifications = await notificationModel.find();
        return notifications;
    } catch (err) {
        throw err;
    }

};

export const updateNotificationUtil = async (notificationId, updates) => {
    try {
        const updateFields = {};
        if (updates.notificationType) {
            updateFields.notificationType = updates.notificationType;
        }
        if (updates.message) {
            updateFields.message = updates.message;
        }

        if (Object.keys(updateFields).length === 0) {
            throw new Error("No valid fields to update");
        }

        const updatedNotification = await notificationModel.findByIdAndUpdate(
            notificationId,
            updateFields,
            { new: true, runValidators: true }
        );

        if (!updatedNotification) {
            throw new Error("Notification Not found");
        }

        return updatedNotification;
    } catch (err) {
        throw err;
    }
};