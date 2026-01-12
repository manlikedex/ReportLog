import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (q.length < 2) return NextResponse.json({ results: [] });

  const results = await prisma.player.findMany({
    take: 25,
    where: {
      OR: [
        { currentName: { contains: q, mode: "insensitive" } },
        { aliases: { some: { name: { contains: q, mode: "insensitive" } } } },
        { identifiers: { some: { value: { contains: q, mode: "insensitive" } } } },
      ],
    },
    include: { identifiers: { take: 5, orderBy: { lastSeen: "desc" } } },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json({ results });
}
