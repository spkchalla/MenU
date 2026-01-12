import mongoose from "mongoose";
import FoodRegister from "./foodRegisterModel.js";
import { toFoodId } from "../utils/generateFoodIdUtils.js";


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

weekMenuSchema.pre("save", async function () {
  if (!this.isModified("days")) return;

  const allFoodItems = [];

  for (const day of this.days) {
    allFoodItems.push(
      ...(day.breakfast?.items || []),
      ...(day.lunch?.items || []),
      ...(day.snacks?.items || []),
      ...(day.dinner?.items || [])
    );
  }

  const uniqueFoodItems = [
    ...new Set(
      allFoodItems
        .filter(item => typeof item === "string")
        .map(item => item.trim())
        .filter(Boolean)
    ),
  ];

  const bulkOperations = [];

  for (const foodName of uniqueFoodItems) {
    let foodId;
    try {
      foodId = toFoodId(foodName);
    } catch {
      continue;
    }

    bulkOperations.push({
      updateOne: {
        filter: { foodId },
        update: {
          $setOnInsert: {
            foodId,
            displayName: foodName.trim(),
          },
        },
        upsert: true,
      },
    });
  }

  if (bulkOperations.length > 0) {
    await FoodRegister.bulkWrite(bulkOperations, { ordered: false });
  }
});


const WeeklyMenu = mongoose.model('WeeklyMenu', weekMenuSchema);
export default WeeklyMenu;