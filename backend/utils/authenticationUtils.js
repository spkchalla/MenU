import UserModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { generateVotingId } from "./votingUtils/generateVotingIdUtils.js";
import voteIdentityModel from "../model/voteIdentityModel.js";
import userPreferenceModel from "../model/userPreferenceModel.js";

export const createUserAccount = async (registrationData) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { name, email, password } = registrationData;
    if (!name || !email || !password) throw new Error("All input fields are required");

    const normalizedEmail = email.toLowerCase().trim();
    const existingUser = await UserModel.findOne({ email: normalizedEmail });
    if (existingUser) {
      throw new Error("User with this email Id already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
      name,
      email: normalizedEmail,
      password: hashedPassword,
    });
    await newUser.save({ session });

    const votingId = await generateVotingId();

    await voteIdentityModel.create(
      [
        {
          userId: newUser._id,
          votingId,
        },
      ],
      { session },
    );

    await userPreferenceModel.create(
      [
        {
          userId: newUser._id,
          allowPersonalization: false,
        },
      ],
      { session },
    );

    await session.commitTransaction();
    return newUser;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    session.endSession();
  }
};

export const authenticateUser = async (loginInput) => {
  try {
    const { email, password } = loginInput;

    const user = await UserModel.findOne({ email: email.toLowerCase().trim() });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
        isApproved: user.isApproved,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    return {
      user,
      token,
    };
  } catch (err) {
    throw err;
  }
};
