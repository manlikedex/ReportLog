import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { RULES_BY_ID } from "@/lib/rules";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";

export default async function AnalyticsPage() {
  const cases = await prisma.case.findMany({
    select: {
      id: true,
      rulesSelected: true,
      createdAt: true,
      people: {
        select: {
          role: true,
          playerId: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 1000, // last 1000 cases (adjust later)
  });

  // Top rules
  const ruleCounts = new Map<string, number>();
  for (const c of cases) {
    const ids: string[] = Array.isArray(c.rulesSelected) ? (c.rulesSelected as any) : [];
    for (const rid of ids) {
      ruleCounts.set(rid, (ruleCounts.get(rid) || 0) + 1);
    }
  }

  const topRules = [...ruleCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([id, count]) => {
      const r = RULES_BY_ID.get(id);
      return { id, title: r ? `${r.id} — ${r.title}` : id, count };
    });

  // Repeat offenders (linked accused)
  const playerCounts = new Map<string, number>();
  for (const c of cases) {
    const accused = c.people?.find((p) => p.role === "accused");
    if (accused?.playerId) {
      playerCounts.set(accused.playerId, (playerCounts.get(accused.playerId) || 0) + 1);
    }
  }

  const topPlayers = [...playerCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([playerId, count]) => ({ playerId, count }));

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={900}>
            Analytics
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Rule trends and repeat offenders
          </Typography>
        </Box>

        <Link href="/" style={{ textDecoration: "none" }}>
          <Button variant="outlined">Back</Button>
        </Link>
      </Box>

      <Paper sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1 }}>
          Most Broken Rules (Top 15)
        </Typography>

        {topRules.length ? (
          <Stack spacing={1}>
            {topRules.map((r) => (
              <Box key={r.id} sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
                <Chip variant="outlined" label={r.title} />
                <Typography fontWeight={900}>{r.count}</Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">No rule data yet.</Typography>
        )}
      </Paper>

      <Paper sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1 }}>
          Repeat Offenders (Top 10 linked players)
        </Typography>

        {topPlayers.length ? (
          <Stack spacing={1}>
            {topPlayers.map((p) => (
              <Box key={p.playerId} sx={{ display: "flex", justifyContent: "space-between", gap: 2, alignItems: "center" }}>
                <Link href={`/players/${p.playerId}`} style={{ textDecoration: "none" }}>
                  <Button size="small" variant="outlined">
                    {p.playerId}
                  </Button>
                </Link>
                <Typography fontWeight={900}>{p.count} cases</Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary">No player links yet.</Typography>
        )}
      </Paper>
    </Stack>
  );
}
