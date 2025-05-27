"use client";

import { SignInForm } from "@/components/auth/signInForm";
import { useAuth } from "@/hooks/use-auth";
import { useSearchParams } from "next/navigation";

export default function SignInPage() {
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

// "use client";

// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { SignInForm } from "@/components/auth/signInForm";
// import { Alert, AlertDescription } from "@/components/ui/alert";
// import { useAuth } from "@/hooks/use-auth";

// export default function SignInPage() {
//   const searchParams = useSearchParams();
//   const message = searchParams.get("message");
//   const from = searchParams.get("from") || "/dashboard";

//   const {
//     signInWithCredentials,
//     signInWithGoogle,
//     isLoading,
//     isGoogleLoading,
//     error,
//   } = useAuth();

//   const handleSignIn = async (data: { email: string; password: string }) => {
//     await signInWithCredentials(data, from);
//   };

//   const handleGoogleSignIn = async () => {
//     await signInWithGoogle(from);
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Sign in to your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Or{" "}
//             <Link
//               href="/sign-up"
//               className="font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               create a new account
//             </Link>
//           </p>
//         </div>

//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           {message && (
//             <Alert className="mb-4">
//               <AlertDescription>{message}</AlertDescription>
//             </Alert>
//           )}

//           <SignInForm
//             onSubmit={handleSignIn}
//             onGoogleSignIn={handleGoogleSignIn}
//             isLoading={isLoading}
//             isGoogleLoading={isGoogleLoading}
//             error={error}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }
