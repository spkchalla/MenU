import mongoose from "mongoose";

const foodRegisterSchema = new mongoose.Schema({
   
    foodId: {
        type: String,
        required: true,
        unique: true,
    },
    displayName: {
        type: String,
        required: true,
    },    
},{
    timestamps: true,
})

export default mongoose.model("FoodRegister", foodRegisterSchema);