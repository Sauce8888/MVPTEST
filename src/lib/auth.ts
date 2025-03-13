import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { supabase, adminSupabase } from "./supabase";
import { compare } from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Check if user exists in hosts table
        const { data: hostData, error: hostError } = await supabase
          .from('hosts')
          .select('*')
          .eq('email', credentials.email)
          .single();

        if (hostError || !hostData) {
          console.error("Host not found:", hostError);
          return null;
        }

        // Check if password matches
        const passwordMatch = await compare(
          credentials.password,
          hostData.password_hash
        );

        if (!passwordMatch) {
          return null;
        }

        // If admin email, add isAdmin: true
        const isAdmin = process.env.ADMIN_EMAIL === credentials.email;

        return {
          id: hostData.id,
          email: hostData.email,
          name: `${hostData.first_name} ${hostData.last_name}`,
          isAdmin
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.isAdmin = (user as any).isAdmin || false;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
};

// Get the current session on the server
export async function getSession() {
  return await import("next-auth/next").then((mod) => mod.getServerSession(authOptions));
}

// Check if the current user is authenticated
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}

// Check if the current user is an admin
export async function isAdmin() {
  const user = await getCurrentUser();
  return user?.isAdmin === true;
}

// Types
declare module 'next-auth' {
  interface User {
    id: string;
    email: string;
    name: string;
    isAdmin?: boolean;
  }

  interface Session {
    user: User;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string;
    isAdmin?: boolean;
  }
} 