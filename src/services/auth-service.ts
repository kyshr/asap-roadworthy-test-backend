import { IUser } from "../models/user-model";
import { UserRepository } from "../repositories/user-repository";
import { AppError } from "../utils/app-error";

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  register = async (userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role?: string;
  }): Promise<{ user: IUser; token: string }> => {
    const existingUser = await this.userRepository.findByEmailOrPhone(userData.email);

    if (existingUser) {
      throw new AppError("User already exists with this email or phone number", 400);
    }

    if (userData.phoneNumber) {
      const existingPhoneUser = await this.userRepository.findByPhoneNumber(userData.phoneNumber);
      if (existingPhoneUser) {
        throw new AppError("User already exists with this phone number", 400);
      }
    }

    const user = await this.userRepository.create(userData);
    const token = user.getSignedJwtToken();

    return { user, token };
  };

  login = async (identifier: string, password: string): Promise<{ user: IUser; token: string }> => {
    if (!identifier || !identifier.trim() || !password) {
      throw new AppError("Please provide email/phone and password", 400);
    }

    const trimmedIdentifier = identifier.trim();

    // Try to find user by email first, then by phone
    let user = await this.userRepository.findByEmailOrPhone(trimmedIdentifier);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
    }

    // Ensure password field is available (should be included with .select("+password"))
    // If password is undefined, it means the select didn't work
    if (!user.password) {
      // Try to fetch user again with explicit password selection
      const emailMatch = trimmedIdentifier.includes("@");
      if (emailMatch) {
        user = await this.userRepository.findByEmail(trimmedIdentifier.toLowerCase());
      }

      if (!user || !user.password) {
        throw new AppError("Invalid credentials", 401);
      }
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new AppError("Invalid credentials", 401);
    }

    const token = user.getSignedJwtToken();

    return { user, token };
  };

  getMe = async (userId: string): Promise<IUser | null> => {
    return await this.userRepository.findById(userId);
  };
}
