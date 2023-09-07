import { useState, useEffect } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  LinearProgress,
  Button,
  FormControlLabel,
  Switch
} from '@mui/material';

import PerfectScrollbar from 'react-perfect-scrollbar';

import useAida from 'hooks/useAida';
import { ErrorMessage, SearchBar } from 'ui-component/aida/base';
import { HighlightCard } from 'ui-component/aida/highlights/highlight-card';
import { useHighlightsContext } from './context';

export const HighlightsListPanel = ({ sx = {}, perfectScrollbarHeight = 'calc(100vh)' }) => {
  const {
    highlightsData,
    loading,
    error,
    onDelete,
    curHighlightId,
    setCurHighlightId,
    hideAllHighlights,
    setHideAllHighlights
  } = useHighlightsContext();

  const { tagGroups: tagGroupsData } = useAida();
  const { data: tagGroups } = tagGroupsData;

  const [tagOptions, setTagOptions] = useState([]);
  useEffect(() => {
    const options = [];
    if (tagGroups && tagGroups.length)
      tagGroups.forEach((tagGroup) => {
        tagGroup.tags.forEach((tag) => {
          options.push({ label: tag.name, group: tagGroup.name, id: tag.tag_id });
        });
      });
    setTagOptions(options);
  }, [tagGroups]);

  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false);

  const openDeleteConfirmDialog = (highlightId) => {
    setDeleteConfirmDialogOpen(true);
    setCurHighlightId(highlightId);
  };

  const handleDeleteHighlight = async () => {
    await onDelete({ highlightId: curHighlightId });
    setDeleteConfirmDialogOpen(false);
  };

  const handleSwitchChange = (event) => {
    setHideAllHighlights(event.target.checked);
  };

  let content;
  if (loading) content = <LinearProgress />;
  else if (error) content = <ErrorMessage error={error} />;
  else if (highlightsData)
    content = highlightsData?.map((highlight) => (
      <HighlightCard
        key={highlight.id}
        highlight={highlight}
        openDeleteConfirmDialog={openDeleteConfirmDialog}
        tagOptions={tagOptions}
      />
    ));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', ...sx }}>
      <FormControlLabel
        sx={{ mb: 1 }}
        control={<Switch checked={hideAllHighlights} onChange={handleSwitchChange} />}
        label="Hide all highlights"
      />
      <SearchBar sx={{ width: '100%', mb: 2, mt: 1 }} />
      <PerfectScrollbar style={{ height: perfectScrollbarHeight, padding: '8px' }}>{content}</PerfectScrollbar>
      <Dialog
        open={deleteConfirmDialogOpen}
        onClose={() => setDeleteConfirmDialogOpen(false)}
        aria-labelledby="Delete highlight confirmation"
        aria-describedby="Delete highlight confirmation"
      >
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>Delete this highlight?</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteHighlight} color="error">
            Yes
          </Button>
          <Button onClick={() => setDeleteConfirmDialogOpen(false)} autoFocus>
            No
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
