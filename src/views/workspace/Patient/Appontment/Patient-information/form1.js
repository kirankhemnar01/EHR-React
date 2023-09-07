import React from "react";
import {
  Container,
  TextField,
  Button,
  Grid,
  Link,
  Typography,
  styled,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  Autocomplete
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const FormContainer = styled(Container)({
  marginTop: "20px",
  width: "100%",
});

const appointmentReasons = [
  "General Check-Up",
  "Common Colds and Infections",
  "Chronic Conditions (e.g., diabetes, hypertension)",
  "Mental Health (e.g., depression, anxiety)",
  "Allergies (e.g., seasonal, food)",
  "Injuries (e.g., sprains, fractures)",
  "Skin Conditions (e.g., acne, eczema)",
  "Digestive Issues (e.g., acid reflux, IBS)",
  "Cardiovascular Issues (e.g., chest pain, high cholesterol)",
  "Women's Health (e.g., contraception, menstrual problems)",
  "Men's Health (e.g., prostate health, erectile dysfunction)",
  "Pediatric Care (e.g., children's health, vaccinations)",
  "Dental and Oral Health (e.g., dental check-ups, cleanings)",
  "Eye and Vision Care (e.g., eye exams, vision problems)",
  "Cancer Screening (e.g., mammograms, colonoscopies)",
  "Neurological Conditions (e.g., migraines, epilepsy)",
  "Orthopedic Issues (e.g., joint and bone problems)",
  "Geriatric Care (e.g., elderly health concerns)",
  "Infectious Diseases (e.g., HIV/AIDS, hepatitis)",
  "Autoimmune Diseases (e.g., lupus, rheumatoid arthritis)",
  "Respiratory Conditions (e.g., asthma, COPD)",
  "Endocrine Disorders (e.g., thyroid issues, hormonal imbalances)",
  "Addiction and Substance Abuse (e.g., substance abuse treatment)",
  "Weight Management (e.g., weight-related issues, obesity)",
  "Diet and Nutrition (e.g., nutritional counseling)",
  "Prenatal Care (e.g., care during pregnancy)",
  "Postpartum Care (e.g., follow-up after childbirth)",
  "Reproductive Health (e.g., fertility concerns, family planning)",
  "Immunizations and Vaccinations (e.g., scheduled vaccinations)",
  "Travel Health (e.g., travel consultations and vaccinations)",
  // Add more as needed
];


const CreateAccount = ({onSubmit}) => {
  const otherGenderHandle = () => {};

  const validationSchema = Yup.object().shape({
    // first_name: Yup.string().required("First Name is required"),
    // last_name: Yup.string().required("Last Name is required"),
    // email: Yup.string()
    //   .email("Invalid email format")
    //   .required("Email is required"),
    // DOB: Yup.string().required("DOB is required"),
    // gender: Yup.string().required("Gender is required"),
    // MRN: Yup.string().required("MRN is required"),
    // phone: Yup.string().required("MRN is required"),
    // primaryAddress: Yup.string().required("Primary Address is required"),
    // state: Yup.string().required("State is required"),
    // country: Yup.string().required("Country is required"),
    // zipCode: Yup.string().required("Country is required"),
    // appointmentReason: Yup.string().required("Reason is required"),

  });

  return (
    <FormContainer>
      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          DOB: "",
          gender: "male",
          MRN: "",
          phone: "",
          primaryAddress: "",
          state: "",
          country: "",
          zipCode: "",
          appointmentReason: ""
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values, "values"); // You can handle form submission here
          onSubmit(values);
        }}
      >
        {({ handleSubmit, errors, touched, values, setFieldValue }) => (
          <Form>
            <Grid container spacing={2}>
              {/* <Grid item xs={6}>
                <Field name="first_name">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">
                        First Name <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="First Name"
                        className={
                          errors.first_name && touched.first_name
                            ? "error-field"
                            : ""
                        }
                      />
                      <ErrorMessage
                        name="first_name"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item xs={6}>
                <Field name="last_name">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">
                        Last Name <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Last Name"
                      />
                      <ErrorMessage
                        name="last_name"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid> */}
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  Appointment Reason <span style={{ color: "red" }}>*</span>
                </Typography>
                <Field name="appointmentReason">
                  {({ field }) => (
                    <Autocomplete
                      {...field}
                      options={appointmentReasons}
                      getOptionLabel={(option) => option}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          variant="outlined"
                          fullWidth
                          placeholder="Appointment Reason"
                        />
                      )}
                      onChange={(event, newValue) =>
                        setFieldValue("appointmentReason", newValue)
                      }
                    />
                  )}
                </Field>
                <ErrorMessage
                  name="appointmentReason"
                  component="div"
                  style={{ color: "red" }}
                />
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle1">
                  DOB <span style={{ color: "red" }}>*</span>
                </Typography>
                <Field name="DOB">
                  {({ field }) => (
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        {...field}
                        value={values.selectedDate}
                        sx={{ width: "100%" }}
                        onChange={(date) => setFieldValue("DOB", date)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            variant="outlined"
                            fullWidth
                            placeholder="DOB"
                          />
                        )}
                      />
                      <ErrorMessage
                        name="DOB"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </LocalizationProvider>
                  )}
                </Field>
              </Grid>
              <Grid item xs={4}>
                <Typography variant="subtitle1">
                  Gender <span style={{ color: "red" }}>*</span>
                </Typography>
                <Field name="gender">
                  {({ field }) => (
                    <RadioGroup row {...field}>
                      <FormControlLabel
                        value="male"
                        control={<Radio />}
                        label="Male"
                      />
                      <FormControlLabel
                        value="female"
                        control={<Radio />}
                        label="Female"
                      />
                      <ErrorMessage
                        name="gender"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </RadioGroup>
                  )}
                </Field>
              </Grid>
              
              <Grid item xs={4}>
                <Field name="MRN">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">
                        Medical Registartion No.{" "}
                        <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="MRN"
                      />
                      <ErrorMessage
                        name="MRN"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item xs={4}>
                <Field name="email">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">
                        Email <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Email"
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
              <Grid item xs={4}>
                <Field name="phone">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">
                        Phone/Mobile <span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Phone/Mobile"
                      />
                      <ErrorMessage
                        name="phone"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item xs={4}>
                <Field name="primaryAddress">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">
                        Primary Address<span style={{ color: "red" }}>*</span>
                      </Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Primary Address"
                      />
                      <ErrorMessage
                        name="primaryAddress"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item xs={4}>
                <Field name="line1">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">
                        Address Line 1
                      </Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Address Line 1"
                      />
                      <ErrorMessage
                        name="line1"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item xs={4}>
                <Field name="line2">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">
                        Address Line 2
                      </Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Address Line 2"
                      />
                      <ErrorMessage
                        name="line1"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item xs={4}>
                <Field name="state">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">State</Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="State"
                      />
                      <ErrorMessage
                        name="state"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item xs={4}>
                <Field name="country">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">Country</Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Country"
                      />
                      <ErrorMessage
                        name="country"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item xs={4}>
                <Field name="zipCode">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">ZipCode</Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="ZipCode"
                      />
                      <ErrorMessage
                        name="zipCode"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
            </Grid>
            <Grid>
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
                onClick={handleSubmit}
              >
                Save and continue
              </Button>
            </Grid>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default CreateAccount;
