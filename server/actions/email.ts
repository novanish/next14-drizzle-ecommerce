"use server";

import { getBaseURL } from "@/lib/base-url";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const baseURL = getBaseURL();
  const confirmationLink = `${baseURL}/auth/verify-email?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Verify your email address",
    html: `
      <p>Click the link below to verify your email address:</p>
      <p><a href="${confirmationLink}">${confirmationLink}</a></p>
    `,
  });
}

export async function sendForgotPasswordEmail(email: string, token: string) {
  const baseURL = getBaseURL();
  const resetLink = `${baseURL}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: "Acme <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: `
      <p>Click the link below to reset your password:</p>
      <p><a href="${resetLink}">Reset Link</a></p>
    `,
  });
}
