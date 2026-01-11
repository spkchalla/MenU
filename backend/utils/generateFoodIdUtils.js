import camelCase from "lodash/camelCase.js"

export const toFoodId = (foodName)=>{
    if(!foodName || typeof foodName !== "string") throw new Error("Invalid food name");

    let normalized = foodName
        .toLocaleLowerCase()
        .trim();

    // A regular expression to replace some special charecters
    normalized = normalized.replace(/[,&/()]/g, " ");

    // regular expression for alpha numeric omission
    normalized = normalized.replace(/[^a-z0-9\s]/g, "")

    const foodId = camelCase(normalized);

    if(!foodId) throw new Error("Could not normalize  this food name");

    return foodId;
}