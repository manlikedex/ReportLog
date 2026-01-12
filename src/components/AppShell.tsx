"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import FolderIcon from "@mui/icons-material/Folder";
import PeopleIcon from "@mui/icons-material/People";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { signOut, useSession } from "next-auth/react";

const navItems = [
  { label: "Dashboard", href: "/", icon: <DashboardIcon fontSize="small" /> },
  { label: "Players", href: "/players", icon: <PeopleIcon fontSize="small" /> },
  { label: "Cases", href: "/cases", icon: <FolderIcon fontSize="small" /> },
  { label: "Audit", href: "/audit", icon: <FactCheckIcon fontSize="small" /> },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data } = useSession();

  const user: any = data?.user;
  const displayName = user?.name || user?.username || "Discord Member";
  const role = user?.role || "—";

  return (
    <Box sx={{ minHeight: "100vh", display: "flex" }}>
      {/* Sidebar */}
      <Paper
        square
        sx={{
          width: 290,
          p: 2,
          borderRight: "1px solid rgba(255,255,255,0.10)",
          background:
            "linear-gradient(180deg, rgba(18,18,24,0.78), rgba(12,12,16,0.62))",
        }}
      >
        <Stack spacing={1.5} sx={{ height: "100%" }}>
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6" fontWeight={900}>
                LURP Staff Tool
              </Typography>
              <Chip
                size="small"
                label="London Underworld RP"
                sx={{
                  borderColor: "rgba(255,138,31,0.30)",
                  backgroundColor: "rgba(255,138,31,0.10)",
                }}
              />
            </Stack>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Moderation & Case Management
            </Typography>
          </Box>

          {/* Member card */}
          <Paper
            variant="outlined"
            sx={{
              p: 1.5,
              background:
                "linear-gradient(135deg, rgba(255,138,31,0.10), rgba(18,18,24,0.65))",
              borderColor: "rgba(255,138,31,0.22)",
            }}
          >
            <Typography fontWeight={900} sx={{ lineHeight: 1.1 }}>
              {displayName}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap">
              <Chip size="small" variant="outlined" label={`Role: ${role}`} />
              {user?.discordId ? (
                <Chip size="small" variant="outlined" label={`Discord: ${user.discordId}`} />
              ) : null}
            </Stack>

            <Button
              onClick={() => signOut({ callbackUrl: "/login" })}
              size="small"
              variant="outlined"
              fullWidth
              sx={{ mt: 1.25 }}
            >
              Sign out
            </Button>
          </Paper>

          <Divider />

          {/* Navigation */}
          <List sx={{ p: 0 }}>
            {navItems.map((item) => {
              const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                  <ListItemButton
                    selected={active}
                    sx={{
                      borderRadius: 999,
                      mb: 0.75,
                      border: active ? "1px solid rgba(255,138,31,0.35)" : "1px solid transparent",
                      background: active
                        ? "linear-gradient(90deg, rgba(255,138,31,0.18), rgba(18,18,24,0.20))"
                        : "transparent",
                      "&.Mui-selected": {
                        background:
                          "linear-gradient(90deg, rgba(255,138,31,0.18), rgba(18,18,24,0.20))",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 36, color: active ? "primary.main" : "text.secondary" }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 800,
                        color: active ? "primary.main" : "text.primary",
                      }}
                    />
                  </ListItemButton>
                </Link>
              );
            })}
          </List>

          <Box sx={{ flex: 1 }} />

          <Typography variant="caption" color="text.secondary" sx={{ opacity: 0.8 }}>
            v0.1 • Staff Only
          </Typography>
        </Stack>
      </Paper>

      {/* Main area */}
      <Box sx={{ flex: 1 }}>
        {/* Top strip (subtle, matches banner tone) */}
        <Box
          sx={{
            height: 56,
            px: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            borderBottom: "1px solid rgba(255,255,255,0.10)",
            background:
              "linear-gradient(90deg, rgba(18,18,24,0.35), rgba(255,138,31,0.08))",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Staff Portal
          </Typography>
        </Box>

        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>
    </Box>
  );
}
