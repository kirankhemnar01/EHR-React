import * as React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Grid, Divider, Button, IconButton } from "@mui/material";
import List, { ListProps } from "@mui/joy/List";
import ListItem from "@mui/joy/ListItem";
import ListDivider from "@mui/joy/ListDivider";
import Radio from "@mui/joy/Radio";
import RadioGroup from "@mui/joy/RadioGroup";
import Typography from "@mui/joy/Typography";
import Switch from "@mui/joy/Switch";
import CardType from "./card-type";
import CreditCardForm from "./credit-card-form";
import AccountSummery from "./appointment-summery-form3";
import Edit from "@mui/icons-material/Edit";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch } from "react-redux";
import { openSnackbar } from "../../../store/slices/snackbarSlice";

export default function PaymentChannels({ onSubmit, handleBack, formData }) {
  console.log("formData3", formData);

  const dispatch = useDispatch();

  const navigate = useNavigate();

  // const [activeStep, setActiveStep] = useState(0);
  const card = [
    {
      name: "Appointment",
      price: 100,
    },
  ];

  const makePayment = async () => {
    const stripe = await loadStripe(
      "pk_test_51NnIcoSAXwrpPOS8n18sSSzm8WzK2zhIAdNPAjXfhgpJ1ByHB2SGeNhVgGQ1zxQsAEDKsgkj3jqYlMBJHhI1PRPB00pVoTowwQ"
    );

    const body = {
      products: card,
    };

    const headers = {
      "Content-Type": "application/json",
    };

    const response = await fetch(
      "http://localhost:8000/api/create-checkout-session",
      {
        method: "post",
        headers: headers,
        body: JSON.stringify(body),
      }
    );

    const session = await response.json();
    console.log("session", session);

    const result = stripe.redirectToCheckout({
      sessionId: session.sessionId,
    });



    if (result.error) {
      console.log("err", result.error);
    }
  };

  return (
    <Box sx={{ minWidth: 240 }}>
      <Box
        sx={{
          mb: 2,
          mt: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingRight: "30px",
          paddingLeft: "30px",
        }}
      >
        <Typography
          id="example-payment-channel-label"
          level="title-md"
          textColor={"text.secondary"}
          fontWeight="xl"
        >
          Pay with
        </Typography>
        <Typography
          id="example-payment-channel-label"
          level="title-md"
          textColor={"text.secondary"}
          fontWeight="xl"
        >
          Appointmet Summery
          <IconButton onClick={handleBack}>
            <Edit />
          </IconButton>
        </Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <RadioGroup
            aria-labelledby="example-payment-channel-label"
            overlay
            name="example-payment-channel"
            defaultValue="Card"
          >
            <List
              component="div"
              variant="outlined"
              sx={{
                borderRadius: "sm",
                boxShadow: "sm",
              }}
            >
              {["Card", "UPI/QR", "NETBANKING", "WALLET"].map(
                (value, index) => (
                  <React.Fragment key={value}>
                    {index !== 0 && <ListDivider />}
                    <ListItem>
                      <Radio id={value} value={value} label={value} />
                    </ListItem>
                  </React.Fragment>
                )
              )}
            </List>
          </RadioGroup>
        </Grid>
        {/* <Divider orientation="vertical" sx={{marginLeft:'10px', marginRight: '10px'}} flexItem /> */}
        <Grid item xs={6}>
          <AccountSummery handleBack={handleBack} formData={formData} />
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
            // onClick={onSubmit}
            onClick={makePayment}
          >
            Chekout & Pay
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
