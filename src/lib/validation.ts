import { z } from "zod";
import { services } from "@/data/services";

const slugs = services.map((s) => s.slug) as [string, ...string[]];
const phone = z.string().trim().regex(/^[+\d][\d\s()-]{6,18}$/, "Enter a valid phone number");

export const consultationSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone,
  service: z.enum(slugs, { message: "Select a service" }),
  preferredDate: z.string().trim().max(20).optional().or(z.literal("")),
  preferredTime: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Please tell us a bit more (min 10 characters)").max(2000),
  consent: z.literal(true, { message: "Consent is required" }),
  website: z.string().max(0).optional(), // honeypot
});

export const enrollSchema = z.object({
  name: z.string().trim().min(2, "Enter your full name").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  phone,
  service: z.enum(slugs),
});

export const verifySchema = z.object({
  razorpay_order_id: z.string().min(5).max(64),
  razorpay_payment_id: z.string().min(5).max(64),
  razorpay_signature: z.string().min(10).max(200),
});
