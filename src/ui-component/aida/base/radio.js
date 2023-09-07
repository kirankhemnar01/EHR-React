import { Typography, Radio, Box, FormControlLabel } from '@mui/material';

export const RadioControl = ({ icon, value, title, description }) => {
  const Icon = icon;

  return (
    <FormControlLabel
      sx={{ alignItems: 'flex-start', my: 1 }}
      control={<Radio sx={{ py: 0.25 }} />}
      value={value}
      label={(
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Icon size={16} />
            <Typography sx={{ color: theme => theme.palette.grey['900'], ml: 1, my: 0.5 }}>
              {title}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: 14, color: theme => theme.palette.grey['500'] }}>
            {description}
          </Typography>
        </Box>
      )}
    />
  )
}
