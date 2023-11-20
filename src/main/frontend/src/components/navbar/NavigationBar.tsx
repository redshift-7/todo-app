import React from 'react';
import { Link as RouterLink, useNavigate } from "react-router-dom";
import TaskIcon from '@mui/icons-material/Task';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography
} from '@mui/material';
import { useAuth } from "../context/AuthContext";

export const NavigationBar: React.FC = () => {
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleNavigateToProfile = () => {
    navigate('/profile');
  }

  const handleNavigateToTasks = () => {
    navigate('/tasks');
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
    navigate('/login');
  }

  return (
    <AppBar position='static'>
      <Container maxWidth="xl">
      <Toolbar>
        <TaskIcon sx={{ mr: 1 }} />
        <Typography
          variant="h6"
          noWrap
          component="a"
          sx={{
            ml: 2,
            fontFamily: 'monospace',
            fontWeight: 700,
            letterSpacing: '.3rem',
            color: 'inherit',
            textDecoration: 'none',
            cursor: 'default',
          }}
        >
          TODO APP
        </Typography>

        <Box sx={{ flexGrow: 1 }}>
            <Button
              key={"Tasks"}
              onClick={handleNavigateToTasks}
              sx={{ ml: 2, color: 'white', display: 'block' }}
            >
              Tasks
            </Button>
        </Box>

        <Box sx={{flexGrow: 1}}/>

        {user ? (
          <Stack direction='row' spacing={2}>
            <IconButton
              size="large"
              sx={{ml: 2}}
              color="inherit"
              onClick={handleClick}
            >
              <Avatar>{user.username.slice(0, 1)}</Avatar>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              sx={{
                elevation: 0,
                sx: {
                  overflow: 'visible',
                  filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                  mt: 1.5,
                  '& .MuiAvatar-root': {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: 'background.paper',
                    transform: 'translateY(-50%) rotate(45deg)',
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
              <MenuItem onClick={handleNavigateToProfile} component={RouterLink} to="/profile">
                Profile
              </MenuItem>
              <Divider/>
              <MenuItem onClick={handleLogout}>
                Logout
              </MenuItem>
            </Menu>
          </Stack>
        ) : (
          <Stack direction='row' spacing={2}>
            <Button color='inherit' component={RouterLink} to="/login">Login</Button>
            <Button color="inherit" component={RouterLink} to="/register">Sign Up</Button>
          </Stack>
        )}
      </Toolbar>
      </Container>
    </AppBar>
  )
}