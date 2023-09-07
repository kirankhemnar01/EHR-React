import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Typography
} from '@mui/material';

export const RenameDialog = ({ open, onClose, name, onChange, onSubmit, title }) => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      setBusy(true);
      setError('');
      await onSubmit();
      onClose();
    } catch (e) {
      setError(e.message ?? JSON.stringify(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Name"
          fullWidth
          variant="standard"
          value={name}
          onChange={(e) => onChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, alignItems: 'center' }}>
        {error && (
          <Typography sx={{ flexGrow: 1 }} color="error">
            {error}
          </Typography>
        )}
        <Button onClick={onClose} sx={{ width: 80 }} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          sx={{ width: 120, display: 'flex', alignItems: 'center', gap: 1 }}
          variant="contained"
        >
          Change
          {busy && <CircularProgress color="warning" size={16} />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
