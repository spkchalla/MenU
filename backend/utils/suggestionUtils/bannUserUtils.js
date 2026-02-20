import mongoose from "mongoose";
import UserModel from "../../model/userModel.js";

export const bannUserUtil = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const error = new Error("Invalid user id");
      error.statusCode = 400;
      throw error;
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      const error = new Error("User doesn't exists");
      error.statusCode = 404;
      throw error;
    }

    user.isBanned = !user.isBanned;

    await user.save();

    return user;
  } catch (err) {
    const error = new Error(err.message);
    error.statusCode = err.statusCode || 500;
    throw error;
  }
};
