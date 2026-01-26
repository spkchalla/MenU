import express from "express";
import {protectAdmin, protectUser} from "../middleware/middleware.js";
import {createNotification, getAllNotifications, updateNotification} from "../controller/notificationController.js";

const notificationRouter = express.Router();

notificationRouter.post('/createNotification', protectAdmin, createNotification);
notificationRouter.get('/getAllNotifications', protectUser, getAllNotifications);
notificationRouter.patch('/updateNotification/:id', protectAdmin, updateNotification);

export default notificationRouter;