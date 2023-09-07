import { Typography } from '@mui/material';

export const ErrorMessage = ({ error, sx = {} }) => {
  return (
    <Typography
      variant="body2"
      sx={{
        whiteSpace: 'pre-wrap',
        color: 'error.main',
        p: 1,
        ...sx
      }}
    >
      {error}
    </Typography>
  );
};
