import { useEffect, useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Button, Box, ClickAwayListener, Paper, Popover, useMediaQuery } from '@mui/material';
import Transitions from 'ui-component/extended/Transitions';
import useAida from 'hooks/useAida';
import { SetTagsCard } from './set-tags-card';
import { AddTagsCard } from './add-tags-card';
import { RemoveTagsCard } from './remove-tags-card';

// objectType: document, learningTask, reviewTask
export const BulkAnnotations = ({
  tags = true,
  predictedTags = true,
  onApply
}) => {
  const theme = useTheme();

  const [action, setAction] = useState('add');
  const [open, setOpen] = useState(false);

  const { tagGroups: tagGroupsData } = useAida();
  const { data: tagGroups } = tagGroupsData;

  const anchorRef = useRef(null);
  const matchesXs = useMediaQuery(theme.breakpoints.down('md'));

  const handleOpenSetTags = () => {
    setOpen(true);
    setAction('set');
  };

  const handleOpenAddTags = () => {
    setOpen(true);
    setAction('add');
  };

  const handleOpenRemoveTags = () => {
    setOpen(true);
    setAction('remove');
  };

  const handleOpenPredictedTags = () => {
    setOpen(true);
    setAction('add-predicted');
  }

  const handleOpenRemovePredictedTags = () => {
    setOpen(true);
    setAction('remove-predicted');
  }

  const onClose = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
    setAction('');
  };

  const onSave = async (labels) => {
    await onApply(action, labels);
    setOpen(false);
    setAction('');
  }

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
        className="BulkAnnotations"
        sx={{
          my: 1, ml: 2, mr: 3,
          [theme.breakpoints.down('md')]: {
            mr: 2
          },
          display: 'flex'
        }}
      >
        <Button ref={anchorRef} onClick={handleOpenSetTags} variant="text">
          Annotate
        </Button>
        {tags && (
          <>
            <Button
              variant="text"
              sx={{ ml: 1 }}
              ref={anchorRef}
              onClick={handleOpenAddTags}
            >
              Add tags
            </Button>
            <Button
              variant="text"
              sx={{ ml: 1 }}
              ref={anchorRef}
              onClick={handleOpenRemoveTags}
            >
              Remove tags
            </Button>
          </>
        )}
        {predictedTags && (
          <>
            <Button
              variant="text"
              sx={{ ml: 1 }}
              ref={anchorRef}
              onClick={handleOpenPredictedTags}
            >
              Add predicted tags
            </Button>
            <Button
              variant="text"
              sx={{ ml: 1 }}
              ref={anchorRef}
              onClick={handleOpenRemovePredictedTags}
            >
              Remove predicted tags
            </Button>
          </>
        )}
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
              {open && action === 'set' && (
                <SetTagsCard {...{ onSave, onClose, tagGroups }} />
              )}
              {open && (action === 'add' || action === 'add-predicted') && (
                <AddTagsCard {...{ onSave, onClose, tagGroups }} />
              )}
              {open && (action === 'remove' || action === 'remove-predicted') && (
                <RemoveTagsCard {...{ onSave, onClose, tagGroups }} />
              )}
            </Paper>
          </Transitions>
        </ClickAwayListener>
      </Popover>
    </>
  );
};
