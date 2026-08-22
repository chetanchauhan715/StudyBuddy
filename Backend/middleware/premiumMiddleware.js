import User from "../models/User.js";

async function premiumMiddleware(req , res , next){
    const userId = req.user.userId;
    const today = new Date();

    try{
        const user = await User.findById(userId);

        if(!user||
            user.subscription?.plan !== "premium" ||
            !user.subscription?.startDate ||
            !user.subscription?.endDate ||
            user.subscription.startDate > today ||
             user.subscription.endDate <= today){
            return res.status(403).json({
                success:false,
                message:"Premium subscription required"
            });
        }

        next();

        
    }catch(error){
        next(error);
    }
}

export default premiumMiddleware;