"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Slider,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { RULES, type RuleOption } from "@/lib/rules";

const CASE_TYPES = [
  { value: "PLAYER_REPORT", label: "Player Report" },
  { value: "STAFF_OBSERVATION", label: "Staff Observation" },
  { value: "APPEAL", label: "Appeal" },
  { value: "INVESTIGATION", label: "Investigation" },
];

const CASE_STATUS = [
  { value: "OPEN", label: "Open" },
  { value: "UNDER_REVIEW", label: "Under Review" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "APPEALED", label: "Appealed" },
];

const ruleToLabel = (r: RuleOption) => `${r.id} — ${r.title}`;

export default function CaseEditor({ initial }: { initial: any }) {
  const [summary, setSummary] = useState(initial.summary ?? "");
  const [type, setType] = useState(initial.type ?? "PLAYER_REPORT");
  const [status, setStatus] = useState(initial.status ?? "OPEN");
  const [severity, setSeverity] = useState<number>(initial.severity ?? 2);

  const [characterName, setCharacterName] = useState(initial.characterName ?? "");
  const [discordName, setDiscordName] = useState(initial.discordName ?? "");
  const [discordId, setDiscordId] = useState(initial.discordId ?? "");
  const [fivemIdentifier, setFiveMIdentifier] = useState(initial.fivemIdentifier ?? "");

  const initialRuleIds: string[] = Array.isArray(initial.rulesSelected) ? initial.rulesSelected : [];
  const initialRuleObjs = RULES.filter((r) => initialRuleIds.includes(r.id));
  const [rulesSelected, setRulesSelected] = useState<RuleOption[]>(initialRuleObjs);

  const [saving, setSaving] = useState(false);

  const dirty = useMemo(() => {
    const ruleIdsNow = rulesSelected.map((r) => r.id).sort().join(",");
    const ruleIdsInitial = initialRuleIds.slice().sort().join(",");

    return (
      summary !== (initial.summary ?? "") ||
      type !== (initial.type ?? "PLAYER_REPORT") ||
      status !== (initial.status ?? "OPEN") ||
      severity !== (initial.severity ?? 2) ||
      characterName !== (initial.characterName ?? "") ||
      discordName !== (initial.discordName ?? "") ||
      discordId !== (initial.discordId ?? "") ||
      fivemIdentifier !== (initial.fivemIdentifier ?? "") ||
      ruleIdsNow !== ruleIdsInitial
    );
  }, [
    summary,
    type,
    status,
    severity,
    characterName,
    discordName,
    discordId,
    fivemIdentifier,
    rulesSelected,
    initial,
    initialRuleIds,
  ]);

  async function save() {
    setSaving(true);
    try {
      const res = await fetch(`/api/cases/${initial.id}/update`, {
        method: "PATCH",
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

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert(data?.error ?? `Failed to save (HTTP ${res.status})`);
        return;
      }

      alert("Saved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Stack spacing={3}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 2 }}>
        <Box>
          <Typography variant="h5" fontWeight={900}>
            Edit Case
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {initial.id}
          </Typography>

          <Stack direction="row" spacing={1} sx={{ mt: 1.25 }} flexWrap="wrap">
            <Chip size="small" variant="outlined" label={status} />
            <Chip size="small" variant="outlined" label={type} />
            <Chip size="small" variant="outlined" label={`Severity ${severity}`} />
            {dirty ? <Chip size="small" color="secondary" label="Unsaved changes" /> : null}
          </Stack>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <Link href={`/cases/${initial.id}`} style={{ textDecoration: "none" }}>
            <Button variant="outlined">Cancel</Button>
          </Link>
          <Button variant="contained" disabled={!dirty || saving} onClick={save}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </Stack>
      </Box>

      <Paper sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={800}>
          Report Details
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Stack spacing={2} sx={{ maxWidth: 980 }}>
          <TextField label="Summary" value={summary} onChange={(e) => setSummary(e.target.value)} fullWidth />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField select label="Type" value={type} onChange={(e) => setType(e.target.value)} fullWidth>
              {CASE_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </TextField>

            <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
              {CASE_STATUS.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Divider />
          <Typography fontWeight={800}>Primary Player</Typography>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Character Name" value={characterName} onChange={(e) => setCharacterName(e.target.value)} fullWidth />
            <TextField label="Discord Name" value={discordName} onChange={(e) => setDiscordName(e.target.value)} fullWidth />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField label="Discord ID" value={discordId} onChange={(e) => setDiscordId(e.target.value)} fullWidth />
            <TextField label="FiveM Identifier" value={fivemIdentifier} onChange={(e) => setFiveMIdentifier(e.target.value)} fullWidth />
          </Stack>

          <Divider />
          <Typography fontWeight={800}>Rules Broken</Typography>

          <Autocomplete
            multiple
            options={RULES}
            value={rulesSelected}
            onChange={(_, v) => setRulesSelected(v)}
            groupBy={(opt) => opt.group}
            getOptionLabel={(opt) => ruleToLabel(opt)}
            filterSelectedOptions
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  size="small"
                  label={ruleToLabel(option)}
                  {...getTagProps({ index })}
                  key={option.id}
                />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} label="Select rules (multiple)" placeholder="Type to search rules..." />
            )}
          />

          <Divider />
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
              <Typography fontWeight={700}>Severity</Typography>
              <Chip size="small" variant="outlined" label={String(severity)} />
            </Stack>
            <Slider value={severity} onChange={(_, v) => setSeverity(v as number)} min={1} max={5} step={1} marks />
          </Box>
        </Stack>
      </Paper>
    </Stack>
  );
}
