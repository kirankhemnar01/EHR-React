import { useState, useMemo } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Box, Stack, Autocomplete, TextField, Typography, CircularProgress } from '@mui/material';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { CustomPopper } from 'ui-component/aida/custom';
import { useNotification } from 'hooks/use-notification';
import { TAG_MAX_VALUE } from 'aida-constants';

export const AddTagsCard = ({ onSave, onClose, tagGroups }) => {
  const theme = useTheme();
  const { notifyError, notifySuccess } = useNotification();

  const [labels, setLabels] = useState([]);
  const [saving, setSaving] = useState(false);

  const tagOptions = useMemo(() => {
    const options = [];
    if (tagGroups && tagGroups.length) {
      tagGroups.forEach((tagGroup) => {
        tagGroup.tags.forEach((tag) => {
          options.push({
            label: tag.name,
            group: tagGroup.name,
            groupId: tagGroup.tag_group_id,
            groupMutuallyExclusive: tagGroup?.mutually_exclusive ?? false,
            id: tag.tag_id,
            valueType: tag.value_type
          });
        });
      });
    }

    return options;
  }, [tagGroups]);

  const onFilterTagsChanged = (_, value, reason) => {
    let tags = [];
    if (reason === 'selectOption') {
      // handle the mutually exclusive options
      let previousTags = value.slice(0, -1);
      const currentAddedTag = value[value.length - 1];
      if (currentAddedTag.groupMutuallyExclusive) {
        previousTags = previousTags.filter((tag) => tag.groupId !== currentAddedTag.groupId);
      }

      tags = [...previousTags, currentAddedTag];
    } else {
      tags = value;
    }

    tags.sort((a, b) => {
      if (a.tag_id < b.tag_id) return -1;
      if (a.tag_id > b.tag_id) return 1;
      return 0;
    });

    setLabels(tags);
  };

  const handleApply = async () => {
    setSaving(true);
    try {
      const tags = labels.map((label) => {
        if (label.valueType === 'text') return { tag_id: label.id, value: TAG_MAX_VALUE, text: 'bulk add tags' };
        return { tag_id: label.id, value: TAG_MAX_VALUE };
      });

      await onSave(tags);
      notifySuccess('Tags added successfully');
    } catch (e) {
      notifyError(e.message ?? 'Unknown error in adding tags');
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainCard
      className="BulkAnnotationsAddTagsContent"
      border={false}
      elevation={16}
      content={false}
      boxShadow
      shadow={theme.shadows[16]}
      sx={{ width: '450px', p: 4 }}
    >
      <Box sx={{ position: 'relative' }}>
        <Typography variant="h3" mb={3}>
          Add Tags
        </Typography>
        <Autocomplete
          multiple
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          options={tagOptions}
          groupBy={(option) => option.group}
          onChange={onFilterTagsChanged}
          value={labels}
          renderInput={(params) => <TextField {...params} label="Tag" />}
          PopperComponent={CustomPopper}
        />
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'end', mt: 2 }}>
          <Button variant="contained" disabled={!labels.length} onClick={handleApply}>
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
