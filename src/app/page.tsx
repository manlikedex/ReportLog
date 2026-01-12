import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { RULES } from "@/lib/rules";

function buildRulesMap() {
  const map = new Map<string, { id: string; title: string; group?: string }>();
  for (const r of RULES) {
    map.set(r.id, { id: r.id, title: r.title, group: (r as any).group });
  }
  return map;
}

export default async function DashboardPage() {
  // --- Stats
  const [
    totalCases,
    openCases,
    underReviewCases,
    totalPlayers,
    totalActions,
    totalEvidence,
  ] = await Promise.all([
    prisma.case.count(),
    prisma.case.count({ where: { status: "OPEN" } }),
    prisma.case.count({ where: { status: "UNDER_REVIEW" } }),
    prisma.player.count(),
    prisma.caseAction.count(),
    prisma.caseEvidence.count(),
  ]);

  // --- Recent activity
  const recentCases = await prisma.case.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      summary: true,
      type: true,
      status: true,
      severity: true,
      createdAt: true,
      characterName: true,
      discordName: true,
    },
  });

  const recentActions = await prisma.caseAction.findMany({
    orderBy: { createdAt: "desc" },
    take: 8,
    select: {
      id: true,
      caseId: true,
      type: true,
      reason: true,
      duration: true,
      createdAt: true,
    },
  });

  // --- Most broken rules (Top 5)
  // Pull a reasonable window of cases for aggregation (fast + accurate enough)
  const ruleWindow = await prisma.case.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    select: {
      rulesSelected: true,
    },
  });

  const rulesMap = buildRulesMap();
  const counts = new Map<string, number>();

  for (const row of ruleWindow) {
    const rs: any = row.rulesSelected;

    // Prisma Json can come through as array, object, null
    const arr: string[] = Array.isArray(rs)
      ? rs.map((x) => String(x))
      : [];

    for (const id of arr) {
      if (!id) continue;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }

  const topRules = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id, count]) => {
      const meta = rulesMap.get(id);
      return {
        id,
        count,
        title: meta?.title ?? "Unknown rule",
        group: meta?.group,
      };
    });

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box>
        <Typography variant="h5" fontWeight={900}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Staff overview and recent moderation activity
        </Typography>
      </Box>

      {/* Stats */}
      <Stack direction={{ xs: "column", md: "row" }} spacing={2} flexWrap="wrap">
        <StatCard title="Total Cases" value={totalCases} subtitle="All time" />
        <StatCard title="Open" value={openCases} subtitle="Needs attention" />
        <StatCard title="Under Review" value={underReviewCases} subtitle="In progress" />
        <StatCard title="Players" value={totalPlayers} subtitle="Linked identities" />
        <StatCard title="Actions Logged" value={totalActions} subtitle="Warnings / bans / notes" />
        <StatCard title="Evidence Items" value={totalEvidence} subtitle="Links / text" />
      </Stack>

      {/* Top Rules */}
      <Paper sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography fontWeight={900}>Most Broken Rules (Top 5)</Typography>
            <Typography variant="body2" color="text.secondary">
              Based on the most recent 500 cases
            </Typography>
          </Box>
        </Box>

        <Stack spacing={1.25} sx={{ mt: 2 }}>
          {topRules.length ? (
            topRules.map((r) => (
              <Paper key={r.id} variant="outlined" sx={{ p: 1.5 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ md: "center" }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={900} noWrap>
                      {r.id} — {r.title}
                    </Typography>
                    {r.group ? (
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {r.group}
                      </Typography>
                    ) : null}
                  </Box>

                  <Chip
                    size="small"
                    variant="outlined"
                    label={`${r.count} case(s)`}
                  />
                </Stack>
              </Paper>
            ))
          ) : (
            <Typography color="text.secondary">
              No rules selected yet. Once staff start selecting rules in cases, this will populate.
            </Typography>
          )}
        </Stack>
      </Paper>

      <Divider />

      {/* Recent Cases */}
      <Paper sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography fontWeight={900}>Recent Cases</Typography>
            <Typography variant="body2" color="text.secondary">
              Latest reports created by staff
            </Typography>
          </Box>

          <Link href="/cases" style={{ textDecoration: "none" }}>
            <Button size="small" variant="outlined">
              View all
            </Button>
          </Link>
        </Box>

        <Stack spacing={1.25} sx={{ mt: 2 }}>
          {recentCases.length ? (
            recentCases.map((c) => (
              <Paper key={c.id} variant="outlined" sx={{ p: 1.5 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ md: "center" }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={900} noWrap>
                      {c.summary}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {c.characterName || c.discordName || "—"} • {c.type} • Severity {c.severity}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                      <Chip size="small" variant="outlined" label={c.status} />
                      <Chip
                        size="small"
                        variant="outlined"
                        label={new Date(c.createdAt).toLocaleString()}
                      />
                    </Stack>
                  </Box>

                  <Link href={`/cases/${encodeURIComponent(c.id)}`} style={{ textDecoration: "none" }}>
                    <Button size="small" variant="outlined">
                      Open
                    </Button>
                  </Link>
                </Stack>
              </Paper>
            ))
          ) : (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              No cases yet.
            </Typography>
          )}
        </Stack>
      </Paper>

      {/* Recent Actions */}
      <Paper sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 2 }}>
          <Box>
            <Typography fontWeight={900}>Recent Actions</Typography>
            <Typography variant="body2" color="text.secondary">
              Latest staff actions recorded
            </Typography>
          </Box>

          <Link href="/cases" style={{ textDecoration: "none" }}>
            <Button size="small" variant="outlined">
              Go to cases
            </Button>
          </Link>
        </Box>

        <Stack spacing={1.25} sx={{ mt: 2 }}>
          {recentActions.length ? (
            recentActions.map((a) => (
              <Paper key={a.id} variant="outlined" sx={{ p: 1.5 }}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ md: "center" }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={900}>
                      {a.type}
                      {a.duration ? ` • ${a.duration}` : ""}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {a.reason}
                    </Typography>

                    <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
                      <Chip
                        size="small"
                        variant="outlined"
                        label={new Date(a.createdAt).toLocaleString()}
                      />
                      <Chip size="small" variant="outlined" label={`Case: ${a.caseId}`} />
                    </Stack>
                  </Box>

                  <Link href={`/cases/${encodeURIComponent(a.caseId)}`} style={{ textDecoration: "none" }}>
                    <Button size="small" variant="outlined">
                      Open case
                    </Button>
                  </Link>
                </Stack>
              </Paper>
            ))
          ) : (
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              No actions yet.
            </Typography>
          )}
        </Stack>
      </Paper>
    </Stack>
  );
}

function StatCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: number;
  subtitle?: string;
}) {
  return (
    <Paper sx={{ p: 2, flex: 1, minWidth: 220 }}>
      <Typography variant="body2" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight={900} sx={{ mt: 0.5 }}>
        {value}
      </Typography>
      {subtitle ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          {subtitle}
        </Typography>
      ) : null}
    </Paper>
  );
}
