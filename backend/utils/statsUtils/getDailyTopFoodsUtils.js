import { getISTDateString } from "../dateUtils.js";
import Vote from "../../model/voteModel.js";
export const topFiveFoods = async () => {
  try {
    // keep an await before the function just below, incase there comes any errors
    const voteDate = getISTDateString();

    const stats = await Vote.aggregate([
      // only today's votes
      {
        $match: { voteDate },
      },
      // group by the food
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

      // compute the score
      {
        $addFields: {
          likePercentage: {
            $multiply: [{ $divide: ["$likes", "$totalVotes"] }, 100],
          },

          score: { $subtract: ["$likes", "$dislikes"] },
        },
      },
      // // 4️⃣ Optional: ignore low-sample foods
      //   {
      //     $match: { totalVotes: { $gte: 5 } },
      //   },

        //  Sort by LIKE %
        {
          $sort: { likePercentage: -1 },
        },

        // Limit to top 5
        {
          $limit: 5,
        },

      // The following is for lookup.

      {
        $lookup: {
            from: "foodregisters",
            localField: "_id",
            foreignField: "foodId",
            as: "foodInfo",
        },
      },

      // foodInfo will be an array , so flatten it.
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
          likePercentage: { $round: ["$likePercentage", 1] },
          score: 1,
        },
      },
    ]);

    return stats;
  } catch (err) {
    throw new Error("Error fetching top foods: " + err.message);
  }
};
