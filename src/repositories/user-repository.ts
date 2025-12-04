import { IUser, User } from "../models/user-model";

export class UserRepository {
  findByEmail = async (email: string): Promise<IUser | null> => {
    return await User.findOne({ email }).select("+password");
  };

  findByPhoneNumber = async (phoneNumber: string): Promise<IUser | null> => {
    return await User.findOne({ phoneNumber }).select("+password");
  };

  findByEmailOrPhone = async (identifier: string): Promise<IUser | null> => {
    return await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { phoneNumber: identifier }],
    }).select("+password");
  };

  findById = async (id: string): Promise<IUser | null> => {
    return await User.findById(id);
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
