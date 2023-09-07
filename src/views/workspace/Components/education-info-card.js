import React from "react";
import { Typography, Card, CardContent, Box } from "@mui/material";

function InfoCard({ title, subtitle }) {
  return (
    <Card>
      <CardContent sx={{backgroundColor: "#FDFAEE"}}>
        <Typography variant="h6" sx={{ fontWeight: 500 }}>{title} </Typography>
        <Typography variant="subtitle1" >
          {subtitle}
        </Typography>
      </CardContent>
    </Card>
  );
}

export default InfoCard;
