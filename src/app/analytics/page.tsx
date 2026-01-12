import { prisma } from "@/lib/prisma";
import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

type CasePersonLite = {
  role: string;
  playerId: string;
};

type CaseLite = {
  id: string;
  createdAt: Date;
  type: string;
  status: string;
  severity: number;
  people: CasePersonLite[];
};

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const casesRaw = await prisma.case.findMany({
    orderBy: { createdAt: "desc" },
    take: 250,
    select: {
      id: true,
      createdAt: true,
      type: true,
      status: true,
      severity: true,
      people: {
        select: {
          role: true,
          playerId: true,
        },
      },
    },
  });

  const cases = casesRaw as CaseLite[];

  const playerCounts = new Map<string, number>();

  for (const c of cases) {
    const accused = c.people?.find((p: CasePersonLite) => p.role === "accused");
    if (accused?.playerId) {
      playerCounts.set(accused.playerId, (playerCounts.get(accused.playerId) ?? 0) + 1);
    }
  }

  const mostReported = [...playerCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h5" fontWeight={900}>
          Analytics
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Quick insights based on recent case activity.
        </Typography>
      </Box>

      <Paper sx={{ p: 2.5 }}>
        <Typography fontWeight={900} sx={{ mb: 1.5 }}>
          Most Reported Players (Top 5)
        </Typography>

        {mostReported.length === 0 ? (
          <Typography color="text.secondary">No data yet.</Typography>
        ) : (
          <Stack spacing={1.25}>
            {mostReported.map(([playerId, count], idx) => (
              <Box
                key={playerId}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 2,
                  p: 1.25,
                  borderRadius: 2,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(18,18,24,0.40)",
                }}
              >
                <Box>
                  <Typography fontWeight={900}>
                    #{idx + 1} • {playerId}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Accused in {count} case{count === 1 ? "" : "s"}
                  </Typography>
                </Box>
                <Chip variant="outlined" label={`${count}`} />
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
