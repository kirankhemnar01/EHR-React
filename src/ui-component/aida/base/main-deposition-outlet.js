import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useDepositionMenus } from 'hooks/useAida';

export const MainDepositionOutlet = () => {
  useDepositionMenus(false, false);

  return (
    <Box sx={{ height: '100%', backgroundColor: 'white' }}>
      <Outlet />
    </Box>
  );
};
