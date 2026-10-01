import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubmission extends Document {
  id: string;
  kind: string;
  status: string;
  receivedAt: Date;
  data: Record<string, unknown>;
  createdAt: Date;
}

const SubmissionSchema = new Schema<ISubmission>(
  {
    id: { type: String, required: true },
    kind: { type: String, required: true, index: true },
    status: { type: String, default: "New" },
    receivedAt: { type: Date, default: Date.now },
    data: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

export const Submission: Model<ISubmission> =
  mongoose.models.Submission || mongoose.model<ISubmission>("Submission", SubmissionSchema);
