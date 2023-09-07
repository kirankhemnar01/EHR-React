import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';


const  TimeSlotComponent = ({ timeSlot }) => {
  return (
    <Grid item xs={3}>
      <Card sx={{ display: "flex", backgroundColor: "#FFF0BB", overflowY: "auto" }}>
        <CardContent sx={{ flex: "1 0 auto" }}>
          <Typography variant="subtitle1" mb={1}>
            {timeSlot}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default TimeSlotComponent