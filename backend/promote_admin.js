import mongoose from 'mongoose';
import UserModel from './model/userModel.js';
import dotenv from 'dotenv';

dotenv.config();

const promoteUser = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const result = await UserModel.findOneAndUpdate(
      { email: 'testuser@example.com' },
      { role: 'admin', isApproved: true },
      { new: true }
    );

    if (result) {
      console.log(`Successfully promoted ${result.email} to ${result.role}`);
    } else {
      console.log('User not found.');
    }
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
  }
};

promoteUser();
