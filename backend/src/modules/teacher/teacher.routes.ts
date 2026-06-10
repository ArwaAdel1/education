import { Router } from "express";
import { TeacherController } from "./teacher.controller.js";
import { authenticateMiddleware } from "../../shared/middlewares/authenticate.middleware.js";
import { validateRequest } from "../../shared/middlewares/validate.middleware.js";
import { updateTeacherProfileSchema } from "./teacher.validation.js";

const router = Router();
const controller = new TeacherController();

// router.get("/profile", authenticateMiddleware, controller.getProfile);
router.put(
  "/profile",
  authenticateMiddleware,
  validateRequest(updateTeacherProfileSchema),
  controller.updateProfile,
);

export default router;
