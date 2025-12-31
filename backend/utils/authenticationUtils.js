import UserModel from "../model/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const createUserAccount = async(registrationData) =>{

    try{
        const{name, email, password} = registrationData;
    if(!name|| !email|| !password) throw new Error("All input fields are required");

    const existingUser = await UserModel.findOne({email});
    if(existingUser){
        throw new Error("User with this email Id already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({
        name,
        email,
        password: hashedPassword,

    });
    await newUser.save();

    }catch(err){
        throw new Error("Error registering User:" + err.message);
    }
};

export const authenticateUser = async(loginInput) =>{ 

    try{
        const {email, password} = loginInput;

    const user = await UserModel.findOne({email: email.toLowerCase().trim()});
    if(!user) throw new Error("Invalid email");

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) throw new Error("Invalid Password");

    const token = jwt.sign(
        {
            userId : user._id,
            role: user.role,
            email : user.email,
            isApproved: user.isApproved,

        },
        process.env.JWT_SECRET,{expiresIn: '7d'}
    );

    return {
        user,
        token,
    };
    }catch(err){
        throw new Error("Error fetching User");
    }

};
