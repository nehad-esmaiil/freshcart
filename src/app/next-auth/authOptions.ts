import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { jwtDecode } from 'jwt-decode';

export const authOptions: NextAuthOptions = {
  providers: [
    // Add your authentication providers here
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Implement your authentication logic here
        try {
          const res = await fetch(`https://ecommerce.routemisr.com/api/v1/auth/signin`, {
            method: 'POST',
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
            headers: { 'Content-Type': 'application/json' },
          });
          const result = await res.json();
          if (!res.ok) {
            throw new Error(result.message);
          }
          const jwt: { id: string } = jwtDecode(result.token);
          return {
            id: jwt.id,
            name: result.user.name,
            email: result.user.email,
            role: result.user.role,
            phone: result.user.phone,
            accessToken: result.token,
          };
        } catch (err) {
          throw new Error((err as Error).message);
        }
      },
    }),
  ],
  callbacks: {
    jwt({ token, user, trigger, session }) {
      if (user) {
        token.routeToken = user.accessToken;
        token.id = user.id;
        token.role = user.role;
        token.phone = user.phone;
      }
      if (trigger === 'update') {
        // Only refresh display fields. Account ID, role, and API token come from sign-in.
        if (typeof session?.name === 'string') token.name = session.name;
        if (typeof session?.email === 'string') token.email = session.email;
        if (typeof session?.phone === 'string') token.phone = session.phone;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.id = token.id;
        session.user.role = token.role;
        session.user.phone = token.phone;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
  // NEXTAUTH_SECRET
  secret: process.env.NEXTAUTH_SECRET,
};
