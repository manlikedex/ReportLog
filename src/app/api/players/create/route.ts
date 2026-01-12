import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();

  const name = String(body?.name ?? "").trim();
  const license = String(body?.license ?? "").trim();

  if (!license) {
    return NextResponse.json({ error: "license required" }, { status: 400 });
  }

  // Create player + identifier (license is unique)
  const player = await prisma.player.create({
    data: {
      currentName: name || null,
      identifiers: {
        create: {
          type: "LICENSE",
          value: license,
        },
      },
      aliases: name
        ? {
            create: {
              name,
            },
          }
        : undefined,
    },
    include: { identifiers: true },
  });

  return NextResponse.json({ player });
}
