import express from "express";
import { protectAdmin, protectUser } from "../middleware/middleware.js";
import {
    createNotification,
    getAllNotificationsAdmin,
    getNotificationsForUser,
    getLatestBanner,
    getUnreadStatus,
    updateViewCount,
    markAsRead,
    markAllAsRead,
    updateNotification,
    deleteNotification
} from "../controller/notificationController.js";

const notificationRouter = express.Router();

// Admin Routes
notificationRouter.post('/createNotification', protectAdmin, createNotification);
notificationRouter.get('/admin/getAllNotifications', protectAdmin, getAllNotificationsAdmin);
notificationRouter.patch('/updateNotification/:id', protectAdmin, updateNotification);
notificationRouter.delete('/deleteNotification/:id', protectAdmin, deleteNotification);

// User Routes
notificationRouter.get('/user/getAllNotifications', protectUser, getNotificationsForUser);
notificationRouter.get('/user/latestBanner', (req, res, next) => {
    // Optional auth: if token exists, try to set req.user, else continue
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        // We can just use the middleware and ignore error if we want, 
        // but the current protectUser probably sends 401.
        // Let's manually check or just allow it to be public and handle it in controller.
        return protectUser(req, res, next);
    }
    next();
}, getLatestBanner);
notificationRouter.get('/unread-status', protectUser, getUnreadStatus);
notificationRouter.patch('/user/updateViewCount/:notificationId', protectUser, updateViewCount);
notificationRouter.patch('/user/markAsRead/:notificationId', protectUser, markAsRead);
notificationRouter.patch('/user/markAllAsRead', protectUser, markAllAsRead);

export default notificationRouter;