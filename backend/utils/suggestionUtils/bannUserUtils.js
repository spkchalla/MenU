import mongoose from "mongoose";
// # The Fix: Use "Logical OR" for Export - Cannot overwrite `UserModel` model once compiled
export const UserModel = mongoose.models.UserModel || mongoose.model("UserModel", userSchema);

export const bannUserUtil = async (userId) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new Error("Invalid user id");
    }

    const user = await UserModel.findById(userId);

    if (!user) {
      throw new Error("User doesn't exists");
    }

    user.isBanned = !user.isBanned;

    await user.save();

    return user;
  } catch (err) {
    throw new Error(err.message);
  }
};
