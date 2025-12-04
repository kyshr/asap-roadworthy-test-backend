import { Router } from "express";
import { authController } from "../controllers/auth-controller";
import { protect } from "../middleware/auth-middleware";
import { validate } from "../config/zod-validator";
import { registerSchema, loginSchema } from "../schemas/auth-schema";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);

export default router;
