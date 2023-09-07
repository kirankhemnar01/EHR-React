import { useEffect, useRef, useState } from 'react';
import { Dialog, DialogActions, Button, DialogTitle, DialogContent, Box, CircularProgress, Typography, TextField } from '@mui/material';
import { Dashboard } from '@uppy/react';
import Loader from 'ui-component/Loader';
import Uppy from '@uppy/core';
import '@uppy/core/dist/style.css';
import '@uppy/dashboard/dist/style.css';
import '@uppy/drag-drop/dist/style.css';


export const UploadDialog = ({ title, open, onClose, uploadFiles, hasName = false, allowedTypes = undefined }) => {
  const uppyRef = useRef();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState('');

  const onUpload = async () => {

    if (uppyRef.current) {
      const files = uppyRef.current.getFiles();
      if (!files.length) return;

      setBusy(true);
      try {
        await uploadFiles(files, name);
        onClose();
      } catch (e) {
        setError(e);
      } finally {
        setBusy(false);
        uppyRef.current.reset();
      }
    }
  };

  useEffect(() => {
    uppyRef.current = new Uppy({
      id: 'protocol-upload',
      allowMultipleUploadBatches: true,
      restrictions: {
        maxNumberOfFiles: 20,
        allowedFileTypes: allowedTypes
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (uppyRef.current) {
      uppyRef.current.setOptions({
        restrictions: { allowedFileTypes: allowedTypes }
      });
    }
  }, [allowedTypes])

  if (!uppyRef.current) return <Loader />;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        '& > .MuiDialog-container > .MuiPaper-root': {
          width: 480
        }
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ '& .uppy-Dashboard-inner': { width: 480 } }}>
          {hasName && (
            <TextField
              required
              value={name}
              label="Name"
              onChange={(e) => setName(e.target.value)}
              size="small"
              fullWidth
              sx={{ my: 1 }}
            />
          )}
          <Dashboard
            showProgressDetails
            uppy={uppyRef.current}
            closeModalOnClickOutside
            open={open}
            disableStatusBar
            onRequestClose={onClose}
            locale={{ strings: { myDevice: 'My Computer' } }}
            proudlyDisplayPoweredByUppy={false}
            plugins={['DragDrop', 'GoogleDrive', 'OneDrive']}
            note="Limit 20 Files Per Upload"
          />
          {error && <Typography color="error">{error}</Typography>}
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: '16px 24px 0' }}>
        <Button variant="outlined" onClick={onClose} sx={{ lineHeight: '24px' }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={onUpload} sx={{ width: 120, lineHeight: '24px' }} disabled={hasName && !name}>
          Upload
          {busy && <CircularProgress size={16} sx={{ marginLeft: 2 }} color="warning" />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
