import React from "react";
import { verifyEmailVerificationToken } from "@/server/actions/token";
import { AuthCard } from "@/components/auth/auth-card";

interface Props {
  searchParams: {
    token?: string;
  };
}

export default async function VerifyEmailPage({ searchParams }: Props) {
  const { token } = searchParams;

  if (!token) {
    return (
      <AuthCard
        backButtonHref="/auth/login"
        backButtonText="Back to login"
        cardTitle="Invalid token"
      >
        <p className="text-lg text-red-600">
          The token is missing or invalid. Please check your email or try again.
        </p>
      </AuthCard>
    );
  }

  const result = await verifyEmailVerificationToken(token);
  if (result?.error) {
    return (
      <AuthCard
        backButtonHref="/auth/login"
        backButtonText="Back to login"
        cardTitle="Invalid token"
      >
        <p className="text-lg text-red-600">{result.error}</p>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      backButtonHref="/auth/login"
      backButtonText="Back to login"
      cardTitle="Email verified"
    >
      <p className="text-lg text-green-600">
        Your email has been successfully verified!
      </p>
    </AuthCard>
  );
}
