import { Link as RouterLink } from 'react-router-dom';

// material-ui
import { Link, Typography } from '@mui/material';

// project imports
import { DASHBOARD_PATH } from 'config';
import Logo from 'ui-component/Logo';

// ==============================|| MAIN LOGO ||============================== //

const LogoSection = ({ height = 36 }) => (
  <Link
    component={RouterLink}
    to={DASHBOARD_PATH}
    sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
  >
    <Logo height={height} />
    <Typography
      sx={{
        ml: 0.5,
        fontSize: '1.125rem',
        fontWeight: 500,
        fontFamily: 'Inter',
        color: (theme) => theme.palette.grey['800']
      }}
    >
      AIDA
    </Typography>
  </Link>
);

export default LogoSection;
