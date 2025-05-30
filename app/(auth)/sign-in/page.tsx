import { Suspense } from "react";
import SignInClient from "./signinClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In | FAM 8",
  description: "Sign in to your FAM 8 account",
};

export default function SignInPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <SignInClient />
      </Suspense>
    </div>
  );
}
