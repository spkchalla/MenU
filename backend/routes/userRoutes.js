import express from "express";
import { approveAdmin, login, register, updatePassword } from "../controller/userController.js";
import { protectAdmin, protectUser } from "../middleware/middleware.js";

const userRouter = express.Router();

userRouter.post('/registerUser', register);
userRouter.post('/login', login);
userRouter.post('/changePassword', protectUser, updatePassword);
userRouter.patch("/updateRole", protectUser, protectAdmin, approveAdmin);
export default userRouter;