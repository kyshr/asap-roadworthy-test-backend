import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt, { SignOptions } from "jsonwebtoken";
import { appConfig } from "../config/app-config";

export interface IUser extends Document {
  name: string;
  email: string;
  phoneNumber?: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please add a valid email"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) {
    return next();
  }

  // Hash password with cost of 12 rounds
  const saltRounds = appConfig.security.bcryptRounds;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

const matchPassword = async (doc: IUser, enteredPassword: string): Promise<boolean> => {
  return await bcrypt.compare(enteredPassword, doc.password);
};

const getSignedJwtToken = (doc: IUser): string => {
  return jwt.sign({ id: doc._id, email: doc.email, role: doc.role }, appConfig.jwt.secret, {
    expiresIn: appConfig.jwt.expire,
  } as SignOptions);
};

userSchema.methods.matchPassword = function (enteredPassword: string): Promise<boolean> {
  return matchPassword(this as IUser, enteredPassword);
};

userSchema.methods.getSignedJwtToken = function (): string {
  return getSignedJwtToken(this as IUser);
};

export const User = mongoose.model<IUser>("User", userSchema);
