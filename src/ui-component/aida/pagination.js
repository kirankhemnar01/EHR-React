import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export const Pagination = ({ count, pageSize, page, onPageChange, name, sx = {} }) => {
  const onPrev = () => {
    onPageChange(page - 1);
  }

  const onNext = () => {
    onPageChange(page + 1);
  }

  const start = page * pageSize + 1;
  const end = page * pageSize + pageSize;
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
      my: 1,
      gap: 2,
      ...sx 
    }}>
      <IconButton onClick={onPrev} disabled={start === 1}>
        <ArrowBackIosNewIcon fontSize='small' />
      </IconButton>

      <Typography>
        {`Showing ${start}-${Math.min(end, count)} of ${count} ${name}s`}
      </Typography>

      <IconButton onClick={onNext} disabled={end >= count}>
        <ArrowForwardIosIcon fontSize='small' />
      </IconButton>
    </Box>
  )
}