import { prisma } from "../src/lib/prisma";

async function main() {
  await prisma.staffUser.upsert({
    where: { discordId: "PUT_YOUR_DISCORD_ID_HERE" },
    update: {},
    create: {
      discordId: "PUT_YOUR_DISCORD_ID_HERE",
      username: "Owner",
      role: "MANAGEMENT",
      active: true,
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
