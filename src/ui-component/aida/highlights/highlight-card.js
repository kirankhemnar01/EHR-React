import { useState, useEffect } from 'react';

// material-ui
import {
  Box,
  IconButton,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Button,
  OutlinedInput,
  Stack,
  CircularProgress
} from '@mui/material';

import BorderColorTwoToneIcon from '@mui/icons-material/BorderColorTwoTone';
import DeleteTwoToneIcon from '@mui/icons-material/DeleteTwoTone';
import CloseIcon from '@mui/icons-material/Close';

import useAida from 'hooks/useAida';
import { getReviewerInfoForUserAvatar, relativeDate } from 'helpers';
import { UserAvatar } from 'ui-component/aida/base/user-avatar';
import { ActionableDocTag as DeletableDocTag } from 'ui-component/aida/base';
import { HighlightTextView } from './highlight-text-view';
import { TagsAutocomplete } from './tags-autocomplete';
import { useHighlightsContext } from './context';

export const HighlightCard = ({ highlight, tagOptions, openDeleteConfirmDialog, onSizeChanged, sx, onClose }) => {
  const { reviewers } = useAida();
  const { onUpdate, scrollToHighlightText } = useHighlightsContext();

  const [tags, setTags] = useState([]);

  // init tags from highlight.tags
  useEffect(() => {
    if (highlight.tags.length > 0 && tagOptions.length > 0) {
      setTags(
        highlight.tags.map((tid) => tagOptions.find((tag) => tag.id === tid)).filter((tag) => !!tag) // remove non-existing tag
      );
    }
  }, [highlight.tags, tagOptions]);

  const [editing, setEditing] = useState(false);

  const setEditingMode = (mode) => {
    setEditing(mode);
    if (onSizeChanged) onSizeChanged();
  };

  const [commentInputValue, setCommentInputValue] = useState(highlight.comment);

  const [busy, setBusy] = useState(false);
  const handleUpdateHighlight = async () => {
    const param = {
      highlightId: highlight.id,
      textSpan: highlight.text_span,
      color: highlight.color,
      text: highlight.text,
      tags: tags.map((t) => t.id),
      comment: commentInputValue
    };
    setBusy(true);
    await onUpdate(param);
    setEditing(false);
    setBusy(false);

    // try to close the highlight popover which is in the doc text view
    if (onClose) {
      onClose();
    }
  };

  /*
  const scrollToHighlightText = () => {
    if (objectType === 'protocol') {
      const iframe = document.getElementById(PROTOCOL_HIGHLIGHT_IFRAME_ID);
      const e = iframe.contentDocument.querySelector(`[data-highlight-id="${highlight.text_span.id}"]`);
      if (e) e.scrollIntoView();
    } else {
      const elems = document.getElementsByClassName(`generic-highlight-id-${highlight.id}`);
      if (elems.length > 0) elems[0].scrollIntoView();
    }
  };
  */

  return (
    <Card
      className={`HighlightCard HighlightCard-${highlight.id}`}
      elevation={3}
      sx={{
        flexGrow: 1,
        mb: 3,
        boxShadow: 'none',
        border: '1px solid #D9D9D9',
        '&:hover': {
          boxShadow:
            '0px 3px 3px -2px rgb(0 0 0 / 20%), 0px 3px 4px 0px rgb(0 0 0 / 14%), 0px 1px 8px 0px rgb(0 0 0 / 12%)'
        },
        ...sx
      }}
    >
      <CardHeader
        avatar={
          <UserAvatar
            user={getReviewerInfoForUserAvatar(highlight.reviewer_id, reviewers)}
            sx={{
              width: 23,
              height: 23,
              fontWeight: 500,
              fontSize: '0.8rem'
            }}
          />
        }
        action={
          <Box sx={{ display: 'flex', ml: 1 }}>
            {!editing && (
              <IconButton size="small" onClick={() => setEditingMode(true)}>
                <BorderColorTwoToneIcon />
              </IconButton>
            )}
            <IconButton size="small" onClick={() => openDeleteConfirmDialog(highlight.id)}>
              <DeleteTwoToneIcon />
            </IconButton>
            {onClose && (
              <IconButton size="small" sx={{ ml: 2 }} onClick={onClose}>
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        }
        title={
          <Typography variant="h5"> {getReviewerInfoForUserAvatar(highlight.reviewer_id, reviewers).name}</Typography>
        }
        subheader={relativeDate(highlight.date_created || highlight.date_modified)}
      />
      <CardContent sx={{ display: 'flex', flexDirection: 'column', pt: 0 }}>
        <Stack direction="column" spacing={2}>
          <HighlightTextView
            onSizeChanged={onSizeChanged}
            text={highlight.text}
            highlightColor={highlight.color}
            onClick={() => scrollToHighlightText(highlight)}
          />
          {!editing && (
            <>
              <Typography variant="body1">{highlight.comment}</Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', flexFlow: 'wrap' }} spacing={1}>
                {(highlight.tags || []).map((tagId) => (
                  <DeletableDocTag tagId={tagId} key={tagId} />
                ))}
              </Box>
            </>
          )}

          {editing && (
            <>
              <OutlinedInput
                fullWidth
                placeholder="Add a comment"
                multiline
                rows={3}
                value={commentInputValue}
                onChange={(event) => setCommentInputValue(event.target.value)}
                size="small"
              />
              <TagsAutocomplete tags={tags} setTags={setTags} refresh={onSizeChanged} />
              <Stack sx={{ mt: 2 }} direction="row" spacing={1}>
                <Box sx={{ flexGrow: 1 }} />
                <Button size="small" variant="outlined" onClick={() => setEditingMode(false)}>
                  Cancel
                </Button>
                <Button size="small" variant="contained" onClick={handleUpdateHighlight} disabled={busy}>
                  Save
                  {busy && <CircularProgress size={16} sx={{ ml: 1 }} />}
                </Button>
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};
