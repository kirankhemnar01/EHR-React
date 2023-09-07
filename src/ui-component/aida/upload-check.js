import { Typography, Box, Checkbox } from '@mui/material';

export const CustomCheck = ({ checked, onChange, title, description }) => (
  <Box sx={{ display: 'flex' }}>
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Checkbox
        checked={checked}
        onChange={onChange}
      />
    </Box>
    <Box sx={{ display: 'flex', flexDirection: 'column', py: 1 }}>
      <Typography sx={{ fontWeight: 500, my: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ color: theme => theme.palette.grey['500'], my: 0.5 }}>
        {description}
      </Typography>
    </Box>
  </Box>
);
