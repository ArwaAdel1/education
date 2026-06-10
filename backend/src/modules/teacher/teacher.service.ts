import { prisma } from "../../config/database.js";
import { userPublicFields } from "../users/user.types.js";
import { teacherPublicFields } from "./teacher.types.js";
import type { UpdateTeacherProfileInput } from "./teacher.validation.js";
import type { ApiError } from "../../shared/types/common.types.js";

export class TeacherService {
  public async getProfile(userId: string) {
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId },
      select: {
        ...teacherPublicFields,
        user: { select: userPublicFields },
      },
    });

    if (!profile) {
      const error = new Error("Teacher profile not found") as ApiError;
      error.status = 404;
      throw error;
    }

    return profile;
  }

  public async updateProfile(
    userId: string,
    input: UpdateTeacherProfileInput,
  ) {
    const profile = await prisma.teacherProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      const error = new Error("Teacher profile not found") as ApiError;
      error.status = 404;
      throw error;
    }

    const data: Record<string, string | null> = {};
    if (input.subject !== undefined) {
      data.subject = input.subject === "" ? null : input.subject;
    }
    if (input.bio !== undefined) {
      data.bio = input.bio === "" ? null : input.bio;
    }
    if (input.photoUrl !== undefined) {
      data.photoUrl = input.photoUrl === "" ? null : input.photoUrl;
    }
    if (input.logoUrl !== undefined) {
      data.logoUrl = input.logoUrl === "" ? null : input.logoUrl;
    }

    const updated = await prisma.teacherProfile.update({
      where: { userId },
      data,
      select: {
        ...teacherPublicFields,
        user: { select: userPublicFields },
      },
    });

    return updated;
  }
}
