import { Box, Typography } from "@mui/material";

export default function SectionHeader(props: { title: string; subtitle?: string }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800 }}>
        {props.title}
      </Typography>
      {props.subtitle ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3 }}>
          {props.subtitle}
        </Typography>
      ) : null}
    </Box>
  );
}
