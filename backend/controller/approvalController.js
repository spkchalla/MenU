import ApprovalModel from "../model/approvalModel.js";
import UserModel from "../model/userModel.js";

export const requestAdmin = async (req, res) => {
    try {
        const userId = req.user.userId;

        // Check if user already has a pending or approved request
        const existingRequest = await ApprovalModel.findOne({ user: userId, status: { $in: ["pending", "approved"] } });
        if (existingRequest) {
            return res.status(400).json({ message: "You already have a pending or approved request." });
        }

        const newRequest = await ApprovalModel.create({
            user: userId,
            status: "pending"
        });

        res.status(201).json({ message: "Admin request submitted successfully", request: newRequest });
    } catch (err) {
        res.status(500).json({ message: "Error submitting request", error: err.message });
    }
};

export const getAllApprovals = async (req, res) => {
    try {
        const approvals = await ApprovalModel.find({ status: "pending" }).populate("user", "name email");
        res.status(200).json(approvals);
    } catch (err) {
        res.status(500).json({ message: "Error fetching approvals", error: err.message });
    }
};

export const handleApproval = async (req, res) => {
    try {
        const { approvalId, action } = req.body; // action: 'approve' or 'reject'

        const approval = await ApprovalModel.findById(approvalId);
        if (!approval) {
            return res.status(404).json({ message: "Approval request not found" });
        }

        if (action === "approve") {
            approval.status = "approved";
            await approval.save();

            // Update user role and isApproved
            await UserModel.findByIdAndUpdate(approval.user, {
                role: "admin",
                isApproved: true
            });

            res.status(200).json({ message: "Request approved and user promoted to admin" });
        } else if (action === "reject") {
            approval.status = "rejected";
            await approval.save();
            res.status(200).json({ message: "Request rejected" });
        } else {
            res.status(400).json({ message: "Invalid action" });
        }
    } catch (err) {
        res.status(500).json({ message: "Error handling approval", error: err.message });
    }
};

export const getMyRequestStatus = async (req, res) => {
    try {
        const userId = req.user.userId;
        const request = await ApprovalModel.findOne({ user: userId }).sort({ createdAt: -1 });
        res.status(200).json(request);
    } catch (err) {
        res.status(500).json({ message: "Error fetching request status", error: err.message });
    }
};
