import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Box, ClickAwayListener, Paper, Popover, useMediaQuery } from '@mui/material';
import Transitions from 'ui-component/extended/Transitions';
import { AddReviewersCard } from './add-reviewers-card';
import { RemoveReviewersCard } from './remove-reviewers-card';

export const BatchTaskUpdater = ({ onApply }) => {
  const theme = useTheme();

  const [action, setAction] = useState('add');
  const [open, setOpen] = useState(false);

  const anchorRef = useRef(null);
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenAddReviewers = () => {
    setOpen(true);
    setAction('add');
  };

  const handleOpenRemoveReviewers = () => {
    setOpen(true);
    setAction('remove');
  };

  const onClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
    setAction('');
  };

  const onSave = async (reviewers) => {
    await onApply(action, reviewers);
    setOpen(false);
    setAction('');
  };

  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Box
        className="BatchTaskUpdater"
        sx={{
          my: 1,
          ml: 2,
          mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          },
          display: 'flex'
        }}
      >
        <Button variant="text" sx={{ ml: 1 }} ref={anchorRef} onClick={handleOpenAddReviewers}>
          Assign reviewers
        </Button>
        <Button variant="text" sx={{ ml: 1 }} ref={anchorRef} onClick={handleOpenRemoveReviewers}>
          Remove reviewers
        </Button>
      </Box>

      <Popover
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left'
        }}
        open={open}
        onClose={onClose}
        anchorEl={anchorRef.current}
        BackdropProps={{ invisible: false }}
      >
        <ClickAwayListener onClickAway={onClose}>
          <Transitions position={matchesXs ? 'top' : 'top-right'} in={open}>
            <Paper>
              {open && action === 'add' && <AddReviewersCard {...{ onSave, onClose }} />}
              {open && action === 'remove' && <RemoveReviewersCard {...{ onSave, onClose }} />}
            </Paper>
          </Transitions>
        </ClickAwayListener>
      </Popover>
    </>
  );
};
