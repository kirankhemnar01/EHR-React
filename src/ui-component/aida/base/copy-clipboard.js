import CopyToClipboard from 'react-copy-to-clipboard';
import { SvgIcon, Box } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useDispatch } from 'store';
import { openSnackbar } from 'store/slices/snackbar';

export const CopyClipboard = ({
  text,
  label = '',
  sx = {},
  containerSx = {},
  ...others
}) => {
  const dispatch = useDispatch();
  const handleCopy = () => {
    dispatch(openSnackbar({
      open: true,
      message: 'Copied to clipboard',
      variant: 'alert',
      alert: { sx: { bgcolor: theme => theme.palette.grey['900'], color: 'white' } }
    }));
  }

  return (
    <CopyToClipboard text={text} onCopy={handleCopy}>
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', ...containerSx }}
      >
        <SvgIcon
          component={ContentCopyIcon}
          sx={{
            color: theme => theme.palette.grey['200'],
            '&:hover': { color: theme => theme.palette.primary.main },
            ...sx
          }}
          {...others}
        />

        {label}
      </Box>
    </CopyToClipboard>
  )
}
