import NextAuth, { type NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TEMP DEMO USER (for testing)
        if (
          credentials?.email === "test@demo.com" &&
          credentials?.password === "test123"
        ) {
          return {
            id: "1",
            name: "Demo User",
            email: "test@demo.com",
          }
        }

        return null
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Auto-create user on first Google sign-in (mock for now)
        console.log("New Google user:", user.email)
      }
      return true
    },

    async session({ session, token }) {
      // Attach user info if needed later
      return session
    },

    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }