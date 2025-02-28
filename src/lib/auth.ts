import { AuthOptions, getServerSession, Session, User } from "next-auth"
import Credentials from "next-auth/providers/credentials";
import { login } from "./db";
import { JWT } from "next-auth/jwt";

const authOptions: AuthOptions = {
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text" },
                password: {  label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials) return null;
                const result = await login(credentials.username, credentials.password);
                return result.data ?? null;
            },
        })
    ],
    pages: {
        signIn: "/login",
        signOut: "/logout",
        newUser: "/scrapbooks"
    },
    callbacks: {
        // Modify these (and types/next-auth.d.ts) to add additional user information
        async session({ session, token }: { session: Session; token: JWT }) {
            if (token) {
                session.user.name = token.name!;
                session.user.id = token.id! as string;
            }
            return session;
        },
        async jwt({ token, user }: {token: JWT; user: User}) {
            if (user) {
                token.name = user.name;
                token.id = user.id;
            }
            return token;
        },
    }
};

/**
 * Helper function to get the session on the server without having to import the authOptions object every single time
 * @returns The session object or null
 */
const getSession = () => getServerSession(authOptions)

export { authOptions, getSession }