import { Router } from "express";
import User from "../model/userSchema.js";
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from "../controllers/userController.js";
import { loginUser,logoutUser } from "../controllers/loginController.js";
import { isAuthenticated } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/",createUser);    
router.get("/",getAllUsers);


router.post("/login", loginUser);
router.post("/logout", logoutUser);


router.get("/profile", isAuthenticated, async (req, res, next) => {
  try {
    console.log("session:", req.session);
    console.log("userId:", req.session.userId);

    const user = await User.findById(req.session.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
     message: "Profile fetched successfully",
     
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message
    });
  }
});



router.get("/:id", getUserById);
router.patch("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
