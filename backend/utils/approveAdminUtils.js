import UserModel from "../model/userModel.js";

export const changeRole = async (email, newRole, approvalStatus) => {
    try {
        if (!email) throw new Error("Email is Required");
        if (!newRole) throw new Error("Role is required");
        if (typeof approvalStatus !== "boolean") throw new Error("Approval status must be boolean");

        const updatedUser = await UserModel.findOneAndUpdate(
            { email },
            { 
                role: newRole,       // update role field
                isApproved: approvalStatus // update isApproved field
            },
            { new: true }
        );

        if (!updatedUser) throw new Error("User not found");

        return updatedUser; // important for controller response
    } catch (err) {
        throw new Error("Error in changing role: " + err.message);
    }
};
