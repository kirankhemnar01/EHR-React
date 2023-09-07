import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  styled,
  Link,
} from "@mui/material";
import { Link as RouterLink } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const FormContainer = styled(Container)({
  marginTop: "20px",
  width: "35%",
});

const Signin = () => {

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
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
        Sign-In your account
      </Typography>

      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log(values, "values"); // You can handle form submission here
          navigate('/home')
        }}
      >
        {({ handleSubmit, errors, touched }) => (
          <Form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
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

              <Grid item xs={12}>
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
                Sign In
              </Button>
            </Grid>
            <Grid>
              <Typography
                variant="body1"
                style={{ marginTop: "10px", marginBottom: "8px",cursor: "pointer" }}
              >
                New to caregroup? 
                <Link
                  component={RouterLink}
                  to="/signup"
                >
                  Create an account
                </Link>
              </Typography>
            </Grid>
          </Form>
        )}
      </Formik>
    </FormContainer>
  );
};

export default Signin;
