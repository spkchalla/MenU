import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    items:{
        type: [String],
        required: true,
    }

},{_id: false});

const daySchema = new mongoose.Schema({
    day:{
        type: String,
        enum: ["Monday", "Tuesday", "Wednesday","Thursday","Friday", "Saturday", "Sunday"],
        required: true,
    },
    breakfast:{
        type: mealSchema,
        required: true, 
    },
    lunch:{
        type: mealSchema,
        required: true, 
    },
    snacks:{
        type: mealSchema,
        required: true, 
    },
    dinner:{
        type: mealSchema,
        required: true, 
    }

},{_id: false});

const weekMenuSchema = new mongoose.Schema({

    weekStartDate:{
        type: Date,
        required: true,
        unique: true,
    },
    days:{
        type: [daySchema],
        required: true,
        validate: {
            validator: (value)=>{
                return value.length ===7;
            },
            message: 'A week must contain exactly 7 days'
            
        }
    }
});

const WeeklyMenu = mongoose.model('WeeklyMenu', weekMenuSchema);
export default WeeklyMenu;