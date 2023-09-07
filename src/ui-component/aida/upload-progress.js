import { Box, LinearProgress, Typography } from '@mui/material';
import { humanFileSize } from 'helpers';

export const UploadProgress = ({ uploaded, size, step }) => (
  <>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', mr: 1 }}>
        <LinearProgress variant="determinate" value={Math.round(uploaded / size * 100)} />
      </Box>
      <Box sx={{ minWidth: 40 }}>
        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'nowrap' }}>
          {`${humanFileSize(uploaded)} / ${humanFileSize(size)}`}
        </Typography>
      </Box>
    </Box>
    <Typography sx={{ fontSize: 12, py: 0.5 }}>{step}</Typography>
  </>
);
