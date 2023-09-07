import PropTypes from 'prop-types';
import { Box } from '@mui/material';

export const TabPanel = ({ children, value, index, sx = {}, ...other }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box
          sx={{
            p: 0,
            ...sx
          }}
        >
          {children}
        </Box>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
};
