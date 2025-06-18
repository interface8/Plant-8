import type { Metadata } from "next";
import SignUpClient from "./sign-up-client";

export const metadata: Metadata = {
  title: "Sign Up | FAM 8",
  description:
    "Create your FAM 8 account to start managing your agricultural operations",
};

export default function SignUpPage() {
  return <SignUpClient />;
}

// "use client";

// import Link from "next/link";
// import { SignUpForm } from "@/components/auth/signupForm";
// import { useAuth } from "@/hooks/use-auth";

// export default function SignUpPage() {
//   const { signUp, isLoading, error } = useAuth();

//   // const handleSignUp = async (data: {
//   //   name: string;
//   //   email: string;
//   //   password: string;
//   //   confirmPassword: string;
//   // }): Promise<boolean> => {
//   //   const result = await signUp(data);
//   //   return result;
//   // };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-md w-full space-y-8">
//         <div>
//           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//             Create your account
//           </h2>
//           <p className="mt-2 text-center text-sm text-gray-600">
//             Or{" "}
//             <Link
//               href="/sign-in"
//               className="font-medium text-indigo-600 hover:text-indigo-500"
//             >
//               sign in to your existing account
//             </Link>
//           </p>
//         </div>

//         <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
//           <SignUpForm onSubmit={signUp} isLoading={isLoading} error={error} />
//         </div>
//       </div>
//     </div>
//   );
// }
