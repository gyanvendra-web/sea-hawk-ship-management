import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStaffUser extends Document {
  name: string;
  email: string;
  phone?: string;
  role: string;
  status: "active" | "inactive";
  passwordHash?: string;
  createdAt: Date;
}

const StaffUserSchema = new Schema<IStaffUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String },
    role: { type: String, default: "Manning & Crewing" },
    status: { type: String, default: "active", enum: ["active", "inactive"] },
    passwordHash: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const StaffUser: Model<IStaffUser> =
  mongoose.models.StaffUser || mongoose.model<IStaffUser>("StaffUser", StaffUserSchema);
