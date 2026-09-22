import { z } from "zod";

const email = z
  .string()
  .min(1, "required")
  .email("invalidEmail")
  .max(254);

export const newsletterSchema = z.object({
  email,
});

export const demoRequestSchema = z.object({
  name: z.string().min(2, "required").max(80),
  email,
  company: z.string().min(2, "required").max(120),
  message: z.string().max(1000).optional().or(z.literal("")),
});

export const trialSignupSchema = z.object({
  name: z.string().min(2, "required").max(80),
  email,
  company: z.string().min(2, "required").max(120),
  password: z
    .string()
    .min(10, "minLength")
    .regex(/[A-Z]/, "uppercase")
    .regex(/[0-9]/, "number"),
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "required").max(128),
});

export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type DemoRequestInput = z.infer<typeof demoRequestSchema>;
export type TrialSignupInput = z.infer<typeof trialSignupSchema>;
export type LoginInput = z.infer<typeof loginSchema>;

export function firstError(result: { success: false; error: { issues: { path: PropertyKey[]; message: string }[] } }) {
  const issue = result.error.issues[0];
  return { field: String(issue?.path[0] ?? ""), message: issue?.message ?? "invalid" };
}
