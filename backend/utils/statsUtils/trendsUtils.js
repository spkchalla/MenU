import { getISTDateString, getCurrentWeekStartDate } from "../dateUtils.js";
import Vote from "../../model/voteModel.js";
import WeeklyMenu from "../../model/menuModel.js";


export const mostParticipatedFoods = async () => {
    try {
         const menuId = await WeeklyMenu.findOne({ startDate: { $lte: getISTDateString() }, endDate: { $gte: getISTDateString() } }, { _id: 1 });
        const stats = await Vote.aggregate([
            {
                $match: { menuId: menuId._id },
                $match: { voteDate },
            },

            // group by food Id
            {
                $group: {
                    _id: "$foodId",

                    likes: {
                        $sum: {
                            $cond: [{ $eq: ["$voteType", "like"] }, 1, 0],
                        },
                    },

                    dislikes: {
                        $sum: {
                            $cond: [{ $eq: ["$voteType", "dislike"] }, 1, 0],
                        },
                    },

                    totalVotes: { $sum: 1 },
                },
            },

            // sort by participation

            {
                $sort: { totalVotes: -1, likes: -1 },
            },

            // limit the results

            // {
            //     $limit: 10,
            // },

            // join food meta data

            {
                $lookup: {
                    from: "foodregisters",
                    localField: "_id",
                    foreignField: "foodId",
                    as: "foodInfo",
                },
            },

            // flatten result

            {
                $unwind: "$foodInfo",
            },
            {
                $project: {
                    _id: 0,
                    foodId: "$_id",
                    displayName: "$foodInfo.displayName",
                    likes: 1,
                    dislikes: 1,
                    totalVotes: 1,
                },
            },
        ]);

        return stats;

    } catch (err) {
        throw new Error("Error fetching most participated foods: " + err.message);
    }

};