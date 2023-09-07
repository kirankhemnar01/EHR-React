import { useState, useEffect } from 'react';

import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  OutlinedInput,
  Stack,
  CircularProgress
} from '@mui/material';

import CloseIcon from '@mui/icons-material/Close';

import { HIGHLIGHT_DEFAULT_COLOR } from 'config';
import { getReviewerInfoForUserAvatar } from 'helpers/utils';
import useAida from 'hooks/useAida';
import useAuth from 'hooks/useAuth';
import { UserAvatar } from 'ui-component/aida/base/user-avatar';
import { HighlightTextView } from './highlight-text-view';
import { TagsAutocomplete } from './tags-autocomplete';
import { useHighlightsContext } from './context';

// objectType: 'protocol', 'document'
export const HighlightDialog = ({ open, setOpen, data, refresh }) => {
  const { user } = useAuth();
  const { onCreate } = useHighlightsContext();
  const { reviewers } = useAida();
  const [tags, setTags] = useState([]);
  const [commentInputValue, setCommentInputValue] = useState('');

  // reset
  useEffect(() => {
    setTags([]);
    setCommentInputValue('');
  }, [open]);

  const [busy, setBusy] = useState(false);
  const handleSaveClick = async () => {
    const param = {
      ...data,
      tags: tags.map((t) => t.id),
      color: HIGHLIGHT_DEFAULT_COLOR,
      comment: commentInputValue
    };

    setBusy(true);
    await onCreate(param);
    setBusy(false);
    setOpen(false);
  };

  const reviewer = getReviewerInfoForUserAvatar(user.user_id, reviewers);

  const onClose = () => {
    if (refresh) refresh();
    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={onClose} hideBackdrop>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <UserAvatar user={reviewer} />
          <Typography variant="h4" sx={{ mx: 1 }}>
            {reviewer.name}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex' }}>
            <IconButton
              aria-label="close"
              sx={{
                color: (theme) => theme.palette.grey[500]
              }}
              onClick={onClose}
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>
      </DialogTitle>
      <DialogContent
        sx={{
          '& .MuiAutocomplete-popup': {
            zIndex: '999999 !important'
          }
        }}
      >
        <Stack direction="column" spacing={2}>
          <HighlightTextView text={data.text} highlightColor={HIGHLIGHT_DEFAULT_COLOR} />
          <OutlinedInput
            fullWidth
            placeholder="Add a comment"
            multiline
            rows={3}
            value={commentInputValue}
            onChange={(event) => setCommentInputValue(event.target.value)}
            size="small"
          />
          <TagsAutocomplete tags={tags} setTags={setTags} sx={{ minWidth: '390px' }} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 4 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSaveClick} disabled={busy}>
          Save
          {busy && <CircularProgress size={16} sx={{ ml: 1 }} />}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
