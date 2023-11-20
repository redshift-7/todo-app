import * as React from 'react';
import { useEffect, useState } from 'react';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Container from '@mui/material/Container';
import { Navigate } from 'react-router-dom';
import { Field, Form, Formik, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { useAuth } from "../context/AuthContext";
import { Alert, Button, CircularProgress, Grid, Stack, TextField, Typography } from '@mui/material';

interface ErrorResponse {
  response: {
    status: number;
    data: {
      message: string;
    };
  };
}

export const Login: React.FC = () => {
  const { login, user } = useAuth();

  const [redirect, setRedirect] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    if (user) {
      setRedirect('/profile');
    }
  }, [user]);

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const initialValues = {
    username: '',
    password: '',
  };

  const isErrorResponse = (error: any): error is ErrorResponse => {
    return error.response && typeof error.response.status === 'number' && error.response.data;
  };

  const handleLogin = async (
    formValue: { username: string; password: string },
    {resetForm, setSubmitting}: FormikHelpers<typeof formValue>
  ) => {
    const {username, password} = formValue;

    setMessage('');

    try {
      await login(username, password);
      setRedirect('/tasks');
    } catch (error) {
      if (isErrorResponse(error)) {
        if (error.response.status === 401) {
          const errorMessage = error.response.data.message;
          setMessage(errorMessage);
        } else {
          setMessage('An error occurred while logging in.');
        }
      } else {
        setMessage('An error occurred while logging in.');
      }
    }

    resetForm();
    setSubmitting(false);
  };

  if (redirect) {
    return <Navigate to={redirect}/>;
  }

  return (
    <Container >
      <Grid
        container
        spacing={2}
        direction="row"
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Grid item xs={12} md={6} lg={6}>
          <Stack alignItems={"center"} padding={2}>
            <Avatar sx={{m: 1, bgcolor: 'secondary.main'}}>
              <LockOutlinedIcon/>
            </Avatar>
            <CssBaseline/>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleLogin}
            >
              {({errors, touched, isSubmitting}) => (
                <Form>
                  <Field
                    name="username"
                    type="text"
                    label="Username"
                    fullWidth
                    variant="outlined"
                    sx={{mt: 4}}
                    as={TextField}
                    error={errors.username && touched.username}
                    helperText={touched.username && errors.username}
                    autoComplete="off"
                    autoFocus
                  />
                  <Field
                    name="password"
                    type="password"
                    label="Password"
                    fullWidth
                    variant="outlined"
                    margin="normal"
                    as={TextField}
                    error={errors.password && touched.password}
                    helperText={touched.password && errors.password}
                    autoComplete="off"
                  />
                  {message && (
                    <Box sx={{height: '20px'}}>
                      <Alert severity="error">
                        {message}
                      </Alert>
                    </Box>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{mt: 2}}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? <CircularProgress size={20}/> : 'Login'}
                  </Button>
                </Form>
              )}
            </Formik>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
};
