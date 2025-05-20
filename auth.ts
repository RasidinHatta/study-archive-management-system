import NextAuth from "next-auth"
import authConfig from "./auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter"
import db from "./prisma/prisma"
import { getUserById } from "./data/user"
import { getAccountByUserId } from "./data/account"
import { getTwoFactorConfirmationByUserId } from "./data/verification-token"
import { Role } from "./lib/generated/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    basePath: "/api/auth",
    session: {
        strategy: "jwt",
        maxAge: 60 * 120, // 30 minutes
        updateAge: 60 * 10,
    },
    jwt: {
        maxAge: 60 * 120,
    },
    ...authConfig,
    callbacks: {
        async signIn({ user, account, profile }) {
            const email = user.email?.toLowerCase();
            if (!email || !account) return false;

            if (account.provider === 'google') {
                // Check for existing user by email
                let existingUser = await db.user.findUnique({ where: { email } });

                if (existingUser) {
                    // Check if the user already has a linked Google account
                    const existingAccount = await db.account.findFirst({
                        where: {
                            userId: existingUser.id,
                            provider: 'google',
                        },
                    });

                    if (!existingAccount) {
                        // Link the Google account to existing user
                        await db.account.create({
                            data: {
                                userId: existingUser.id,
                                type: account.type,
                                provider: account.provider,
                                providerAccountId: account.providerAccountId,
                                access_token: account.access_token,
                                token_type: account.token_type,
                                id_token: account.id_token,
                                expires_at: account.expires_at,
                                refresh_token: account.refresh_token,
                                scope: account.scope,
                            },
                        });
                    }

                    return true;
                } else {
                    // If user does not exist, create one
                    const role = email.endsWith("@graduate.utm.my") ? Role.USER : Role.PUBLICUSER;

                    existingUser = await db.user.create({
                        data: {
                            email,
                            name: user.name ?? '',
                            image: user.image,
                            emailVerified: new Date(),
                            role,
                        },
                    });

                    await db.account.create({
                        data: {
                            userId: existingUser.id,
                            type: account.type,
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            access_token: account.access_token,
                            token_type: account.token_type,
                            id_token: account.id_token,
                            expires_at: account.expires_at,
                            refresh_token: account.refresh_token,
                            scope: account.scope,
                        },
                    });

                    return true;
                }
            }

            // Handle credentials-based login and 2FA as usual
            const existingUser = await getUserById(user.id as string);
            if (!existingUser?.emailVerified) return false;

            if (existingUser.twoFactorEnabled) {
                const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
                if (!twoFactorConfirmation) return false;

                await db.twoFactorConfirmation.delete({
                    where: { id: twoFactorConfirmation.id },
                });
            }

            return true;
        },

        async jwt({ token }) {
            if (!token.sub) return token;
            const existingUser = await getUserById(token.sub);
            if (!existingUser) return token;

            const existingAccount = await getAccountByUserId(existingUser.id);
            token.isOauth = !!existingAccount;
            token.name = existingUser.name;
            token.email = existingUser.email;
            token.image = existingUser.image;
            token.twoFactorEnabled = existingUser.twoFactorEnabled;
            token.emailVerified = existingUser.emailVerified;
            token.role = existingUser.role;

            return token;
        },

        async session({ token, session }) {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    isOauth: token.isOauth,
                    twoFactorEnabled: token.twoFactorEnabled,
                    emailVerified: token.emailVerified,
                    image: token.image as string,
                    role: token.role as Role,
                },
            };
        }
    }
})