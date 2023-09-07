import { Box, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

export const BusyBox = styled(Box)(({ styles }) => ({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  left: 0, top: 0,
  pointerEvents: 'none',
  zIndex: 1000,
  cursor: 'not-allowed',
  backgroundColor: '#88888810',
  ...styles
}));

export const Overlay = ({ styles }) => (
  <BusyBox styles={styles}>
    <CircularProgress />
  </BusyBox>
);
