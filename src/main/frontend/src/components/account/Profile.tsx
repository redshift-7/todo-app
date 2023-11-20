import React, { useEffect, useState } from "react";
import { Box, Container, List, ListItem, ListItemText, Paper, Typography } from "@mui/material";
import { authService } from "../../services/AuthService";
import { Navigate } from "react-router-dom";

export const Profile: React.FC = () => {
  const currentUser = authService.getCurrentUser();
  const [redirect, setRedirect] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) {
      setRedirect('/login');
    }
  }, [currentUser])

  if (redirect) {
    return <Navigate to={redirect}/>;
  }

  return (
    <Container>
      {currentUser && currentUser.accessToken ? (
        <Box sx={{mt: 4}}>
          <Paper elevation={3}>
            <Box sx={{p: 2}}>
              <Typography variant="h3" component="h1">
                <strong>{currentUser.username}</strong>
              </Typography>

              <List sx={{ mt: 2, pl: 2, alignItems: 'flex-start' }}>
                <ListItem>
                  <ListItemText
                    primary={<strong>Token:</strong>}
                    secondary={`${currentUser.accessToken.substring(0, 20)} ... ${currentUser.accessToken.slice(currentUser.accessToken.length - 20)}`}
                  />
                </ListItem>
                {/*<ListItem>
                  <ListItemText primary={<strong>Id:</strong>} secondary={currentUser.id} />
                </ListItem>*/}
                <ListItem>
                  <ListItemText primary={<strong>Email:</strong>} secondary={currentUser.email} />
                </ListItem>

                {/*{currentUser.roles && (*/}
                {/*  <ListItem>*/}
                {/*    <ListItemText primary={<strong>Authorities:</strong>} secondary={currentUser.roles.join(', ')} />*/}
                {/*  </ListItem>*/}
                {/*)}*/}
              </List>
            </Box>
          </Paper>
        </Box>
      ) : null}
    </Container>
  );
};