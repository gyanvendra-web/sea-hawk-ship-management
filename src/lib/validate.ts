import { z } from "zod";

export const enquiryTypes = ["Commercial", "Technical", "Crew", "Consultancy", "Integrated", "Other"] as const;

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  company: z.string().trim().max(150).optional().default(""),
  email: z.string().trim().email("Enter a valid email address").max(150),
  phone: z.string().trim().optional().default(""),
  enquiryType: z.enum(enquiryTypes).optional().default("Other"),
  vesselType: z.string().trim().max(100).optional().default(""),
  message: z.string().trim().max(3000).optional().default("General Enquiry"),
  consent: z.boolean().optional().default(true),
  website: z.string().max(0).optional().default(""), // honeypot
});

export type ContactInput = z.infer<typeof contactSchema>;
