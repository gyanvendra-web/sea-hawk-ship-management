import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStaffUser extends Document {
  name: string;
  email: string;
  phone?: string;
  role: string;
  passwordHash?: string;
  createdAt: Date;
}

const StaffUserSchema = new Schema<IStaffUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    role: { type: String, default: "Manning & Crewing" },
    passwordHash: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const StaffUser: Model<IStaffUser> =
  mongoose.models.StaffUser || mongoose.model<IStaffUser>("StaffUser", StaffUserSchema);
