"use client";

import { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";

export default function LoginPage() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/";
  const { status } = useSession();

  useEffect(() => {
    // If not authenticated, instantly start Discord sign-in
    if (status === "unauthenticated") {
      signIn("discord", { callbackUrl });
    }
  }, [status, callbackUrl]);

  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 2 }}>
      <Paper sx={{ p: 3, width: "100%", maxWidth: 520 }}>
        <Stack spacing={1.5} alignItems="center">
          <Typography variant="h6" fontWeight={900}>
            Staff Panel
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Signing you in with Discord…
          </Typography>
          <CircularProgress />
        </Stack>
      </Paper>
    </Box>
  );
}
