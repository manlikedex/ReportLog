import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Box,
  Button,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

export default async function CasesPage() {
  const cases = await prisma.case.findMany({
    select: {
      id: true,
      summary: true,
      type: true,
      status: true,
      severity: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
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
            Cases
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Staff reports, investigations, and actions
          </Typography>
        </Box>

        <Link href="/cases/new" style={{ textDecoration: "none" }}>
          <Button variant="contained">Create Case</Button>
        </Link>
      </Box>

      {/* Table */}
      <Paper sx={{ overflow: "hidden" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 900 }}>Summary</TableCell>
              <TableCell sx={{ fontWeight: 900, width: 180 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 900, width: 160 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 900, width: 120 }}>Severity</TableCell>
              <TableCell sx={{ fontWeight: 900, width: 220 }} align="right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {cases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <Typography variant="body2" color="text.secondary">
                    No cases have been created yet.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              cases.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>
                    <Typography fontWeight={800}>{c.summary}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {c.id}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip size="small" variant="outlined" label={c.type} />
                  </TableCell>

                  <TableCell>
                    <Chip size="small" variant="outlined" label={c.status} />
                  </TableCell>

                  <TableCell>
                    <Chip
                      size="small"
                      variant="outlined"
                      label={`Severity ${c.severity}`}
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <Link
                        href={`/cases/${c.id}`}
                        style={{ textDecoration: "none" }}
                      >
                        <Button size="small" variant="outlined">
                          Open
                        </Button>
                      </Link>

                      <Link
                        href={`/cases/${c.id}/edit`}
                        style={{ textDecoration: "none" }}
                      >
                        <Button size="small" variant="contained">
                          Edit
                        </Button>
                      </Link>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Stack>
  );
}
