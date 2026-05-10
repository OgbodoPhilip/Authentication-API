import { Router } from "express"; 
import productRoutes from "./productRoute.js";
import userRoutes from "./userRoutes.js";

const router = Router();

router.use("/api/users", userRoutes);
router.use("/api/products", productRoutes);
export default router;
