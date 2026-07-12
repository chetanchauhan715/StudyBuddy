import jwt from "jsonwebtoken";
 
function authMiddleware (req , res , next){
   
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Please Login "
        });
    }

    const parts = token.split(" ");
    const headerPart = parts[0];
    const actualToken = parts[1];

    if(headerPart != "Bearer"){
        return res.status(401).json({
            success:false,
            message:"Invalid Authorizatin Headers"
        });
    }

    const decoded = jwt.verify(actualToken , process.env.JWT_SECRET);

    req.user = decoded;

    next();

} 

export default authMiddleware;