import * as React from "react";
import { Box, Grid, Divider, Button } from "@mui/material";

import CreditCardForm from "./credit-card-form";
import AccountSummery from "./appointment-summery-form3";

export default function PaymentConfirmation({ onSubmit }) {

  // const [activeStep, setActiveStep] = useState(0);

  return (
    <Box sx={{ minWidth: 240 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          {/* <CreditCardForm/> */}
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            type="submit"
            style={{
              marginTop: "16px",
              backgroundColor: "#FFF04B",
              color: "black",
              marginBottom: "16px",
              height: "56px",
            }}
            onClick={onSubmit}
          >
            Save and continue
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
