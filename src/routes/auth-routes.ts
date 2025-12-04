import { Router } from "express";
import { authController } from "../controllers/auth-controller";
import { protect } from "../middleware/auth-middleware";
import { validate } from "../config/zod-validator";
import { registerSchema, loginSchema, updatePasswordSchema } from "../schemas/auth-schema";

const router = Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);
router.put("/update-password", protect, validate(updatePasswordSchema), authController.updatePassword);

export default router;
