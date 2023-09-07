import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import {
  Box,
  ClickAwayListener,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Popper,
  Typography,
  useMediaQuery
} from '@mui/material';

// project imports
import Transitions from 'ui-component/extended/Transitions';
import { HeaderButton } from 'ui-component/aida/base';
import { SITES, SITE_DEPOSITION, SITE_REVIEW } from 'aida-constants';
import Chip from 'ui-component/extended/Chip';
import { useDispatch, useSelector } from 'store';
import { changeSiteId } from 'store/slices/menu';
import { ENABLE_DEPOSITION } from 'config';

// assets
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import useConfig from 'hooks/useConfig';

import { buildRouteForDashboard, buildRouteForDepositionDashboard } from 'helpers';

const SitesSection = () => {
  const { borderRadius } = useConfig();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const theme = useTheme();
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const filteredSites = ENABLE_DEPOSITION ? SITES : SITES.filter((s) => s.id !== SITE_DEPOSITION);

  const [open, setOpen] = useState(false);
  const anchorRef = useRef(null);
  const dispatch = useDispatch();
  const { currentSiteId } = useSelector((state) => state.menu);

  const handleListItemClick = (s) => {
    if (s !== currentSiteId) {
      dispatch(changeSiteId(s));
      setOpen(false);
      if (s === SITE_REVIEW) {
        navigate(buildRouteForDashboard(projectId));
      } else if (s === SITE_DEPOSITION) {
        navigate(buildRouteForDepositionDashboard(projectId));
      }
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  if (!projectId) return null;

  return (
    <>
      <Box ref={anchorRef} aria-controls={open ? 'menu-list-grow' : undefined} aria-haspopup="true">
        <HeaderButton title="Sites" onClick={handleToggle}>
          <GridViewOutlinedIcon />
        </HeaderButton>
      </Box>

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
                offset: [matchesXs ? 0 : 0, 20]
              }
            }
          ]
        }}
      >
        {({ TransitionProps }) => (
          <ClickAwayListener onClickAway={handleClose}>
            <Transitions position={matchesXs ? 'top-left' : 'top'} in={open} {...TransitionProps}>
              <Paper elevation={16}>
                {open && (
                  <List
                    component="nav"
                    sx={{
                      width: '100%',
                      minWidth: 200,
                      maxWidth: 280,
                      bgcolor: theme.palette.background.paper,
                      borderRadius: `${borderRadius}px`,
                      [theme.breakpoints.down('md')]: {
                        maxWidth: 250
                      }
                    }}
                  >
                    {filteredSites.map((site) => (
                      <ListItemButton
                        key={site.id}
                        selected={currentSiteId === site.id}
                        onClick={() => handleListItemClick(site.id)}
                      >
                        <ListItemText
                          primary={
                            <Grid container>
                              <Typography variant="subtitle1" sx={{ color: '#101828', fontSize: '16px' }}>
                                {site.name}
                              </Typography>
                              {site.chip && <Chip label={site.chip} chipcolor="success" sx={{ ml: 1 }} />}
                              <Typography
                                variant="body"
                                sx={{ color: '#667085', fontSize: '14px', lineHeight: '20px' }}
                              >
                                {site.description}
                              </Typography>
                            </Grid>
                          }
                        />
                      </ListItemButton>
                    ))}
                  </List>
                )}
              </Paper>
            </Transitions>
          </ClickAwayListener>
        )}
      </Popper>
    </>
  );
};

export default SitesSection;
