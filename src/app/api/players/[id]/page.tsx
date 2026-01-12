import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";

export default async function PlayerPage({
  params,
}: {
  params: Promise<{ id?: string }>;
}) {
  const { id } = await params;
  if (!id) return <div style={{ padding: 24 }}>Missing player ID</div>;

  const p = await prisma.player.findUnique({
    where: { id },
    include: {
      identifiers: true,
      caseLinks: {
        include: {
          c: true,
        },
        orderBy: { id: "desc" },
      },
    },
  });

  if (!p) return <div style={{ padding: 24 }}>Player not found</div>;

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={900}>
            Player Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {p.id}
          </Typography>
          <Chip sx={{ mt: 1 }} variant="outlined" label={p.currentName || "No name set"} />
        </Box>

        <Link href="/players" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Back</Button>
        </Link>
      </Box>

      <Paper sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1 }}>
          Identifiers
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {p.identifiers.length ? (
            p.identifiers.map((i) => (
              <Chip
                key={i.id}
                variant="outlined"
                label={`${i.type}: ${i.value}`}
              />
            ))
          ) : (
            <Typography color="text.secondary">No identifiers.</Typography>
          )}
        </Stack>
      </Paper>

      <Paper sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1 }}>
          Case History
        </Typography>

        <Stack spacing={1}>
          {p.caseLinks.length ? (
            p.caseLinks.map((link) => (
              <Paper key={link.id} variant="outlined" sx={{ p: 1.5 }}>
                <Stack direction="row" justifyContent="space-between" gap={2} alignItems="center">
                  <Box>
                    <Typography fontWeight={900}>{link.c.summary}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Role: {link.role} • {link.c.type} • {link.c.status} • Severity {link.c.severity}
                    </Typography>
                  </Box>
                  <Link href={`/cases/${link.caseId}`} style={{ textDecoration: "none" }}>
                    <Button size="small" variant="outlined">
                      Open
                    </Button>
                  </Link>
                </Stack>
              </Paper>
            ))
          ) : (
            <Typography color="text.secondary">No cases linked.</Typography>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}
