"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SignInData {
  email: string;
  password: string;
}

interface SignUpData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const signInWithCredentials = async (
    data: SignInData,
    redirectTo = "/dashboard"
  ) => {
    setIsLoading(true);
    setError("");

    if (!data.email || !data.password) {
      setError("Please fill in all fields");
      setIsLoading(false);
      toast.error("Please fill in all fields");
      return;
    }

    const loadingToast = toast.loading("Signing you in...", {
      description: "Please wait while we verify your credentials",
    });

    try {
      const result = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
      });

      toast.dismiss(loadingToast);

      if (result?.error) {
        setError(result.error);
        toast.error("Sign in failed", {
          description: "Invalid email or password. Please try again.",
        });
      } else if (result?.ok) {
        toast.success("Welcome back!", {
          description: "You have been signed in successfully",
          duration: 3000,
        });

        setTimeout(() => {
          router.push(redirectTo);
          router.refresh();
        }, 1000);
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setError("An unexpected error occurred");
      toast.dismiss(loadingToast);
      toast.error("Unexpected error", {
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async (redirectTo = "/dashboard") => {
    setIsGoogleLoading(true);

    const loadingToast = toast.loading("Connecting to Google...", {
      description: "Redirecting to Google for authentication",
    });

    try {
      await signIn("google", { callbackUrl: redirectTo });
      toast.dismiss(loadingToast);
    } catch (error) {
      console.error("Google sign in error:", error);
      setError("Failed to sign in with Google");
      toast.dismiss(loadingToast);
      toast.error("Google sign in failed", {
        description: "Unable to connect to Google. Please try again.",
      });
      setIsGoogleLoading(false);
    }
  };

  const signUp = async (data: SignUpData): Promise<boolean> => {
    setIsLoading(true);
    setError("");

    if (!data.name.trim()) {
      setError("Name is required");
      setIsLoading(false);
      toast.error("Name is required");
      return false;
    }

    if (!data.email.trim()) {
      setError("Email is required");
      setIsLoading(false);
      toast.error("Email is required");
      return false;
    }

    if (data.password.length < 6) {
      setError("Password must be at least 6 characters");
      setIsLoading(false);
      toast.error("Password must be at least 6 characters");
      return false;
    }

    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      toast.error("Passwords do not match");
      return false;
    }

    const loadingToast = toast.loading("Creating your account...", {
      description: "Please wait while we set up your account",
    });

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      });

      const responseData = await response.json();

      toast.dismiss(loadingToast);

      if (!response.ok) {
        setError(responseData.error || "Something went wrong");
        toast.error("Failed to create account", {
          description:
            responseData.error || "Something went wrong. Please try again.",
        });
        return false;
      } else {
        toast.success("Account created successfully!", {
          description: "You can now sign in with your credentials",
          duration: 5000,
        });

        setTimeout(() => {
          router.push(
            "/sign-in?message=Account created successfully! Please sign in."
          );
        }, 1500);
        return true;
      }
    } catch (error) {
      console.error("Signup error:", error);
      setError("An unexpected error occurred");
      toast.dismiss(loadingToast);
      toast.error("Unexpected error", {
        description: "Something went wrong. Please try again later.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    signInWithCredentials,
    signInWithGoogle,
    signUp,
    isLoading,
    isGoogleLoading,
    error,
    setError,
  };
}
