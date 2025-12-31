import jwt from "jsonwebtoken"
import UserModel from "../model/userModel.js"

export const protectUser = async(req, res, next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "No token provided"});
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
       return res.status(401).json({message: "Unauthorized"}); 
    }
};

export const protectAdmin = async(req, res, next) =>{
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return res.status(401).json({message: "No token provided"});
    }
    const token = authHeader.split(" ")[1];

    try{
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== "admin"){
            return res.status(403).json({message: "Admin Access required"});
        }
        req.user = decoded;
        next();
    }catch(err){
        return res.status(403).json({messsage: "Invalid or expired token"});
    }
};