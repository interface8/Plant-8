"use client";

import { SignInForm } from "@/components/auth/signInForm";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "next/navigation";

export default function SignInClient() {
  const {
    signInWithCredentials,
    signInWithGoogle,
    isLoading,
    isGoogleLoading,
    error,
  } = useAuth();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div className="max-w-md mx-auto mt-10">
      {message && <div className="mb-4 text-green-600">{message}</div>}
      <SignInForm
        onSubmit={signInWithCredentials}
        onGoogleSignIn={signInWithGoogle}
        isLoading={isLoading}
        isGoogleLoading={isGoogleLoading}
        error={error}
      />
    </div>
  );
}
