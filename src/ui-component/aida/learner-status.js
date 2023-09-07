import { useState, useEffect } from 'react';
import { Box, Typography, MenuItem, Menu, IconButton, CircularProgress } from '@mui/material';
import CircleIcon from '@mui/icons-material/Circle';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { getLearnerStatus, startLearner, stopLearner } from 'service/learning';
import { useNotification } from 'hooks/use-notification';
import { sentryEvents } from 'aida-constants';
import { sentryException } from 'helpers/sentry';
import useAuth from 'hooks/useAuth';
import { useCheckTaskPending } from 'hooks/use-task-pending';

const TIMEOUT_INTERVAL = 1000; // 1s
const MAX_TIMES = 120; // total 2 minute

export const LearnerStatus = ({ projectId, learnerId, sx = {} }) => {
  const { user } = useAuth();

  const captureException = sentryException(user, projectId, { learnerId });

  const { notifyError } = useNotification();
  const [status, setStatus] = useState('');

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const [busy, setBusy] = useState(false);
  const { addTask, inProgress, completedCount } = useCheckTaskPending(
    'learner',
    TIMEOUT_INTERVAL,
    MAX_TIMES,
    null,
    notifyError,
    captureException
  );

  const loading = busy || inProgress;

  const handleStopLearner = async () => {
    setBusy(true);
    try {
      const task = await stopLearner({ projectId, learnerId });
      addTask(task);
    } catch (err) {
      captureException(err, {
        userEvent: sentryEvents.activeLearning.stopLearner
      });
      notifyError('Failed to stop learner.');
    } finally {
      setBusy(false);
    }
  };

  const handleStartLearner = async () => {
    setBusy(true);
    try {
      const task = await startLearner({ projectId, learnerId });
      addTask(task);
    } catch (err) {
      captureException(err, {
        userEvent: sentryEvents.activeLearning.startLearner
      });
      notifyError('Failed to start learner.');
    } finally {
      setBusy(false);
    }
  };

  const handleMenuItem = async (key) => {
    handleCloseMenu();
    switch (key) {
      case 'start':
        handleStartLearner();
        break;
      case 'stop':
        handleStopLearner();
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const fetchStatus = async () => {
      setBusy(true);
      try {
        const learnerStatus = await getLearnerStatus({ projectId, learnerId });
        setStatus(learnerStatus?.status);
      } catch (err) {
        captureException(err, {
          userEvent: sentryEvents.activeLearning.getLearnerStatus
        });
        notifyError('Failed to get learner status.');
      } finally {
        setBusy(false);
      }
    };
    if (learnerId) fetchStatus();
    // eslint-disable-next-line
  }, [learnerId, completedCount]);

  const running = ['running', 'starting'].includes(status?.toLowerCase());
  return (
    <Box
      className="LearnerStatus"
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        color: running ? '#12B76A' : '#757575',
        ...sx
      }}
    >
      <CircleIcon sx={{ fontSize: '0.8em', mr: 1 }} />
      {status && <Typography sx={{ textTransform: 'capitalize' }}>{status}</Typography>}
      <IconButton
        aria-label="Start/Stop learner"
        aria-controls={open ? 'learner-menu' : undefined}
        aria-expanded={open ? 'true' : undefined}
        aria-haspopup="true"
        onClick={handleOpenMenu}
        size="small"
      >
        <ExpandMoreIcon fontSize="inherit" />
        {loading && <CircularProgress size={16} sx={{ ml: 1, lineHeight: 1.8 }} />}
      </IconButton>
      <Menu anchorEl={anchorEl} open={open} onClose={handleCloseMenu}>
        <MenuItem disabled={loading || running} onClick={() => handleMenuItem('start')}>
          Start learner
        </MenuItem>
        <MenuItem disabled={loading || !running} onClick={() => handleMenuItem('stop')}>
          Stop learner
        </MenuItem>
      </Menu>
    </Box>
  );
};
