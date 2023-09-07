import { memo, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Drawer, useMediaQuery, Typography } from '@mui/material';

// third-party
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MenuList from '../MenuList';
import ChatsMenuList from '../MenuList/chats-menu-list';
import { UserGuideLink } from '../MenuList/guide-menu';
import LogoSection from '../LogoSection';
import MiniDrawerStyled from './MiniDrawerStyled';

import { drawerWidth, LAYOUT_CONST, SITES } from 'aida-constants';
import useConfig from 'hooks/useConfig';

import { useDispatch, useSelector } from 'store';
import { openDrawer } from 'store/slices/menu';

// ==============================|| SIDEBAR DRAWER ||============================== //

const Sidebar = () => {
  const theme = useTheme();
  const matchUpMd = useMediaQuery(theme.breakpoints.up('md'));
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  const dispatch = useDispatch();
  const { drawerOpen, minimizedDrawerHidden, currentSiteId } = useSelector((state) => state.menu);
  const currentSiteName = SITES.find((s) => s.id === currentSiteId)?.name;

  const { drawerType } = useConfig();

  const logo = useMemo(
    () => (
      <Box sx={{ display: 'flex', p: 2 }}>
        <LogoSection />
      </Box>
    ),
    []
  );

  const drawerContent = (
    <>
      <MenuList />
      <ChatsMenuList />
      <Box sx={{ flexGrow: 1 }} />
      <UserGuideLink />
    </>
  );

  const drawerSX = {
    paddingLeft: drawerOpen ? '16px' : 0,
    paddingRight: drawerOpen ? '16px' : 0,
    marginTop: drawerOpen ? 0 : '20px'
  };

  const drawer = useMemo(
    () => (
      <>
        {drawerOpen && (
          <Typography variant="h3" sx={{ px: 2, py: 1 }}>
            {currentSiteName}
          </Typography>
        )}
        {matchDownMd ? (
          <Box sx={drawerSX}>{drawerContent}</Box>
        ) : (
          <PerfectScrollbar
            component="div"
            style={{
              height: !matchUpMd ? 'calc(100vh - 56px)' : 'calc(100vh - 88px)',
              display: 'flex',
              flexDirection: 'column',
              ...drawerSX
            }}
          >
            {drawerContent}
          </PerfectScrollbar>
        )}
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [matchUpMd, drawerOpen, drawerType, currentSiteName]
  );

  return (
    <Box
      component="nav"
      sx={{ flexShrink: { md: 0 }, width: matchUpMd ? drawerWidth : 'auto', borderRight: '1px solid #eeeeee' }}
      aria-label="mailbox folders"
    >
      {/* eslint-disable-next-line no-nested-ternary */}
      {matchDownMd || (drawerType === LAYOUT_CONST.MINI_DRAWER && drawerOpen) ? (
        <Drawer
          variant={matchUpMd ? 'persistent' : 'temporary'}
          anchor="left"
          open={drawerOpen}
          onClose={() => dispatch(openDrawer(!drawerOpen))}
          sx={{
            '& .MuiDrawer-paper': {
              mt: matchDownMd ? 0 : 11,
              zIndex: 1099,
              width: drawerWidth,
              backgroundImage: 'linear-gradient(to bottom, #FFFFFF, #F2F6FE)',
              color: theme.palette.text.primary
            }
          }}
          ModalProps={{ keepMounted: true }}
          color="inherit"
        >
          {matchDownMd && logo}
          {drawer}
        </Drawer>
      ) : !drawerOpen && minimizedDrawerHidden ? null : (
        <MiniDrawerStyled variant="permanent" open={drawerOpen} minimizeddrawerhidden={String(minimizedDrawerHidden)}>
          {logo}
          {drawer}
        </MiniDrawerStyled>
      )}
    </Box>
  );
};

export default memo(Sidebar);
