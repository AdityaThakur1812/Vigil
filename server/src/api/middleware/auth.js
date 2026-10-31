import jwt from "jsonwebtoken"
import User from "../../models/User.js"

export const protect = async (req , res , next) => {
    try {
        let token;
        if(req.headers.authorization && req.headers.authorization.startsWith("Bearer ")){
            token = req.headers.authorization.split(" ")[1];
        }
        if(!token){
            return res.status(401).json({
                success : false,
                message : "Not Authroized , Please login"
            });
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode.userId);
        if(!user){
            return json.status(401).json({
                status : false,
                message : "User no longer exists"
            });
        }
        req.user = user;;
        next();
    }catch(error){
        return res.status(401).json({
            status : false,
            message : "Invalid or expired token"
        });
    }
};