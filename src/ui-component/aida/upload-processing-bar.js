import { useState } from 'react';
import { Box, Button, CircularProgress, Typography } from '@mui/material';

import useAuth from 'hooks/useAuth';
import { useNotification } from 'hooks/use-notification';
import { sentryException } from 'helpers';
import { sentryEvents } from 'aida-constants';
import { ConfirmDialog } from 'ui-component/aida/base';

export const UploadProcessingBar = ({ projectId, uploadId, onReload, status, runUpload, cancelUpload, downloadLog }) => {
  const { user } = useAuth();
  const { notifyError, notifySuccess } = useNotification();
  
  const [running, setRunning] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const captureException = sentryException(user, projectId, { uploadId });

  const inProgress = running || status === 'in_progress';

  const onDeploy = async () => {
    setRunning(true);
    try {
      if (inProgress) {
        await cancelUpload(projectId, uploadId);
      } else {
        await runUpload(projectId, uploadId);
      }
      await onReload(projectId, uploadId);
      notifySuccess('Upload rerun request was sent successfully. Job is running');
    } catch (e) {
      captureException(e, {
        userEvent: sentryEvents.uploads.rerunUpload
      });

      notifyError('Downloading process log failed');
    } finally {
      setRunning(false);
    }
  }

  const onViewLog = async () => {
    setDownloading(true);
    try {
      await downloadLog(projectId, uploadId);
    } catch (e) {
      captureException(e, {
        userEvent: sentryEvents.uploads.downloadProcessingLog
      });

      notifyError('Downloading process log failed');
    } finally {
      setDownloading(false);
    }
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, my: 2 }}>
      <Button
        onClick={() => setShowConfirm(true)}
        sx={{ minWidth: 96, display: 'flex', alignItems: 'center', gap: 2, lineHeight: 1.8 }}
        variant='contained'
      >
        {inProgress ? 'Cancel' : 'Rerun'}
      </Button>

      <Button
        onClick={onViewLog}
        sx={{ minWidth: 96, display: 'flex', alignItems: 'center', gap: 2, lineHeight: 1.8 }}
        variant='text'
        disabled={downloading}
      >
        View processing log
        {downloading && <CircularProgress size={20} />}
      </Button>

      <ConfirmDialog
        sx={{
          '& .MuiDialog-paper': { maxWidth: 480 },
          '& .MuiDialogContent-root > div': {
            mt: 0
          }
        }}
        title={inProgress ? 'Cancel' : 'Rerun'}
        description={
          <Typography>
            {inProgress ? 'Are you sure you want to cancel the upload?' : 'Are you sure you want to rerun the upload?'}
          </Typography>
        }
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onYes={onDeploy}
      />
    </Box>
  )
}