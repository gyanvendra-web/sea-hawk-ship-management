import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAccessLog extends Document {
  at: Date;
  event: string;
  user?: string;
  ip?: string;
}

const AccessLogSchema = new Schema<IAccessLog>({
  at: { type: Date, default: Date.now },
  event: { type: String, required: true },
  user: { type: String },
  ip: { type: String },
});

export const AccessLog: Model<IAccessLog> =
  mongoose.models.AccessLog || mongoose.model<IAccessLog>("AccessLog", AccessLogSchema);
