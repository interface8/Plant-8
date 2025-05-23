// import { compareSync } from "bcrypt-ts-edge";
// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import GoogleProvider from "next-auth/providers/google";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import { prisma } from "@/db/prisma";
// import type { Adapter } from "@auth/core/adapters";

// // Extend NextAuth types
// declare module "next-auth" {
//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       role: string;
//     };
//   }

//   interface User {
//     role?: string;
//   }
// }

// declare module "@auth/core/jwt" {
//   interface JWT {
//     role?: string;
//   }
// }

// export const { handlers, auth, signIn, signOut } = NextAuth({
//   adapter: PrismaAdapter(prisma) as Adapter,
//   secret: process.env.AUTH_SECRET as string,
//   pages: {
//     signIn: "/sign-in",
//     error: "/sign-in",
//   },
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           prompt: "consent",
//           access_type: "offline",
//           response_type: "code",
//         },
//       },
//     }),
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         email: { type: "email", label: "Email" },
//         password: { type: "password", label: "Password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Missing email or password");
//         }

//         const user = await prisma.user.findFirst({
//           where: { email: credentials.email },
//         });

//         if (user && user.password) {
//           const isMatch = compareSync(
//             credentials.password as string,
//             user.password
//           );
//           if (isMatch) {
//             return {
//               id: user.id,
//               name: user.name,
//               email: user.email,
//               role: user.role || "USER",
//             };
//           }
//         }

//         throw new Error("Invalid email or password");
//       },
//     }),
//   ],
//   callbacks: {
//     async session({ session, token }) {
//       if (token && session.user) {
//         session.user.id = token.sub!;
//         session.user.role = token.role || "USER";
//       }
//       return session;
//     },
//     async jwt({ token, user }) {
//       if (user) {
//         token.role = user.role || "USER";
//         if (user.name === "NO_NAME" && user.email) {
//           const defaultName = user.email.split("@")[0];
//           token.name = defaultName;
//           await prisma.user.update({
//             where: { id: user.id },
//             data: { name: defaultName },
//           });
//         }
//       }
//       return token;
//     },
//   },
// });
