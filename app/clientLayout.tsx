// // app/ClientLayout.tsx
// "use client";

// import { usePathname } from "next/navigation";
// import AuthProvider from "@/components/auth/auth-provider";
// import ProtectedRoute from "@/components/protectedRoute";
// import { Providers } from "./provider";
// import { Geist, Geist_Mono } from "next/font/google";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export default function ClientLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const protectedRoutes = [
//     "/dashboard",
//     "/profile",
//     "/settings",
//     "/investments",
//   ];
//   const isProtectedRoute = protectedRoutes.some((route) =>
//     pathname.startsWith(route)
//   );

//   return (
//     <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
//       <Providers>
//         <AuthProvider>
//           {isProtectedRoute ? (
//             <ProtectedRoute>{children}</ProtectedRoute>
//           ) : (
//             children
//           )}
//         </AuthProvider>
//       </Providers>
//     </body>
//   );
// }
