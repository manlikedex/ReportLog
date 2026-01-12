export type StaffRole = "MODERATOR" | "ADMIN" | "MANAGEMENT";

export function roleFromDiscordRoleIds(roleIds: string[]): StaffRole | null {
  const mgmt = process.env.DISCORD_ROLE_MANAGEMENT;
  const admin = process.env.DISCORD_ROLE_ADMIN;
  const mod = process.env.DISCORD_ROLE_MODERATOR;

  // Highest wins
  if (mgmt && roleIds.includes(mgmt)) return "MANAGEMENT";
  if (admin && roleIds.includes(admin)) return "ADMIN";
  if (mod && roleIds.includes(mod)) return "MODERATOR";

  return null;
}

export async function fetchDiscordMemberRoleIds(discordUserId: string): Promise<string[]> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!guildId) throw new Error("Missing DISCORD_GUILD_ID");
  if (!botToken) throw new Error("Missing DISCORD_BOT_TOKEN");

  const url = `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${botToken}`,
      "Content-Type": "application/json",
    },
    cache: "no-store",
  });

  if (res.status === 404) {
    // user not in guild
    return [];
  }

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Discord member fetch failed (${res.status}): ${txt}`);
  }

  const json: any = await res.json();
  const roles: string[] = Array.isArray(json.roles) ? json.roles.map(String) : [];
  return roles;
}
