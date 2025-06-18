import { Suspense } from "react";
import type { Metadata } from "next";
import SignInClient from "./signinClient";

export const metadata: Metadata = {
  title: "Sign In | FAM 8",
  description:
    "Sign in to your FAM 8 account to manage your agricultural operations",
};

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
        </div>
      }
    >
      <SignInClient />
    </Suspense>
  );
}

// import { Suspense } from "react";
// import SignInClient from "./signinClient";
// import { Metadata } from "next";

// export const metadata: Metadata = {
//   title: "Sign In | FAM 8",
//   description: "Sign in to your FAM 8 account",
// };

// export default function SignInPage() {
//   return (
//     <div>
//       <Suspense fallback={<div>Loading...</div>}>
//         <SignInClient />
//       </Suspense>
//     </div>
//   );
// }
