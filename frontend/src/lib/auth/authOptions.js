import CredentialsProvider from 'next-auth/providers/credentials'
import { db } from '@/lib/db'

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                // Check if user exists
                let user = db.getUserByEmail(credentials.email)

                if (user) {
                    // Validate password
                    const isValid = db.validatePassword(user, credentials.password)
                    if (!isValid) return null
                } else {
                    // Start auto-registration for now? 
                    // The user asked for "create account", so we should probably NOT auto-register on login.
                    // But for "sign up with email only", usually there's a separate flow.
                    // However, `authorize` is often used for login.
                    // Let's assume login only checks existence.
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    image: user.image,
                }
            }
        })
    ],

    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id
            }
            return token
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id

                // Fetch fresh user data to get plan/tasks
                const dbUser = db.getUserByEmail(session.user.email)
                if (dbUser) {
                    session.user.plan = dbUser.plan
                    session.user.tasksUsedToday = dbUser.tasksUsedToday
                }
            }
            return session
        }
    },

    pages: {
        signIn: '/login',
        error: '/login',
    },

    session: {
        strategy: 'jwt',
    },

    secret: process.env.NEXTAUTH_SECRET,
}
