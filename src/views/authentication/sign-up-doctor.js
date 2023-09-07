import React, { useState } from "react";
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
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const FormContainer = styled(Container)({
  marginTop: "20px",
  width: "35%",
});

const SignupDoctor = () => {
  const [profilePic, setProfilePic] = useState(null);

  const handleProfilePicChange = (event) => {
    const file = event.target.files[0];
    // You can handle the selected profile picture here, e.g., upload it to a server or store it in state.
    setProfilePic(file);
  };

  const otherGenderHandle = () => {};

  const validationSchema = Yup.object().shape({
    first_name: Yup.string().required("First Name is required"),
    last_name: Yup.string().required("Last Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    confirm_email: Yup.string()
      .oneOf([Yup.ref("email"), null], "Emails must match")
      .required("Confirm Email is required"),
    dob_day: Yup.string().required("Day is required"),
    dob_month: Yup.string().required("Month is required"),
    dob_year: Yup.string().required("Year is required"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]+$/,
        "Password must contain letters, numbers, and special characters"
      ),
    confirm_password: Yup.string().oneOf(
      [Yup.ref("password"), null],
      "Password must match"
    ),
  });

  return (
    <FormContainer>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          fontFamily: "sharp-sans-bold, fallback-font, Arial, sans-serif",
          fontSize: "24px",
          lineHeight: "32px",
          letterSpacing: "0em",
          textTransform: "none",
          marginBottom: "12px",
          fontWeight: 800,
        }}
      >
        Create an Account
      </Typography>
      <Typography
        variant="body1"
        style={{ marginTop: "10px", marginBottom: "8px", cursor: "pointer" }}
      >
        <Link component={RouterLink} to="/signin/doctor">
          Already have an account? Log in.
        </Link>
      </Typography>
      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          confirm_email: "",
          password: "",
          dob_day: "",
          dob_month: "",
          dob_year: "",
          gender: "male",
          accept_terms: false,
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values, "values"); // You can handle form submission here
        }}
      >
        {({ handleSubmit, errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              {/* Profile Picture */}
              {/* <Grid item xs={12}>
                <Typography variant="subtitle1">Profile Picture</Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePicChange}
                />
                {profilePic && (
                  <img
                    src={URL.createObjectURL(profilePic)}
                    alt="Profile Preview"
                    style={{
                      width: "100px",
                      height: "100px",
                      marginTop: "8px",
                    }}
                  />
                )}
              </Grid> */}
              <Grid item xs={6}>
                <Field name="first_name">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">First Name</Typography>
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
                      <Typography variant="subtitle1">Last Name</Typography>
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
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1">Gender</Typography>
                <Field name="gender">
                  {({ field }) => (
                    <RadioGroup {...field} row>
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
                      <FormControlLabel
                        value="other"
                        control={<Radio />}
                        label="Other"
                      />
                    </RadioGroup>
                  )}
                </Field>
              </Grid>
              {/* <Grid item xs={12}>
                <Typography
                  variant="body1"
                  style={{ marginTop: "10px", marginBottom: "8px" }}
                >
                  <Link onClick={otherGenderHandle}>
                    Add more sex & gender info{" "}
                  </Link>
                  (optional)
                </Typography>
              </Grid> */}
              <Grid item xs={6}>
                <Field name="email">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">Email</Typography>
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
              <Grid item xs={6}>
                <Field name="confirm_email">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">Confirm Email</Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Confirm Email"
                      />
                      <ErrorMessage
                        name="confirm_email"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item xs={6}>
                <Field name="password">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">Password</Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Password"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item xs={6}>
                <Field name="confirm_password">
                  {({ field }) => (
                    <div>
                      <Typography variant="subtitle1">
                        Confirm Password
                      </Typography>
                      <TextField
                        {...field}
                        variant="outlined"
                        fullWidth
                        placeholder="Confirm Password"
                      />
                      <ErrorMessage
                        name="confirm_password"
                        component="div"
                        style={{ color: "red" }}
                      />
                    </div>
                  )}
                </Field>
              </Grid>
              <Grid item xs={12}>
                <Typography
                  variant="body2"
                  color="textSecondary"
                  sx={{ marginTop: "8px" }}
                >
                  Password Requirements:
                  <ul>
                    <li>Use at least 8 characters</li>
                    <li>Use letters</li>
                    <li>Use numbers</li>
                    <li>Use special characters, like @#$%&*</li>
                  </ul>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Field name="accept_terms">
                  {({ field }) => (
                    <div>
                      <FormControlLabel
                        control={<Checkbox {...field} color="primary" />}
                        label={
                          <span>
                            I have read and accept caregroup's{" "}
                            <Link
                              href="/terms-of-use"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              terms of use
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/privacy-policy"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              privacy policy
                            </Link>
                          </span>
                        }
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
                // color="primary"
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

export default SignupDoctor;
