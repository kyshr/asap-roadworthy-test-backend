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

  register = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { user, token } = await this.authService.register(req.body);

    const tokenOptions = {
      expires: new Date(Date.now() + appConfig.jwt.cookieExpire * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: appConfig.env === "production",
      sameSite: "strict" as const,
    };

    res
      .status(201)
      .cookie("token", token, tokenOptions)
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
          token,
        },
      });
  });

  login = asyncHandler(async (req: AuthRequest, res: Response, _next: NextFunction) => {
    const { email, phoneNumber, password } = req.body;
    const identifier = email || phoneNumber;
    const { user, token } = await this.authService.login(identifier, password);

    const tokenOptions = {
      expires: new Date(Date.now() + appConfig.jwt.cookieExpire * 24 * 60 * 60 * 1000),
      httpOnly: true,
      secure: appConfig.env === "production",
      sameSite: "strict" as const,
    };

    res
      .status(200)
      .cookie("token", token, tokenOptions)
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
          token,
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
    res.cookie("token", "none", {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully",
    });
  });
}

export const authController = new AuthController();
