import express from "express";
import { approveAdmin, login, register, updatePassword } from "../controller/userController.js";
import { requestAdmin, getAllApprovals, handleApproval, getMyRequestStatus } from "../controller/approvalController.js";
import { protectAdmin, protectUser } from "../middleware/middleware.js";

const userRouter = express.Router();

userRouter.post('/registerUser', register);
userRouter.post('/login', login);
userRouter.post('/changePassword', protectUser, updatePassword);
userRouter.patch("/updateRole", protectUser, protectAdmin, approveAdmin);

// New Approval Routes
userRouter.post('/request-admin', protectUser, requestAdmin);
userRouter.get('/approvals', protectAdmin, getAllApprovals);
userRouter.post('/handle-approval', protectAdmin, handleApproval);
userRouter.get('/my-approval-status', protectUser, getMyRequestStatus);

export default userRouter;