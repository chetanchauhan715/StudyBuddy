import User from "../../models/User.js";
import Studysession from "../../models/StudySession.js";

export async function getAllUser(req, res, next) {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const search = req.query.search || "";

    try {
        const basePipeline = [
            {
                $lookup: {
                    from: "studysessions",
                    localField: "_id",
                    foreignField: "user",
                    as: "sessions",
                },
            },

            {
                $project: {
                    name: 1,
                    email: 1,
                    joinDate: "$createdAt",

                    studyTime: {
                        $sum: "$sessions.duration",
                    },

                    totalSessions: {
                        $size: "$sessions",
                    },
                },
            },
        ];

        if (search) {
            basePipeline.push({
                $match: {
                    $or: [
                        {
                            name: {
                                $regex: search,
                                $options: "i",
                            },
                        },
                        {
                            email: {
                                $regex: search,
                                $options: "i",
                            },
                        },
                    ],
                },
            });
        }

        const dataPipeline = [...basePipeline];
        const countPipeline = [...basePipeline];

        countPipeline.push({
            $count: "totalUsers",
        });

        dataPipeline.push(
            {
                $sort: {
                    studyTime: -1,
                },
            },
            {
                $skip: skip,
            },
            {
                $limit: limit,
            }
        );

        const usersData = await User.aggregate(dataPipeline);

        const totalUsersData = await User.aggregate(countPipeline);

        const totalUsers = totalUsersData[0]?.totalUsers || 0;
        const totalPages = Math.ceil(totalUsers / limit);

        return res.status(200).json({
            success: true,
            message: "User management data fetched successfully",
            data: {
                usersData,

                pagination: {
                    currentPage: page,
                    totalPages,
                    totalUsers,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            },
        });
    } catch (error) {
        next(error);
    }
}

export async function deleteUser(req , res , next) {
   try{

    const {id} = user.params;

    const user = await User.findById(id);

    if(!user){
        return res.status(404).json({
            success:false,
            message:"User not found"
        });
    }

    await Studysession.deleteMany({
        user:id,
    });

    await User.findByIdAndDelete(id);

    return res.status(200).json({
        success:true,
        message:"User deleted succesfully",
    });

   } catch(error){
    next(error);
   }
}