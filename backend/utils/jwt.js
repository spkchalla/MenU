import jwt from "jsonwebtoken";

export const generateJWT = (payload) =>{
    return jwt.sign(
        payload,
        process.env.JWT_SECRET,
        {expiresIn: process.env.JWT_EXPIRES_IN || "7d"}
    );
};