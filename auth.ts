import "server-only";
import NextAuth, { type NextAuthConfig } from "next-auth";
import Google from "@auth/core/providers/google";
import Credentials from "@auth/core/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";
import prisma from "@/db/prisma";

declare module "@auth/core/types" {
  interface User {
    roles?: string[];
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      roles?: string[];
    };
  }

  interface JWT {
    id?: string;
    roles?: string[];
  }
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    Credentials({
      credentials: {
        email: { type: "email" },
        password: { type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: {
            roles: {
              include: {
                role: true,
              },
            },
          },
        });

        if (!user || !user.password) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          roles: user.roles.map(
            (userRole: { role: { name: string } }) => userRole.role.name
          ),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.id = user.id;
        token.roles = user.roles;
      } else if (token.id != null) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            include: {
              roles: {
                include: {
                  role: true,
                },
              },
            },
          });
          if (dbUser) {
            token.roles = dbUser.roles.map(
              (userRole: { role: { name: string } }) => userRole.role.name
            );
          }
        } catch (error) {
          console.error("Error refreshing user roles:", error);
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user && token.id) {
        session.user.id = token.id;
        session.user.roles = token.roles;
      }
      return session;
    },
    async signIn(params: { user: any; account?: any }) {
      const { user, account } = params;
      if (account?.provider === "google" && user.email) {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            const userRole = await prisma.role.upsert({
              where: { name: "USER" },
              update: {},
              create: { name: "USER" },
            });

            const newUser = await prisma.user.create({
              data: {
                email: user.email,
                name: user.name || "No Name",
              },
            });

            await prisma.userRole.create({
              data: {
                userId: newUser.id,
                roleId: userRole.id,
              },
            });
          }
        } catch (error) {
          console.error("Error creating user:", error);
          return false;
        }
      }
      return true;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);

// import NextAuth, { type NextAuthConfig } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import bcrypt from "bcrypt";
// import prisma from "@/db/prisma";

// declare module "next-auth" {
//   interface User {
//     roles?: string[];
//   }

//   interface Session {
//     user: {
//       id: string;
//       name?: string | null;
//       email?: string | null;
//       image?: string | null;
//       roles?: string[];
//     };
//   }

//   interface JWT {
//     id?: string;
//     roles?: string[];
//   }
// }

// export const authConfig: NextAuthConfig = {
//   adapter: PrismaAdapter(prisma),
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60, // 30 days
//   },
//   pages: {
//     signIn: "/sign-in",
//     error: "/sign-in",
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
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) {
//           throw new Error("Email and password are required");
//         }

//         const user = await prisma.user.findUnique({
//           where: { email: credentials.email as string },
//           include: {
//             roles: {
//               include: {
//                 role: true,
//               },
//             },
//           },
//         });

//         if (!user || !user.password) {
//           throw new Error("Invalid email or password");
//         }

//         const isValid = await bcrypt.compare(
//           credentials.password as string,
//           user.password
//         );
//         if (!isValid) {
//           throw new Error("Invalid email or password");
//         }

//         return {
//           id: user.id,
//           email: user.email,
//           name: user.name,
//           roles: user.roles.map(
//             (userRole: { role: { name: any } }) => userRole.role.name
//           ),
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token.id = user.id;
//         token.roles = user.roles;
//       } else if (token.id) {
//         // Refresh roles from database for existing sessions
//         try {
//           const dbUser = await prisma.user.findUnique({
//             where: { id: token.id as string },
//             include: {
//               roles: {
//                 include: {
//                   role: true,
//                 },
//               },
//             },
//           });
//           if (dbUser) {
//             token.roles = dbUser.roles.map(
//               (userRole: { role: { name: any } }) => userRole.role.name
//             );
//           }
//         } catch (error) {
//           console.error("Error refreshing user roles:", error);
//         }
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user && token.id) {
//         session.user.id = token.id as string;
//         session.user.roles = token.roles as string[];
//       }
//       return session;
//     },
//     async signIn({ user, account }) {
//       if (account?.provider === "google" && user.email) {
//         try {
//           const existingUser = await prisma.user.findUnique({
//             where: { email: user.email },
//           });

//           if (!existingUser) {
//             // First, ensure the USER role exists
//             const userRole = await prisma.role.upsert({
//               where: { name: "USER" },
//               update: {},
//               create: { name: "USER" },
//             });

//             // Create the user
//             const newUser = await prisma.user.create({
//               data: {
//                 email: user.email,
//                 name: user.name || "No Name",
//               },
//             });

//             // Create the user role relationship
//             await prisma.userRole.create({
//               data: {
//                 userId: newUser.id,
//                 roleId: userRole.id,
//               },
//             });
//           }
//         } catch (error) {
//           console.error("Error creating user:", error);
//           return false;
//         }
//       }
//       return true;
//     },
//   },
// };
// export default authConfig;

// export const auth = NextAuth(authConfig);
