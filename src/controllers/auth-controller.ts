import { Response, NextFunction } from "express";
import { AuthRequest } from "../types";
import { AuthService } from "../services/auth-service";
import { asyncHandler } from "../middleware/async-handler";
import { appConfig } from "../config/app-config";

class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  private getCookieOptions() {
    return {
      expires: new Date(Date.now() + appConfig.jwt.cookieExpire * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: appConfig.env === "production",
      sameSite: "strict" as const,
      path: "/",
    };
  }

  register = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { user, token } = await this.authService.register(req.body);

    res
      .status(201)
      .cookie("token", token, this.getCookieOptions())
      .json({
        success: true,
        message: "User registered successfully",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
          },
        },
      });
  });

  login = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { email, phoneNumber, password } = req.body;

    if (!password) {
      res.status(400).json({
        success: false,
        error: "Please provide email/phone and password",
      });
      return;
    }

    const identifier = email?.trim() || phoneNumber?.trim();

    if (!identifier) {
      res.status(400).json({
        success: false,
        error: "Please provide either email or phone number",
      });
      return;
    }

    const { user, token } = await this.authService.login(identifier, password);

    res
      .status(200)
      .cookie("token", token, this.getCookieOptions())
      .json({
        success: true,
        message: "User logged in successfully",
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
          },
        },
      });
  });

  getMe = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Not authorized",
      });
    }

    const user = await this.authService.getMe(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  });

  logout = asyncHandler(async (_req: AuthRequest, res: Response, _next: NextFunction) => {
    res.cookie("token", "", {
      expires: new Date(Date.now()),
      httpOnly: true,
      secure: appConfig.env === "production",
      sameSite: "strict" as const,
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  });

  updatePassword = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Not authorized",
      });
    }

    const { currentPassword, newPassword } = req.body;

    const user = await this.authService.updatePassword(req.user.id, currentPassword, newPassword);

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
        },
      },
    });
  });
}

export const authController = new AuthController();
