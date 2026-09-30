import mongoose, { Schema, Document, Model } from "mongoose";

export interface IApplication extends Document {
  name: string;
  email: string;
  phone?: string;
  rank?: string;
  storedFile?: string;
  originalFile?: string;
  createdAt: Date;
}

const ApplicationSchema = new Schema<IApplication>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    rank: { type: String },
    storedFile: { type: String },
    originalFile: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Application: Model<IApplication> =
  mongoose.models.Application || mongoose.model<IApplication>("Application", ApplicationSchema);
