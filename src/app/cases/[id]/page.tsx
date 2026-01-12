import { prisma } from "@/lib/prisma";
import CaseView from "./view";

export default async function CasePage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;

  if (!id) return <div style={{ padding: 24 }}>Missing case ID</div>;

  const c = await prisma.case.findUnique({
    where: { id },
    include: {
      actions: { orderBy: { createdAt: "desc" } },
      evidence: { orderBy: { createdAt: "desc" } },
      people: {
        include: {
          p: {
            include: {
              identifiers: true,
            },
          },
        },
      },
    },
  });

  if (!c) return <div style={{ padding: 24 }}>Case not found</div>;

  return <CaseView caseData={c as any} />;
}
