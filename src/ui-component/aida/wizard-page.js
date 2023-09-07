import { Container, Box, Button, SvgIcon, useMediaQuery, CircularProgress } from '@mui/material';
import ChevronLeftOutlinedIcon from '@mui/icons-material/ChevronLeftOutlined';

export const WizardPage = ({ prev, onPrev, next, onNext, busy, children, disabled }) => {
  const downMD = useMediaQuery(theme => theme.breakpoints.down('md'));

  const left = (
    <Button
      variant="outlined"
      sx={{ height: 32, fontSize: 12, lineHeight: 1.5, mr: 4, minWidth: 'unset', px: 2 }}
      onClick={onPrev}
      startIcon={<SvgIcon><ChevronLeftOutlinedIcon /></SvgIcon>}
      disabled={disabled}
    >
      {prev}
    </Button>
  );

  const right = (
    <Button
      variant="contained"
      sx={{ height: 32, fontSize: 12, lineHeight: 1.5, ml: 4, minWidth: 'unset', px: 2 }}
      onClick={busy ? () => { } : onNext}
      disabled={disabled}
    >
      {next}
      {busy && <CircularProgress size={20} color='warning' sx={{ ml: 1 }} />}
    </Button>
  );

  const sx = (
    downMD ? {} :
    { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }
  );
    
  return (
    <Container maxWidth='md' sx={sx}>
      {downMD ? (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {left}
            {right}
          </Box>
          <Box sx={{ my: 1 }}>
            {children}
          </Box>
        </>
      ) : (
        <>
          {left}
          <Box sx={{ flexGrow: 1 }}>
            {children}
          </Box>
          {right}
        </>
      )}
    </Container>
  )
}