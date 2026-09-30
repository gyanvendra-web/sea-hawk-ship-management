import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPasswordReset extends Document {
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const PasswordResetSchema = new Schema<IPasswordReset>(
  {
    email: { type: String, required: true, lowercase: true, trim: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Automatic expiration after expiresAt date
PasswordResetSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const PasswordReset: Model<IPasswordReset> =
  mongoose.models.PasswordReset || mongoose.model<IPasswordReset>("PasswordReset", PasswordResetSchema);
