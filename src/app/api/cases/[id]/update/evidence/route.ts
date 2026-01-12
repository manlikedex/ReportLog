import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id?: string }> }
) {
  const { id } = await params;

  if (!id) return NextResponse.json({ error: "Missing case ID" }, { status: 400 });

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });

  const { kind, value } = body;
  if (!kind || !value) {
    return NextResponse.json({ error: "Missing kind/value" }, { status: 400 });
  }

  const created = await prisma.caseEvidence.create({
    data: {
      caseId: id,
      kind: String(kind).toUpperCase(), // "LINK/TEXT"
      value: String(value),
      createdBy: session.user.id,
    },
  });

  return NextResponse.json({ ok: true, evidence: created });
}
