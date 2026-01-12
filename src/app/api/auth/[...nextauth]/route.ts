import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { prisma } from "@/lib/prisma";
import { fetchDiscordMemberRoleIds, roleFromDiscordRoleIds } from "@/lib/discord-rbac";

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },

  callbacks: {
    async signIn({ profile }) {
      const discordId = profile?.id ? String(profile.id) : null;
      if (!discordId) return false;

      // Pull roles from your Discord guild via bot
      const roleIds = await fetchDiscordMemberRoleIds(discordId);
      const mappedRole = roleFromDiscordRoleIds(roleIds);

      // If user doesn't have any allowed staff roles => block sign-in
      if (!mappedRole) return false;

      const username =
        (profile as any)?.global_name ||
        (profile as any)?.username ||
        null;

      // Upsert staff user so DB always matches Discord role membership
      await prisma.staffUser.upsert({
        where: { discordId },
        update: {
          username,
          role: mappedRole,
          active: true,
          lastLoginAt: new Date(),
        },
        create: {
          discordId,
          username,
          role: mappedRole,
          active: true,
          lastLoginAt: new Date(),
        },
      });

      return true;
    },

    async jwt({ token, profile }) {
      // On login, attach StaffUser info to JWT
      if (profile?.id) {
        const discordId = String(profile.id);

        const staff = await prisma.staffUser.findUnique({
          where: { discordId },
          select: { id: true, role: true, discordId: true, active: true },
        });

        if (staff && staff.active) {
          (token as any).staffUserId = staff.id;
          (token as any).staffRole = staff.role;
          (token as any).discordId = staff.discordId;
        } else {
          // If deactivated in DB, block permissions
          (token as any).staffUserId = null;
          (token as any).staffRole = null;
          (token as any).discordId = discordId;
        }
      }

      return token;
    },

    async session({ session, token }) {
      const s: any = session;
      s.user = s.user || {};
      s.user.id = (token as any).staffUserId || null;
      s.user.role = (token as any).staffRole || null;
      s.user.discordId = (token as any).discordId || null;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
