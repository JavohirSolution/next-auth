import { AuthOptions } from "next-auth";

import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { connectDatabase } from "./mongoose";
import User from "@/database/user.model";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                await connectDatabase();
                const user = await User.findOne({
                    email: credentials?.email
                })
                return user
            }
        }),
        GitHubProvider({
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!
        })
    ],
    callbacks: {
        async session({ session }: any) {
            await connectDatabase()
            const isExistUser = await User.findOne({ email: session.user.email });
            if (!isExistUser) {
                const newUser = await User.create({
                    email: session.user.email,
                    username: session.user.name,
                    profileImage: session.user.image,
                });
                session.currentUser = newUser;
            }
            session.currentUser = isExistUser;
            return session
        }
    },
    session: { strategy: "jwt" },
    jwt: { secret: process.env.NEXT_JWT_SECRET },
    secret: process.env.NEXTAUTH_SECRET!
}