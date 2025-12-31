import UserModel from "../model/userModel.js";
import bcrypt from "bcrypt";

export const changePassword = async (email, newPassword) => {
    if(!email){
        throw new Error("Email is required");
    }
    if (!newPassword) {
        throw new Error("New password required");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await UserModel.findOneAndUpdate(
        { email },
        { password: hashedPassword },
        { new: true }
    );

    if (!updatedUser) {
        throw new Error("User not found");
    }

    return true;
};
