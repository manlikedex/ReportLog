import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PERMS } from "@/lib/authz";

export async function POST(req: Request, ctx: { params: Promise<{ id?: string }> }) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!PERMS.canEditCase(role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const staffUserId = (session.user as any).id;
    if (!staffUserId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await ctx.params;
    if (!id) return NextResponse.json({ error: "Missing case id" }, { status: 400 });

    const body = await req.json();

    const updated = await prisma.case.update({
      where: { id },
      data: {
        summary: body.summary ?? undefined,
        type: body.type ?? undefined,
        status: body.status ?? undefined,
        severity: body.severity !== undefined ? Number(body.severity) : undefined,

        characterName: body.characterName ?? undefined,
        discordName: body.discordName ?? undefined,
        discordId: body.discordId ?? undefined,
        fivemIdentifier: body.fivemIdentifier ?? undefined,

        rulesSelected: Array.isArray(body.rulesSelected) ? body.rulesSelected : undefined,
      },
      select: { id: true },
    });

    return NextResponse.json({ ok: true, id: updated.id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update case" }, { status: 500 });
  }
}
