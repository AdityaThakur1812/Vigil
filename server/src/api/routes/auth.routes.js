import express from "express"
import { registerUser , loginUser } from "../controllers/authController.js"
import { protect } from "../middleware/auth.js";
import User from "../../models/User.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login" , loginUser)

router.get("/me" ,protect , (req , res) =>{//anonymous callback function
    res.status(200).json({
        success : true, 
        user : {
            id : req.user._id,
            name : req.user.name,
            mail : req.user.email,
        }
    });
});
export default router;


