import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/system';

export const Divider = ({ sx = {}, lineColor = '100', textColor = '700', text = 'OR' }) => {
  const theme = useTheme();
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 2, ...sx }}>
      <Box sx={{ height: 1, borderBottom: `1px solid ${theme.palette.grey[lineColor]}`, flexGrow: 1 }} />
      <Typography sx={{ color: theme.palette.grey[textColor] }}>{text}</Typography>
      <Box sx={{ height: 1, borderBottom: `1px solid ${theme.palette.grey[lineColor]}`, flexGrow: 1 }} />
    </Box>
  );
}
