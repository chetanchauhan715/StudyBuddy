import jwt from "jsonwebtoken";
 
function authMiddleware (req , res , next){
   
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).send("Please Login ");
    }

    const parts = token.split(" ");
    const headerPart = parts[0];
    const actualToken = parts[1];

    if(headerPart != "Bearer"){
        return res.status(401).send("Invalid Authorization Header");
    }

    const decoded = jwt.verify(actualToken , "mySecretKey");

    req.user = decoded;

    next();

} 

export default authMiddleware;