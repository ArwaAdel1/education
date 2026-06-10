import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../shared/utils/asyncHandler.js";
import { okResponse } from "../../shared/utils/apiResponse.js";
import { AppError } from "../../shared/utils/AppError.js";
import { TeacherService } from "./teacher.service.js";
import type { UpdateTeacherProfileInput } from "./teacher.validation.js";

const teacherService = new TeacherService();

export class TeacherController {
  public getProfile = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
      const userId = req.user?.id;
      if (!userId) {
        return next(new AppError("Unauthorized", 401));
      }

      const profile = await teacherService.getProfile(userId);

      _res
        .status(200)
        .json(okResponse("Teacher profile fetched successfully", profile));
    },
  );

  public updateProfile = asyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
      const userId = req.user?.id;
      if (!userId) {
        return next(new AppError("Unauthorized", 401));
      }

      const input = req.body as UpdateTeacherProfileInput;
      const updated = await teacherService.updateProfile(userId, input);

      _res
        .status(200)
        .json(okResponse("Teacher profile updated successfully", updated));
    },
  );
}
