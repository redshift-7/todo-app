import React, { useState } from "react";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { Alert, Avatar, Box, Button, Container, TextField, Typography } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { authService } from "../../services/AuthService";

interface RegisterFormValues {
  username: string;
  email: string;
  password: string;
}

const initialValues: RegisterFormValues = {
  username: "",
  email: "",
  password: "",
};

interface ErrorResponse {
  response: {
    status: number;
    data: {
      message: string;
    };
  };
}

const validationSchema = Yup.object({
  username: Yup.string().required("Username is required"),
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
});

export const Register: React.FC = () => {
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleRegister = async (values: RegisterFormValues) => {
    try {
      const response = await authService.register(values.username, values.email, values.password);

      if (response) {
        setSuccessful(true);
        setMessage('Registration successful!');
      } else {
        setMessage('An error occurred during registration.');
      }
    } catch (error) {
      if (isErrorResponse(error)) {
        if (error.response.status === 400) {
          const errorMessage = error.response.data.message;
          setMessage(errorMessage);
        } else {
          setMessage('An error occurred during registration.');
        }
      } else {
        setMessage('An error occurred during registration.');
      }
    }
  };

  const isErrorResponse = (error: any): error is ErrorResponse => {
    return error.response && typeof error.response.status === 'number' && error.response.data;
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline/>
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleRegister}
        >
          {({errors, touched}) => (
            <Form>
              {!successful && (
                <>
                  <Field
                    name="username"
                    type="text"
                    label="Username"
                    fullWidth
                    variant="outlined"
                    sx={{mt: 2}}
                    as={TextField}
                    error={errors.username && touched.username}
                    helperText={touched.username && errors.username}
                    autoComplete="off"
                    autoFocus
                  />
                  <Field
                    name="email"
                    type="email"
                    label="Email"
                    as={TextField}
                    variant="outlined"
                    sx={{mt: 2}}
                    fullWidth
                    error={errors.email && touched.email}
                    helperText={errors.email && touched.email ? errors.email : null}
                    autoFocus
                  />
                  {message && (
                    <Box sx={{height: '20px'}}>
                      <Alert severity="error">
                        {message}
                      </Alert>
                    </Box>
                  )}
                  <Field
                    name="password"
                    type="password"
                    label="Password"
                    fullWidth
                    variant="outlined"
                    sx={{mt: 2}}
                    as={TextField}
                    error={errors.password && touched.password}
                    helperText={touched.password && errors.password}
                    autoComplete="off"
                  />
                  <Button variant="contained" color="primary" type="submit" fullWidth sx={{ mt: 3, mb: 2 }} >
                    Register
                  </Button>
                </>
              )}
              {successful && (
                <Box sx={{height: '20px', mt: 2}}>
                  <Alert severity="success">
                    Registration successful!
                  </Alert>
                </Box>
              )}
            </Form>
          )}
        </Formik>
      </Box>
    </Container>
  );
}
