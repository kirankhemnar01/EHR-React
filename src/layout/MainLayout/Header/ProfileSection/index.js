import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import {
  Box,
  ClickAwayListener,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Popper,
  Stack,
  Typography
} from '@mui/material';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import { IconLogout, IconSettings, IconBox } from '@tabler/icons';

import MainCard from 'ui-component/cards/MainCard';
import Transitions from 'ui-component/extended/Transitions';
import useAuth from 'hooks/useAuth';
import ForwardRefUserAvatar from 'ui-component/aida/ForwardRefUserAvatar';
import useConfig from 'hooks/useConfig';
import { captureException } from '@sentry/react';
import { sentryEvents } from 'aida-constants';

const ProfileSection = () => {
  const theme = useTheme();
  const { borderRadius } = useConfig();
  const navigate = useNavigate();

  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { logout, user } = useAuth();
  const [open, setOpen] = useState(false);

  /**
   * anchorRef is used on different components and specifying one type leads to other components throwing an error
   * */
  const anchorRef = useRef(null);
  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      captureException(err, {
        user,
        userEvent: sentryEvents.sys.logout
      });
      console.error(err);
    }
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const handleListItemClick = (event, index, route = '') => {
    setSelectedIndex(index);
    handleClose(event);

    if (route && route !== '') {
      navigate(route);
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <ForwardRefUserAvatar
        className="UserProfile"
        user={user}
        sx={{
          ...theme.typography.mediumAvatar,
          margin: '8px 0 8px 8px !important'
        }}
        ref={anchorRef}
        aria-controls={open ? 'menu-list-grow' : undefined}
        aria-haspopup="true"
        color="inherit"
        onClick={handleToggle}
      />

      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 14]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions in={open} {...TransitionProps}>
              <Paper>
                {open && (
                  <MainCard border={false} elevation={16} content={false} boxShadow shadow={theme.shadows[16]}>
                    <Box sx={{ p: 2, pb: 0 }}>
                      <Stack>
                        <Stack direction="row" spacing={0.5} alignItems="center">
                          <Typography variant="h4">Good Morning,</Typography>
                          <Typography component="span" variant="h4" sx={{ fontWeight: 400 }}>
                            {user?.name}
                          </Typography>
                        </Stack>
                        {user?.is_superuser && <Typography variant="subtitle2">Super user</Typography>}
                      </Stack>
                      <Divider />
                    </Box>
                    <Box sx={{ p: 2, pt: 0 }}>
                      <List
                        component="nav"
                        sx={{
                          width: '100%',
                          maxWidth: 350,
                          minWidth: 300,
                          backgroundColor: theme.palette.background.paper,
                          borderRadius: '10px',
                          [theme.breakpoints.down('md')]: {
                            minWidth: '100%'
                          },
                          '& .MuiListItemButton-root': {
                            mt: 0.5
                          }
                        }}
                      >
                        <ListItemButton
                          sx={{ borderRadius: `${borderRadius}px` }}
                          selected={selectedIndex === 0}
                          onClick={(event) => handleListItemClick(event, 0, '/user/user-settings')}
                        >
                          <ListItemIcon>
                            <IconSettings stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">User Settings</Typography>} />
                        </ListItemButton>
                        {user.role_name === 'Admin' && (
                          <ListItemButton
                            sx={{ borderRadius: `${borderRadius}px` }}
                            selected={selectedIndex === 1}
                            onClick={(event) => handleListItemClick(event, 1, '/admin/projects')}
                          >
                            <ListItemIcon>
                              <SupervisorAccountOutlinedIcon stroke={1.5} size="1.3rem" />
                            </ListItemIcon>
                            <ListItemText primary={<Typography variant="body2">Admin Settings</Typography>} />
                          </ListItemButton>
                        )}
                        <ListItemButton
                          sx={{ borderRadius: `${borderRadius}px` }}
                          selected={selectedIndex === 4}
                          onClick={(event) => handleListItemClick(event, 2, '/pretrained-models')}
                        >
                          <ListItemIcon>
                            <IconBox stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Model Hub</Typography>} />
                        </ListItemButton>
                        <ListItemButton
                          sx={{ borderRadius: `${borderRadius}px` }}
                          selected={selectedIndex === 4}
                          onClick={handleLogout}
                        >
                          <ListItemIcon>
                            <IconLogout stroke={1.5} size="1.3rem" />
                          </ListItemIcon>
                          <ListItemText primary={<Typography variant="body2">Logout</Typography>} />
                        </ListItemButton>
                      </List>
                    </Box>
                  </MainCard>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default ProfileSection;
