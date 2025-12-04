import { IUser, User } from "../models/user-model";

export class UserRepository {
  findByEmail = async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email: email.toLowerCase().trim() }).select("+password");
  };

  findByPhoneNumber = async (phoneNumber: string): Promise<IUser | null> => {
    return await User.findOne({ phoneNumber }).select("+password");
  };

  findByEmailOrPhone = async (identifier: string): Promise<IUser | null> => {
    if (!identifier || !identifier.trim()) {
      return null;
    }

    const trimmedIdentifier = identifier.trim();
    
    // Check if identifier looks like an email (contains @)
    const isEmail = trimmedIdentifier.includes("@");
    
    if (isEmail) {
      // Try email lookup first (most common case)
      return await User.findOne({ email: trimmedIdentifier.toLowerCase() }).select("+password");
    } else {
      // Try phone number lookup
      return await User.findOne({ phoneNumber: trimmedIdentifier }).select("+password");
    }
  };

  findById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
  };

  findByIdWithPassword = async (id: string): Promise<IUser | null> => {
    return await User.findById(id).select("+password");
  };

  create = async (userData: {
    name: string;
    email: string;
    password: string;
    phoneNumber?: string;
    role?: string;
  }): Promise<IUser> => {
    return await User.create(userData);
  };

  updateById = async (id: string, updateData: Partial<IUser>): Promise<IUser | null> => {
    return await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  };

  deleteById = async (id: string): Promise<boolean> => {
    const result = await User.findByIdAndDelete(id);
    return !!result;
  };
}
