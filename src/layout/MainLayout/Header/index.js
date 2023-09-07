import PropTypes from 'prop-types';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Avatar, Box } from '@mui/material';

// project imports
import LogoSection from '../LogoSection';
import MobileSection from './MobileSection';
import ProfileSection from './ProfileSection';

import SitesSection from './SitesSection';
import { useSelector } from 'store';
import { getMenuItems } from 'store/slices/menu';
import Breadcrumb from 'ui-component/extended/Breadcrumbs';
import { HeaderButton } from 'ui-component/aida/base';
import { AidaChatsButton } from 'views/workspaces/AidaChats/aida-chats-button';

// assets
import { IconChevronRight } from '@tabler/icons';
import { ReactComponent as MenuIcon } from 'assets/images/menu.svg';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';

// ==============================|| MAIN NAVBAR / HEADER ||============================== //

const Header = ({ handleDrawerToggle, height = 36 }) => {
  const theme = useTheme();

  const menuItems = useSelector(getMenuItems);
  const navigation = menuItems;
  const { headerLeft, headerRight, headerCenter } = useSelector((state) => state.header);
  return (
    <>
      {/* logo & toggler button */}
      <Box
        sx={{
          width: 228,
          ml: -1,
          display: 'flex',
          [theme.breakpoints.down('md')]: {
            width: 'auto'
          }
        }}
      >
        <Avatar
          variant="rounded"
          sx={{
            ...theme.typography.commonAvatar,
            ...theme.typography.mediumAvatar,
            width: 36,
            height: 36,
            overflow: 'hidden',
            transition: 'all .2s ease-in-out',
            background: 'transparent',
            '&:hover': {
              background: theme.palette.mode === 'dark' ? theme.palette.dark.main : theme.palette.secondary.light,
              color: theme.palette.mode === 'dark' ? theme.palette.secondary.main : theme.palette.secondary.dark
            },
            mr: 1
          }}
          onClick={handleDrawerToggle}
          color="inherit"
          id="sidebar-toggler"
        >
          <MenuIcon stroke={1.5} size="20px" />
        </Avatar>

        <Box component="span" sx={{ display: { xs: 'none', md: 'block', height: 36 }, flexGrow: 1 }}>
          <LogoSection height={height} />
        </Box>
      </Box>

      {headerLeft ? (
        <Box
          sx={{
            mb: '0px !important',
            ml: '16px !important',
            color: '#616161',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          {headerLeft}
        </Box>
      ) : (
        <Breadcrumb
          navigation={navigation}
          separator={IconChevronRight}
          sx={{
            mb: '0px !important',
            ml: '25px !important'
          }}
        />
      )}

      <Box sx={{ flexGrow: 1 }}> {headerCenter}</Box>

      <AidaChatsButton />
      {headerRight}

      <HeaderButton title="Help" onClick={() => window.open('https://support.laer.ai')}>
        <HelpOutlineOutlinedIcon />
      </HeaderButton>

      <SitesSection />

      {/* notification & profile */}

      {/*
      // 

      <HeaderButton title="Settings">
        <SettingsOutlinedIcon />
      </HeaderButton>
      */}

      <ProfileSection />

      {/* mobile header */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        <MobileSection />
      </Box>
    </>
  );
};

Header.propTypes = {
  handleDrawerToggle: PropTypes.func
};

export default Header;
