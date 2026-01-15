import { getISTDateString } from "../dateUtils.js";
import Vote from "../../model/voteModel.js";

export const bottomThreeFoods = async() =>{
    try{

        const voteDate = getISTDateString();

        const stats = await Vote.aggregate([

            // 1. Only today's votes

            {
                $match: {voteDate},
            },

            // Group by food

            {
                $group: {
                    _id: "$foodId",

                    likes: {
                        $sum: {
                            $cond: [{ $eq: ["$voteType", "like"]}, 1, 0],
                        },
                    },

                    dislikes: {
                        $sum: {
                            $cond: [{$eq: ["$voteType", "dislike"]}, 1, 0],
                        },
                    },

                    totalVotes: { $sum: 1},
                },
            },

            // compute like %

            {
                $addFields: {
                    likePercentage: {
                        $multiply: [
                            {$divide: ["$likes", "$totalVotes"]},
                            100,
                        ],
                    },
                    score: { $subtract: ["$likes", "$dislikes"] },
                },
            },

            // 4️⃣ Ignore low-sample foods
       {
         $match: { totalVotes: { $gte: 5 } },
       },

      // Sort by score (worst first) and then like %
      {
        $sort: { score: 1, likePercentage: 1 },
      },

      // Take bottom 3
      {
        $limit: 3,
      },

      // Join food regfister

      {
        $lookup: {
            from: "foodregisters",
            localField: "_id",
            foreignField: "foodId",
            as: "foodInfo",
        },
      },

      // Flatten up the lookup result

      {
        $unwind: "$foodInfo",
      },

      // final response
      {
        $project: {
          _id: 0,
          foodId: "$_id",
          displayName: "$foodInfo.displayName",
          likes: 1,
          dislikes: 1,
          totalVotes: 1,
          score: 1,
          likePercentage: { $round: ["$likePercentage", 1] },
        },
      },

        ]);
        return stats;
    }catch(err){
        throw new Error("Error fetching bottom foods: " + err.message);
    }
}

