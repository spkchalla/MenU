import mongoose from "mongoose";

const approvalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    requestDate: {
        type: Date,
        default: Date.now,
    }
}, {timestamps: true});

const ApprovalModel = mongoose.model("ApprovalModel", approvalSchema);
export default ApprovalModel;
