import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

export default async function PlayersPage() {
  const players = await prisma.player.findMany({
    orderBy: { updatedAt: "desc" },
    take: 50,
    select: {
      id: true,
      currentName: true,
      updatedAt: true,
      identifiers: {
        orderBy: { lastSeen: "desc" },
        select: {
          id: true,
          type: true,
          value: true,
        },
      },
      _count: {
        select: {
          caseLinks: true,
        },
      },
    },
  });

  return (
    <Stack spacing={3}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={900}>
            Players
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Linked identities and case history
          </Typography>
        </Box>

        <Link href="/cases/new" style={{ textDecoration: "none" }}>
          <Button variant="contained">Create Case</Button>
        </Link>
      </Box>

      {/* List */}
      <Paper sx={{ p: 2.5 }}>
        {players.length ? (
          <Stack spacing={1}>
            {players.map((p) => {
              const discord = p.identifiers.find(
                (i) => i.type === "DISCORD"
              )?.value;

              const license = p.identifiers.find(
                (i) => i.type === "LICENSE"
              )?.value;

              return (
                <Paper
                  key={p.id}
                  variant="outlined"
                  sx={{ p: 1.5 }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    justifyContent="space-between"
                    alignItems={{ md: "center" }}
                  >
                    <Box>
                      <Typography fontWeight={900}>
                        {p.currentName || "Unnamed Player"}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Player ID: {p.id}
                      </Typography>

                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ mt: 1 }}
                        flexWrap="wrap"
                      >
                        <Chip
                          size="small"
                          variant="outlined"
                          label={`${p._count.caseLinks} case(s)`}
                        />

                        {discord && (
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`Discord: ${discord}`}
                          />
                        )}

                        {license && (
                          <Chip
                            size="small"
                            variant="outlined"
                            label={`License: ${license}`}
                          />
                        )}
                      </Stack>
                    </Box>

                    {/* Open profile */}
                    <Link
                      href={`/players/${encodeURIComponent(p.id)}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Button size="small" variant="outlined">
                        Open
                      </Button>
                    </Link>
                  </Stack>
                </Paper>
              );
            })}
          </Stack>
        ) : (
          <Typography color="text.secondary">
            No players found yet. Players are created automatically when cases are filed.
          </Typography>
        )}
      </Paper>
    </Stack>
  );
}
