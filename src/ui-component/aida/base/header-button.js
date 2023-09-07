// material-ui
import { useTheme } from '@mui/material/styles';
import { IconButton, Tooltip } from '@mui/material';

export const HeaderButton = ({ children, title, ...rest }) => {
  const theme = useTheme();

  return (
    <Tooltip title={title}>
      <IconButton
        sx={{
          mr: 1.5,
          [theme.breakpoints.down('md')]: {
            mr: 1
          }
        }}
        {...rest}
      >
        {children}
      </IconButton>
    </Tooltip>
  );
};
