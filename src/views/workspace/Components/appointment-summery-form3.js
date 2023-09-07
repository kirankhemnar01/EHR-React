import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  styled,
  Link,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import PersonAddAltOutlinedIcon from '@mui/icons-material/PersonAddAltOutlined';
import Edit from '@mui/icons-material/Edit';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from 'dayjs';
import { getTime } from "../../../helper";

const FormContainer = styled(Container)({
  marginTop: "0px",
  width: "100%",
});

const AccountSummery = ({ handleBack, formData }) => {

  const [slot, setSlot] = useState();
  console.log("slot", slot);
  console.log("formDataapt", formData);
  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    full_name: Yup.string()
      .required("Email is required"),
      doctor: Yup.string().required("Password is required"),
  });

  useEffect(() => {
    if (formData.step2Data.slot !== undefined) {
      console.log("work");
      if (formData.step2Data.slot) {
        setSlot(getTime(formData.step2Data.slot));
      }
    }
  }, [formData.step2Data.slot]);
  
  

  return (
    <FormContainer>
      <Formik
        initialValues={{
          full_name: "John Doe",
          doctor: "Dr. Emily Johnson",
          selectedDate: dayjs(new Date(formData.step2Data.aptDate)),
          selectedTime: dayjs(new Date()),  
          amount: "100 Rs."
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values, "values"); // You can handle form submission here
          navigate("/home");
        }}
      >
        {({ handleSubmit, errors, touched, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Field name="full_name">
                  {({ field }) => (
                    <div>
                      {/* <Typography variant="subtitle1">Email</Typography> */}
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Name"
                        disabled
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="Edit Password"
                                onClick={() => {
                                  // Implement edit password functionality here
                                  console.log("Edit Password");
                                  handleBack()
                                }}
                              >
                                <PermIdentityOutlinedIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
                {/* Add "Edit" option for email */}
              </Grid>
              <Grid item xs={12}>
                <Field name="doctor">
                  {({ field }) => (
                    <div>
                      {/* <Typography variant="subtitle1">Password</Typography> */}
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Doctor"
                        disabled
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="Edit Password"
                                onClick={() => {
                                  // Implement edit password functionality here
                                  console.log("Edit Password");
                                  handleBack()
                                }}
                              >
                                <PersonAddAltOutlinedIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <ErrorMessage
                        name="doctor"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item xs={6}>
              {/* <Typography variant="subtitle1">Select Date & Time</Typography> */}
              <Field name="selectedDate">
                {({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      {...field}
                      value={values.selectedDate}
                      sx={{ width: "100%" }}
                      disabled
                      onChange={(date) => setFieldValue("selectedDate", date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Date"
                          variant="outlined"
                        />
                      )}
                    />
                    <ErrorMessage
                      name="selectedDate"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </LocalizationProvider>
                )}
              </Field>
            </Grid>
            <Grid item xs={6}>
              {/* <Typography variant="subtitle1">Select Date & Time</Typography> */}
              <Field name="selectedTime">
                {({ field }) => (
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <TimePicker
                      {...field}
                      value={values.selectedTime}
                      sx={{ width: "100%" }}
                      disabled
                      onChange={(date) => setFieldValue("selectedTime", date)}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label="Select Date"
                          variant="outlined"
                        />
                      )}
                    />
                    <ErrorMessage
                      name="selectedDate"
                      component="div"
                      style={{ color: "red" }}
                    />
                  </LocalizationProvider>
                )}
              </Field>
            </Grid>
            <Grid item xs={12}>
                <Field name="amount">
                  {({ field }) => (
                    <div>
                      {/* <Typography variant="subtitle1">Email</Typography> */}
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Name"
                        disabled
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IconButton
                                aria-label="Edit Password"
                                onClick={() => {
                                  // Implement edit password functionality here
                                  console.log("Edit Password");
                                  handleBack()
                                }}
                              >
                                <AttachMoneyIcon />
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                      />
                      <ErrorMessage
                        name="email"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
            </Grid>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default AccountSummery;
