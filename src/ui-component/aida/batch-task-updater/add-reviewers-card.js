import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Box, Stack, Typography, CircularProgress } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { useNotification } from 'hooks/use-notification';
import { MultipleReviewersAutocomplete } from 'ui-component/aida/base';

export const AddReviewersCard = ({ onSave, onClose }) => {
  const theme = useTheme();
  const { notifyError, notifySuccess } = useNotification();

  const [reviewers, setReviewers] = useState([]);
  const [saving, setSaving] = useState(false);

  const handleApply = async () => {
    setSaving(true);
    try {
      await onSave(reviewers);
      notifySuccess('Reviewers assigned successfully');
    } catch (e) {
      notifyError(e.message ?? 'Unknown error in assigning reviewers');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainCard
      className="BatchTaskUpdaterAddReviewersContent"
      border={false}
      elevation={16}
      content={false}
      boxShadow
      shadow={theme.shadows[16]}
      sx={{ width: '450px', p: 4 }}
    >
      <Box sx={{ position: 'relative' }}>
        <Typography variant="h3" mb={3}>
          Assign Reviewers
        </Typography>

        <MultipleReviewersAutocomplete
          name="reviewerIds"
          value={reviewers}
          onChange={(e, value) => {
            setReviewers(value);
          }}
        />

        <Stack direction="row" spacing={2} sx={{ justifyContent: 'end', mt: 2 }}>
          <Button variant="contained" disabled={!reviewers.length} onClick={handleApply}>
            Apply
            {saving && <CircularProgress color="warning" size={16} sx={{ ml: 2 }} />}
          </Button>
          <Button variant="outlined" onClick={onClose}>
            Cancel
          </Button>
        </Stack>
      </Box>
    </MainCard>
  );
};
