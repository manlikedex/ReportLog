import { prisma } from "@/lib/prisma";
import CaseEditor from "./ui";

export default async function EditCasePage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;

  if (!id) {
    return <div style={{ padding: 24 }}>Missing case ID</div>;
  }

  const c = await prisma.case.findUnique({ where: { id } });

  if (!c) {
    return <div style={{ padding: 24 }}>Case not found</div>;
  }

  return <CaseEditor initial={c as any} />;
}
