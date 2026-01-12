import UserModel from "../model/userModel.js";
import {userPreference} from "../model/userPreferenceModel.js";
import { changeRole } from "../utils/approveAdminUtils.js";
import { authenticateUser, createUserAccount } from "../utils/authenticationUtils.js";
import { changePassword } from "../utils/changePasswordUtils.js";
import { changeUserPreference } from "../utils/changeUserPreferenceUtils.js";

export const register = async(req, res) =>{

    try{
        const registerData = req.body;
        await createUserAccount(registerData);

        res.status(201).json({message: "User Created Successfully"});
    }catch(err){
        res.status(500).json({message: "Server Error", error: err.message});
    }
};
export const login = async(req, res) =>{
    try{
       const loginData = req.body;
       const {user, token} = await authenticateUser(loginData);
       
       res.status(200).json({message: "Login Successful", token});
    }catch(err){
        res.status(401).json({message: err.message});
    }
};

export const approveAdmin = async(req, res) =>{
    try{
        const {email, newRole, approvalStatus} = req.body;
    if (!email) throw new Error("Email is missing");
    if(!newRole) throw new Error("newRole is missing");
    if(!approvalStatus) throw new Error("approvalStatus is missing");
    
    const updatedUser = await changeRole(email, newRole, approvalStatus);

        res.status(200).json({
            message: "Successfully changed role and updated the status",
            user: {
                email: updatedUser.email,
                role: updatedUser.role,
                isApproved: updatedUser.isApproved
            }
        });
    }catch(err){
        res.status(500).json({message: "Error in updating role "+ err.message});
    }
};

export const updatePassword = async(req, res) =>{

    try{
        const {email, updatedPassword} = req.body;
        const newPassword = await changePassword(email, updatedPassword);

        res.status(200).json({message: "Successfully updated your password",
            newPassword,
        });
    }catch(err){
        console.log(err);
        res.status(500).json({message: "Error in updating your Password"});
    }

};

export const updateUserPreference = async(req, res) =>{

    try{
        const userId = req.user.id;
        const {allowPersonalization} = req.body;
        const newPref = await changeUserPreference(userId, allowPersonalization);
        res.status(200).json({message: `Updated the user preference for personalization to ${newPref}`});
    }catch(err){
        res.status(400).json({message: err.message});
    }

};