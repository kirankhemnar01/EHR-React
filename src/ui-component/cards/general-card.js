import React from 'react';
import { Card, CardContent, Box, Typography } from '@mui/material';

export const GeneralCard = React.forwardRef((
  { icon, title, description, onSelect, bodySx = {} }, ref
) => {
  return (
    <Card
      ref={ref}
      raised
      onClick={onSelect}
      sx={{ width: { xs: 280, sm: 320, md: '30%' }, cursor: 'pointer', '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.04)' } }}
    >
      <CardContent sx={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 2, px: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          {icon}
        </Box>
        <Typography variant='h5' sx={{ fontSize: { xs: 14, sm: 16 } }}>{title}</Typography>
        <Typography variant='body2' sx={{ fontSize: { xs: 14, sm: 16 }, px: 2, ...bodySx }}>
          {description}
        </Typography>
      </CardContent>
    </Card>
  )
});
