import mongoose, { Schema, Document, Model } from "mongoose";

export interface IContactForm extends Document {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  createdAt: Date;
}

const ContactFormSchema = new Schema<IContactForm>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const ContactForm: Model<IContactForm> =
  mongoose.models.ContactForm || mongoose.model<IContactForm>("ContactForm", ContactFormSchema);
