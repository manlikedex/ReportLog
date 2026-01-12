import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PERMS } from "@/lib/authz";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!PERMS.canCreateCase(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const staffUserId = (session.user as any).id;
    if (!staffUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const {
      summary,
      type,
      status,
      severity,
      characterName,
      discordName,
      discordId,
      fivemIdentifier,
      rulesSelected,
    } = body;

    if (!summary || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const created = await prisma.case.create({
      data: {
        summary: String(summary),
        type,
        status: status ?? "OPEN",
        severity: Number(severity ?? 1),

        characterName: characterName || null,
        discordName: discordName || null,
        discordId: discordId ? String(discordId).trim() : null,
        fivemIdentifier: fivemIdentifier ? String(fivemIdentifier).trim() : null,

        rulesSelected: Array.isArray(rulesSelected) ? rulesSelected : [],

        createdBy: { connect: { id: staffUserId } },
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: created.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to create case" }, { status: 500 });
  }
}
