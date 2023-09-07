import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  CircularProgress
} from '@mui/material';
import { TypographyWithPopover } from './typography';
import { useNotification } from 'hooks/use-notification';

export const ConfirmDialog = ({
  sx = {},
  title,
  target,
  subtitle,
  description,
  open,
  onClose,
  cancel = 'Cancel',
  yes = 'Yes',
  onYes
}) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { notifyError } = useNotification();

  const handleSubmit = async () => {
    try {
      setBusy(true);
      setError('');
      await onYes();
      onClose();
    } catch (e) {
      notifyError(e.message ?? JSON.stringify(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog {...{ sx, open, onClose }}>
      <DialogTitle id="alert-dialog-title" sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {title}
        {target && (
          <TypographyWithPopover
            noWrap
            sx={{ mx: 1, color: (theme) => theme.palette.grey['700'], fontWeight: 600, fontSize: 16, maxWidth: 200 }}
          >
            {target}
          </TypographyWithPopover>
        )}
      </DialogTitle>
      <DialogContent>
        {subtitle && (
          <Typography sx={{ color: (theme) => theme.palette.grey['900'], fontWeight: 600, fontSize: 16 }}>
            {subtitle}
          </Typography>
        )}
        <Box sx={{ mt: 2 }}>{description}</Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, alignItems: 'center' }}>
        {error && (
          <Typography sx={{ flexGrow: 1 }} color="error">
            {error}
          </Typography>
        )}
        <Button onClick={onClose} sx={{ width: 80, lineHeight: '24px' }} autoFocus variant="outlined">
          {cancel}
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{ width: 120, display: 'flex', alignItems: 'center', gap: 1, lineHeight: '24px' }}
          variant="contained"
          disabled={busy}
        >
          {yes}
          {busy && <CircularProgress color="warning" size={16} />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
