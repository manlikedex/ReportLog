"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { RULES, RuleOption } from "@/lib/rules";

export default function NewCasePage() {
  const router = useRouter();

  // core case fields
  const [summary, setSummary] = useState("");
  const [type, setType] = useState("PLAYER_REPORT");
  const [status, setStatus] = useState("OPEN");
  const [severity, setSeverity] = useState(1);

  // player fields
  const [characterName, setCharacterName] = useState("");
  const [discordName, setDiscordName] = useState("");
  const [discordId, setDiscordId] = useState("");
  const [fivemIdentifier, setFivemIdentifier] = useState("");

  // rules
  const [rulesSelected, setRulesSelected] = useState<RuleOption[]>([]);

  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!summary.trim()) {
      alert("Summary is required");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/cases/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          summary,
          type,
          status,
          severity,

          characterName,
          discordName,
          discordId,
          fivemIdentifier,

          rulesSelected: rulesSelected.map((r) => r.id),
        }),
      });

      const raw = await res.text();
      let data: any = {};
      try {
        data = raw ? JSON.parse(raw) : {};
      } catch {
        // non-json response (shouldn't happen, but safe)
      }

      if (!res.ok) {
        console.error("Create case failed:", res.status, raw);
        alert(data?.error || `Create failed (HTTP ${res.status})`);
        return;
      }

      const id =
        data?.id ||
        data?.case?.id ||
        data?.created?.id ||
        (data?.ok && data?.id) ||
        null;

      if (!id) {
        console.error("Create succeeded but no ID returned:", data, raw);
        alert("Case created but no ID returned. Check console.");
        return;
      }

      router.push(`/cases/${id}`);
    } catch (err: any) {
      console.error("handleCreate crashed:", err);
      alert(err?.message || "Create request crashed. Check console.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto" }}>
      <Typography variant="h5" fontWeight={900} sx={{ mb: 2 }}>
        Create Case
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          {/* Case basics */}
          <TextField
            label="Summary"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              select
              label="Case Type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              fullWidth
            >
              <MenuItem value="PLAYER_REPORT">Player Report</MenuItem>
              <MenuItem value="STAFF_OBSERVATION">Staff Observation</MenuItem>
              <MenuItem value="APPEAL">Appeal</MenuItem>
              <MenuItem value="INVESTIGATION">Investigation</MenuItem>
            </TextField>

            <TextField
              select
              label="Status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              fullWidth
            >
              <MenuItem value="OPEN">Open</MenuItem>
              <MenuItem value="UNDER_REVIEW">Under Review</MenuItem>
              <MenuItem value="RESOLVED">Resolved</MenuItem>
              <MenuItem value="APPEALED">Appealed</MenuItem>
            </TextField>

            <TextField
              type="number"
              label="Severity (1–5)"
              inputProps={{ min: 1, max: 5 }}
              value={severity}
              onChange={(e) => setSeverity(Number(e.target.value))}
              fullWidth
            />
          </Stack>

          {/* Player details */}
          <Typography fontWeight={800}>Primary Player</Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Character Name"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              fullWidth
            />
            <TextField
              label="Discord Name"
              value={discordName}
              onChange={(e) => setDiscordName(e.target.value)}
              fullWidth
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Discord ID"
              value={discordId}
              onChange={(e) => setDiscordId(e.target.value)}
              fullWidth
            />
            <TextField
              label="FiveM Identifier (license)"
              value={fivemIdentifier}
              onChange={(e) => setFivemIdentifier(e.target.value)}
              fullWidth
            />
          </Stack>

          {/* Rules */}
          <Typography fontWeight={800}>Rules Broken</Typography>

          <Autocomplete
            multiple
            options={RULES}
            value={rulesSelected}
            onChange={(_, v) => setRulesSelected(v)}
            groupBy={(o) => o.group}
            getOptionLabel={(o) => `${o.id} — ${o.title}`}
            isOptionEqualToValue={(a, b) => a.id === b.id}
            renderInput={(params) => (
              <TextField {...params} label="Select rules" />
            )}
          />

          {/* Actions */}
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => router.push("/cases")}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={saving}
              onClick={handleCreate}
            >
              {saving ? "Creating…" : "Create Case"}
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
