import UserModel from "../model/userModel.js";

export const findOrCreateGoogleUser = async({
    googleId,
    email,
    name,
}) =>{
    let user = await UserModel.findOne({googleId});

    if(user) {
        return user;
    }

    user = await UserModel.create({
        name,
        email,
        googleId,
        authProvider: "google",
        role: "user",
        isApproved: false,
    });

    return user;
};