"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Divider,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const ACTION_TYPES = ["WARNING", "KICK", "BAN", "RESTRICTION", "NOTE"];
const EVIDENCE_KINDS = ["LINK", "TEXT"];

export default function CaseInteractive({ caseId }: { caseId: string }) {
  const router = useRouter();

  const [actionType, setActionType] = useState("WARNING");
  const [actionReason, setActionReason] = useState("");
  const [actionDuration, setActionDuration] = useState("");

  const [evKind, setEvKind] = useState("LINK");
  const [evValue, setEvValue] = useState("");

  const [busy, setBusy] = useState(false);

  async function addAction() {
    if (!actionReason.trim()) return alert("Action reason is required");

    setBusy(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: actionType,
          reason: actionReason,
          duration: actionDuration || undefined,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) return alert(data?.error || "Failed to add action");

      setActionReason("");
      setActionDuration("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function addEvidence() {
    if (!evValue.trim()) return alert("Evidence value is required");

    setBusy(true);
    try {
      const res = await fetch(`/api/cases/${caseId}/evidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: evKind, value: evValue }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) return alert(data?.error || "Failed to add evidence");

      setEvValue("");
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Paper sx={{ p: 2.5 }}>
      <Typography fontWeight={900}>Staff Tools</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Add actions and attach evidence to this case.
      </Typography>

      <Stack spacing={2}>
        <Box>
          <Typography fontWeight={800} sx={{ mb: 1 }}>
            Add Action
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField select label="Type" value={actionType} onChange={(e) => setActionType(e.target.value)} fullWidth>
              {ACTION_TYPES.map((t) => (
                <MenuItem key={t} value={t}>{t}</MenuItem>
              ))}
            </TextField>

            <TextField
              label="Duration (optional)"
              placeholder="e.g. 3d / 12h / perm"
              value={actionDuration}
              onChange={(e) => setActionDuration(e.target.value)}
              fullWidth
            />
          </Stack>

          <TextField
            sx={{ mt: 2 }}
            label="Reason"
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            fullWidth
            multiline
            minRows={2}
          />

          <Button sx={{ mt: 2 }} variant="contained" disabled={busy} onClick={addAction}>
            Add Action
          </Button>
        </Box>

        <Divider />

        <Box>
          <Typography fontWeight={800} sx={{ mb: 1 }}>
            Add Evidence
          </Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField select label="Kind" value={evKind} onChange={(e) => setEvKind(e.target.value)} fullWidth>
              {EVIDENCE_KINDS.map((k) => (
                <MenuItem key={k} value={k}>{k}</MenuItem>
              ))}
            </TextField>

            <TextField
              label={evKind === "LINK" ? "URL" : "Text"}
              value={evValue}
              onChange={(e) => setEvValue(e.target.value)}
              fullWidth
            />
          </Stack>

          <Button sx={{ mt: 2 }} variant="contained" disabled={busy} onClick={addEvidence}>
            Add Evidence
          </Button>
        </Box>
      </Stack>
    </Paper>
  );
}
