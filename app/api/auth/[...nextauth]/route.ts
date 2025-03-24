import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { AuthOptions } from 'next-auth';
// Remove unused import
// import { supabase } from '@/app/lib/supabase';

// Extend the session type to include user id
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    }
  }
}

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // For quick development, we're using a simplified auth system
        // In production, you'd want to use Supabase Auth directly
        try {
          // Create a temporary user ID - in production you'd use actual auth
          const userId = `user_${Date.now()}`;
          
          return {
            id: userId,
            name: `User ${userId.substring(5, 9)}`,
            email: credentials.email,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 