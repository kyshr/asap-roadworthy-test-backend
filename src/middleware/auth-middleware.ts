import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, JwtUserPayload } from "../types";
import { appConfig } from "../config/app-config";
import { AppError } from "../utils/app-error";
import { asyncHandler } from "./async-handler";

export const protect = asyncHandler(async (req: AuthRequest, _res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    throw new AppError("Not authorized to access this route", 401);
  }

  try {
    const decoded = jwt.verify(token, appConfig.jwt.secret) as JwtUserPayload;

    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    throw new AppError("Not authorized to access this route", 401);
  }
});

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new AppError("Not authorized to access this route", 401);
    }

    if (!roles.includes(req.user.role || "")) {
      throw new AppError(`User role '${req.user.role}' is not authorized to access this route`, 403);
    }

    next();
  };
};
