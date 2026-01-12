"use client";

import Link from "next/link";
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import { RULES } from "@/lib/rules";
import { useSession } from "next-auth/react";
import { PERMS } from "@/lib/authz";

function val(v: any) {
  if (v === null || v === undefined) return "—";
  const s = String(v).trim();
  return s.length ? s : "—";
}

const RULES_BY_ID = new Map(RULES.map((r) => [r.id, r]));

export default function CaseView({ caseData }: { caseData: any }) {
  const { data } = useSession();
  const role = (data?.user as any)?.role;

  const ruleIds: string[] = Array.isArray(caseData.rulesSelected) ? caseData.rulesSelected : [];
  const canEdit = PERMS.canEditCase(role);

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={900}>
            Case Report (View Only)
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {caseData.id}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1.25 }} flexWrap="wrap">
            <Chip size="small" variant="outlined" label={val(caseData.status)} />
            <Chip size="small" variant="outlined" label={val(caseData.type)} />
            <Chip size="small" variant="outlined" label={`Severity ${val(caseData.severity)}`} />
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.25}>
          <Link href="/cases" style={{ textDecoration: "none" }}>
            <Button variant="outlined">Back</Button>
          </Link>

          {canEdit ? (
            <Link href={`/cases/${caseData.id}/edit`} style={{ textDecoration: "none" }}>
              <Button variant="contained">Edit</Button>
            </Link>
          ) : null}
        </Stack>
      </Box>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2.25}>
          <Section title="Summary">
            <Typography>{val(caseData.summary)}</Typography>
          </Section>

          <Divider />

          <Section title="Primary Player Details">
            <KeyValue label="Character Name" value={caseData.characterName} />
            <KeyValue label="Discord Name" value={caseData.discordName} />
            <KeyValue label="Discord ID" value={caseData.discordId} />
            <KeyValue label="FiveM Identifier" value={caseData.fivemIdentifier} />
          </Section>

          <Divider />

          <Section title="Rules Broken">
            {ruleIds.length ? (
              <Stack spacing={1.25}>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  {ruleIds.map((id) => {
                    const r = RULES_BY_ID.get(id);
                    const label = r ? `${r.id} — ${r.title}` : id;
                    return <Chip key={id} size="small" variant="outlined" label={label} />;
                  })}
                </Stack>

                <Box sx={{ opacity: 0.9 }}>
                  {ruleIds.map((id) => {
                    const r = RULES_BY_ID.get(id);
                    if (!r) return null;
                    return (
                      <Typography key={`desc-${id}`} variant="body2" sx={{ mb: 0.5 }}>
                        <b>{r.id}:</b> {r.description}
                      </Typography>
                    );
                  })}
                </Box>
              </Stack>
            ) : (
              <Typography color="text.secondary">—</Typography>
            )}
          </Section>

          <Divider />

          <Section title="Metadata">
            <KeyValue label="Created At" value={caseData.createdAt ? String(caseData.createdAt) : "—"} />
            <KeyValue label="Updated At" value={caseData.updatedAt ? String(caseData.updatedAt) : "—"} />
          </Section>
        </Stack>
      </Paper>
    </Stack>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography fontWeight={900} sx={{ mb: 0.75 }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

function KeyValue({ label, value }: { label: string; value: any }) {
  return (
    <Typography sx={{ mb: 0.25 }}>
      <b>{label}:</b> {val(value)}
    </Typography>
  );
}
