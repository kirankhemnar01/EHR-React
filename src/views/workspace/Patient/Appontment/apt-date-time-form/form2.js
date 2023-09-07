import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  Autocomplete,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  CardContent,
  Card,
} from "@mui/material";
import * as Yup from "yup";
import BookingCard from "../booking-card/booking";
import { openSnackbar } from "../../../../../store/slices/snackbarSlice";
import { useNotification } from "../../../../../hooks/use-notification";

const slots = [
  { time: "10:00 AM", available: false },
  { time: "10:30 AM", available: false },
  { time: "11:00 AM", available: true },
  { time: "11:30 AM", available: true },
  { time: "12:00 PM", available: false },
  { time: "12:30 PM", available: false },
  { time: "01:00 PM", available: true },
  { time: "01:30 PM", available: true },
  { time: "02:00 PM", available: true },
  { time: "02:30 PM", available: true },
  { time: "03:00 PM", available: true },
  { time: "03:30 PM", available: true },
  { time: "04:00 PM", available: false },
  { time: "04:30 PM", available: true },
  { time: "05:00 PM", available: true },
  { time: "05:30 PM", available: false },
];

// const timeslots = data[0]

const options = ["Option 1", "Option 2", "Option 3"];

const MyForm = ({ onSubmit, formData }) => {
  const { notifySuccess } = useNotification();

  const dispatch = useDispatch();

  console.log("formData2", formData);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const handleSubmit = (values) => {
    console.log("values2", values);
    const formValues = {
      ...values,slot:selectedSlot
    }
    console.log("formValues", formValues);
    onSubmit(formValues);
    notifySuccess('Successfully file submited!');
  };

  const validationSchema = Yup.object().shape({
      // selectedDate: Yup.string().required("Date & Time  is required"),
      // selectspeciality: Yup.string().required("Specialist is required"),
      // appointmentType: Yup.string().required("Appointment Type is required"),
      // selecteProvider: Yup.string().required("Provider is required"),
  });

  const slotSelectionHandler = (item) => {
    console.log("click handler", item);
    setSelectedSlot(item.time);

  };

  return (
    <Formik
      initialValues={{
        selectedDate: null,
        selectspeciality: null,
        appointmentType: null,
        selecteProvider: null,
      }}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, setFieldValue }) => (
        <Form>
          <Grid container spacing={2} mt={1}>
            {/* <Grid item xs={6}>
              <Typography variant="subtitle1">Select Speciality</Typography>
              <Field name="selectspeciality">
                {({ field }) => (
                  <div>
                    <Autocomplete
                      {...field}
                      options={options}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          type="text"
                          placeholder="Select Speciality"
                        />
                      )}
                      onChange={(event, newValue) =>
                        setFieldValue("selectspeciality", newValue)
                      }
                    />
                    <ErrorMessage
                      name="selectspeciality"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                )}
              </Field>
            </Grid> */}
            <Grid item xs={12}>
              <Typography variant="subtitle1">Appointment Type</Typography>
              <Field name="appointmentType">
                {({ field }) => (
                  <div>
                    <Autocomplete
                      {...field}
                      options={options}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          type="text"
                          placeholder="Appointment Type"
                        />
                      )}
                      onChange={(event, newValue) =>
                        setFieldValue("appointmentType", newValue)
                      }
                    />
                    <ErrorMessage
                      name="appointmentType"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </div>
                )}
              </Field>
            </Grid>
            <Grid item xs={4}>
              <Typography variant="subtitle1">Select Date</Typography>
              <Field name="aptDate">
                {({ field }) => (
                  <div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        {...field}
                        value={values.aptDate}
                        sx={{ width: "100%" }}
                        onChange={(date) => setFieldValue("aptDate", date)}
                      />
                      <ErrorMessage
                        name="aptDate"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </LocalizationProvider>
                  </div>
                )}
              </Field>
            </Grid>
            <Grid item xs={8}>
              <Typography variant="subtitle1" sx={{ marginBottom: "20px" }}>
                Available Slots
              </Typography>
              <Box
                style={{
                  maxHeight: "300px", // Adjust the max height as needed
                  overflowY: "auto",
                }}
              >
                {slots ? (
                  <Grid container spacing={2}>
                    {slots.map((item, index) => (
                      <Grid item xs={3} key={index}>
                        <Card
                          sx={{
                            display: "flex",
                            backgroundColor:
                              selectedSlot === item.time
                                ? "#FFF04B"
                                : "#FFF0BB", // Change the background color based on selection
                            overflowY: "auto",
                            cursor: "pointer",
                          }}
                          onClick={() => slotSelectionHandler(item)}
                        >
                          <CardContent sx={{ flex: "1 0 auto" }}>
                            <Typography variant="subtitle1" mb={1}>
                              {item.time}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  "No slots Available"
                )}
              </Box>
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
                // onClick={handleSubmit}
              >
                Save and continue
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
};

export default MyForm;
