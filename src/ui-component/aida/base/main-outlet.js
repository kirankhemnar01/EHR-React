import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import { useProjectMenus, useDepositionMenus } from 'hooks/useAida';

export const MainOutlet = () => {
  useProjectMenus(false, false);

  return (
    <Box sx={{ height: '100%', backgroundColor: 'white', p: '20px' }}>
      <Outlet />
    </Box>
  );
};

export const DepositionMainOutlet = () => {
  useDepositionMenus(false, false);

  return (
    <Box sx={{ height: '100%', backgroundColor: 'white', p: '20px' }}>
      <Outlet />
    </Box>
  );
};
