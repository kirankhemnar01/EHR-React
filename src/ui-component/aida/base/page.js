import { Box, Button } from '@mui/material';

export const Page = ({ children, onBack, backLabel, headerSx = {}, childSx = {}, ...others }) => (
  <Box {...others}>
    {onBack && (
      <Box component='section' sx={{ mb: 2, ...headerSx }}>
        <Button
          variant='contained'
          onClick={onBack}
          sx={{
            bgcolor: (theme) => theme.palette.primary.light,
            color: (theme) => theme.palette.primary.main,
            '&:hover': { bgcolor: (theme) => theme.palette.primary['200'] }
          }}
        >
          {backLabel ?? 'Back'}
        </Button>
      </Box>
    )}
    <Box component='section' sx={{ p: 1, ...childSx }}>
      {children}
    </Box>
  </Box>
);
