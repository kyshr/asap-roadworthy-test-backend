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
    const existingUser = await this.userRepository.findByEmailOrPhone(
      userData.email
    );

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
    if (!identifier || !password) {
      throw new AppError("Please provide email/phone and password", 400);
    }

    const user = await this.userRepository.findByEmailOrPhone(identifier);

    if (!user) {
      throw new AppError("Invalid credentials", 401);
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
