import { Paper, Stack, Typography, Box } from "@mui/material";
import * as React from "react";

export default function StatCard(props: {
  title: string;
  value: string | number;
  subtitle?: string;
  footnote?: string;
  icon?: React.ReactNode;
  accent?: "primary" | "secondary";
}) {
  const { title, value, subtitle, footnote, icon, accent = "primary" } = props;

  return (
    <Paper
      sx={{
        p: 2.25,
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            accent === "primary"
              ? "radial-gradient(600px circle at 20% 0%, rgba(243,138,44,0.18), transparent 45%)"
              : "radial-gradient(600px circle at 20% 0%, rgba(193,65,16,0.18), transparent 45%)",
        }}
      />

      <Stack direction="row" spacing={2} alignItems="center" sx={{ position: "relative" }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            display: "grid",
            placeItems: "center",
            border: "1px solid",
            borderColor: "divider",
            backgroundColor:
              accent === "primary" ? "rgba(243,138,44,0.10)" : "rgba(193,65,16,0.10)",
            color: accent === "primary" ? "primary.main" : "secondary.main",
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>

          <Typography variant="h5" sx={{ fontWeight: 900, mt: 0.2, lineHeight: 1.1 }}>
            {value}
          </Typography>

          {subtitle ? (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          ) : null}

          {footnote ? (
            <Typography variant="caption" sx={{ display: "block", opacity: 0.7, mt: 0.35 }}>
              {footnote}
            </Typography>
          ) : null}
        </Box>
      </Stack>
    </Paper>
  );
}
