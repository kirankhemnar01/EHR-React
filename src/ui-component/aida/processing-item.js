import { Box, Typography, useTheme } from '@mui/material';
import {
  TimelineItem,
  TimelineSeparator,
  TimelineDot,
  TimelineConnector,
  TimelineContent,
} from '@mui/lab';

export const ProcessingItem = ({ data, isLast }) => {
  const theme = useTheme();
  let content = 'In progress';
  let color = theme.palette.info.main;
  let dotColor = 'info';
  let bgcolor = '#D4fBFF';
  if (data.finished) {
    color = theme.palette.success.main;
    content = 'Finished';
    bgcolor = '#ECFDF3';
    dotColor = 'success';
  } else if (data.error_messages) {
    color = theme.palette.error.main;
    content = 'Failed';
    bgcolor = '#FEF6EE';
    dotColor = 'error';
  }

  return (
    <TimelineItem key={data.index}>
      <TimelineSeparator>
        <TimelineDot color={dotColor} />
        {isLast || (
          <TimelineConnector
            sx={{ backgroundColor: data.finished ? theme.palette.success.light : theme.palette.error.light }}
          />
        )}
      </TimelineSeparator>
      <TimelineContent>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography>{data.name}</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1, py: 0.5, bgcolor, borderRadius: 3 }}>
            <Box component='span' sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
            <Typography sx={{ color, fontSize: 12, lineHeight: 1.4 }}>
              {content}
            </Typography>
          </Box>
        </Box>
      </TimelineContent>
    </TimelineItem>
  )
}
