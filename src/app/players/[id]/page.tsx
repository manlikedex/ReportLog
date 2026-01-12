import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";

function fmtDate(d: any) {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleString();
  } catch {
    return String(d);
  }
}

export default async function PlayerPage({ params }: { params: any }) {
  const resolvedParams = await Promise.resolve(params);
  const idRaw = resolvedParams?.id;
  const id = typeof idRaw === "string" ? idRaw.trim() : "";

  if (!id || id === "undefined" || id === "null") {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ margin: 0 }}>Missing player ID</h2>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          This page requires a player ID in the URL, e.g. <code>/players/&lt;id&gt;</code>.
        </p>
        <Link href="/players">
          <Button variant="outlined">Back to Players</Button>
        </Link>
      </div>
    );
  }

  const player = await prisma.player.findUnique({
    where: { id },
    include: {
      identifiers: { orderBy: { lastSeen: "desc" } },
      aliases: { orderBy: { lastSeen: "desc" } },
      caseLinks: {
        include: { c: true }, // IMPORTANT so we can use link.c.id
        orderBy: { id: "desc" },
      },
      notes: { orderBy: { createdAt: "desc" } },
      flags: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!player) {
    return (
      <div style={{ padding: 24 }}>
        <h2 style={{ margin: 0 }}>Player not found</h2>
        <p style={{ opacity: 0.8, marginTop: 8 }}>
          No player exists for ID: <code>{id}</code>
        </p>
        <Link href="/players">
          <Button variant="outlined">Back to Players</Button>
        </Link>
      </div>
    );
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={900}>
            Player Profile
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {player.id}
          </Typography>

          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1 }}>
            <Chip variant="outlined" label={player.currentName || "Unnamed Player"} />
            <Chip variant="outlined" label={`Created: ${fmtDate(player.createdAt)}`} />
            <Chip variant="outlined" label={`Updated: ${fmtDate(player.updatedAt)}`} />
          </Stack>
        </Box>

        <Stack direction="row" spacing={1}>
          <Link href="/players" style={{ textDecoration: "none" }}>
            <Button variant="outlined">Back</Button>
          </Link>
          <Link href="/cases/new" style={{ textDecoration: "none" }}>
            <Button variant="contained">Create Case</Button>
          </Link>
        </Stack>
      </Box>

      <Paper sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1 }}>
          Identifiers
        </Typography>

        {player.identifiers.length ? (
          <Stack spacing={1}>
            {player.identifiers.map((i) => (
              <Paper key={i.id} variant="outlined" sx={{ p: 1.25 }}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={1} justifyContent="space-between">
                  <Typography>
                    <b>{i.type}</b>: {i.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    First: {fmtDate(i.firstSeen)} • Last: {fmtDate(i.lastSeen)}
                  </Typography>
                </Stack>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">No identifiers saved yet.</Typography>
        )}
      </Paper>

      <Paper sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1 }}>
          Case History
        </Typography>

        {player.caseLinks.length ? (
          <Stack spacing={1}>
            {player.caseLinks.map((link) => {
              const caseId = link?.c?.id; // ✅ use the related Case id, not caseId field
              return (
                <Paper key={link.id} variant="outlined" sx={{ p: 1.25 }}>
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1}
                    justifyContent="space-between"
                    alignItems={{ md: "center" }}
                  >
                    <Box>
                      <Typography fontWeight={900}>{link.c.summary}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Role: {link.role} • {link.c.type} • {link.c.status} • Severity {link.c.severity}
                      </Typography>
                    </Box>

                    {caseId ? (
                      <Link href={`/cases/${encodeURIComponent(caseId)}`} style={{ textDecoration: "none" }}>
                        <Button size="small" variant="outlined">
                          Open Case
                        </Button>
                      </Link>
                    ) : (
                      <Button size="small" variant="outlined" disabled>
                        Missing Case ID
                      </Button>
                    )}
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        ) : (
          <Typography color="text.secondary">No cases linked to this player yet.</Typography>
        )}
      </Paper>

      <Paper sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1 }}>
          Notes & Flags
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <Typography fontWeight={800} sx={{ mb: 1 }}>
          Flags
        </Typography>
        {player.flags.length ? (
          <Stack spacing={1} sx={{ mb: 2 }}>
            {player.flags.map((f) => (
              <Paper key={f.id} variant="outlined" sx={{ p: 1.25 }}>
                <Typography fontWeight={900}>
                  {f.flagType} (Severity {f.severity}) {f.active ? "" : "— inactive"}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Created: {fmtDate(f.createdAt)}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            No flags.
          </Typography>
        )}

        <Typography fontWeight={800} sx={{ mb: 1 }}>
          Notes
        </Typography>
        {player.notes.length ? (
          <Stack spacing={1}>
            {player.notes.map((n) => (
              <Paper key={n.id} variant="outlined" sx={{ p: 1.25 }}>
                <Typography>{n.note}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Visibility: {n.visibility} • Created: {fmtDate(n.createdAt)}
                </Typography>
              </Paper>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">No notes.</Typography>
        )}
      </Paper>
    </Stack>
  );
}
