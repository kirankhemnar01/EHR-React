import { useState } from 'react';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Button, Box, Typography, Divider, Stack, CircularProgress } from '@mui/material';
import PerfectScrollbar from 'react-perfect-scrollbar';

// project imports
import MainCard from 'ui-component/cards/MainCard';
import { ActionableDocTag as DeletableDocTag } from 'ui-component/aida/base';
import { DocTaggingButtonGroups } from 'ui-component/aida/doc-tagging-button-groups';

import { TAG_MAX_VALUE } from 'aida-constants';
import { convertTagValue } from 'helpers/utils';
import { useNotification } from 'hooks/use-notification';

export const SetTagsCard = ({ onSave, onClose, tagGroups }) => {
  const theme = useTheme();
  const { notifyError, notifySuccess } = useNotification();

  const [labels, setLabels] = useState([]);
  // the top applied tags only display final_tags , which are only tags with value > 0
  const appliedLabels = labels.filter((label) => label.value > 0);

  const [saving, setSaving] = useState(false);

  const count = appliedLabels.length;

  const clearAllLabels = () => {
    setLabels([]);
  };

  const deleteTag = (tagId) => {
    setLabels(labels.map((label) => (label.tag_id === tagId ? { ...label, value: 0 } : label)));
  };

  const changeTagAnnotation = ({ groupId, tagId, mutuallyExclusive, tagValue, tagValueType, tagTextValue }) => {
    let newLabels;
    // when the button is unfilled, we can just remove the tag from annotation(value=-1)
    if (tagValue === -1) newLabels = labels.filter((item) => item.tag_id !== tagId);
    else {
      newLabels = labels;
      const convertedTagValue = convertTagValue(tagValue, tagValueType);
      if (tagValueType === 'text' && convertedTagValue !== TAG_MAX_VALUE) tagTextValue = '';

      const tagIndex = labels.findIndex((item) => item.tag_id === tagId);
      if (tagIndex !== -1) {
        // update value for the tag
        newLabels = labels.map((item) => {
          if (item.tag_id === tagId) {
            if (tagValueType === 'text') return { ...item, value: convertedTagValue, text: tagTextValue };
            return { ...item, value: convertedTagValue };
          }
          return item;
        });
      } else if (tagValueType === 'text') {
        newLabels.push({ tag_id: tagId, value: convertedTagValue, text: tagTextValue });
      } else {
        newLabels.push({ tag_id: tagId, value: convertedTagValue });
      }

      if (mutuallyExclusive && tagGroups) {
        const tagGroup = tagGroups.find((g) => g.tag_group_id === groupId);
        const mutuallyExclusiveTagIds = tagGroup.tags.map((t) => t.tag_id).filter((tid) => tid !== tagId);
        newLabels = newLabels.map((item) => {
          if (mutuallyExclusiveTagIds.indexOf(item.tag_id) !== -1) return { ...item, value: 0 };
          return item;
        });
      }
    }

    // sort lables by tag_id
    newLabels.sort((a, b) => {
      if (a.tag_id < b.tag_id) return -1;
      if (a.tag_id > b.tag_id) return 1;
      return 0;
    });

    setLabels([...newLabels]);
  };

  const handleApply = async () => {
    setSaving(true);
    try {
      await onSave(labels);
      notifySuccess('Tags set successfully');
    } catch (e) {
      notifyError(e.message ?? 'Unknown error in setting tags');
    } finally {
      setSaving(false);
    }
  };

  const [previewingGroupId, setPreviewingGroupId] = useState(null);
  const [previewingTagId, setPreviewingTagId] = useState(null);

  const setPreviewingGroupAndTag = (groupId, tagId) => {
    if (previewingGroupId !== groupId) setPreviewingGroupId(groupId);
    if (previewingTagId !== tagId) setPreviewingTagId(tagId);
  };

  return (
    <MainCard
      className="BulkAnnotationsSetTagsContent"
      border={false}
      elevation={16}
      content={false}
      boxShadow
      shadow={theme.shadows[16]}
      sx={{ width: '450px', p: 4 }}
    >
      <Box
        sx={{
          position: 'relative',
          '& > .ps': { overflow: 'auto !important', ml: 1 },
          '& ::-webkit-scrollbar': { width: 0 }
        }}
      >
        <PerfectScrollbar style={{ overflowY: 'auto !important', height: 'calc(100vh - 318px)', paddingRight: '8px' }}>
          <Box mt={1} className="AppliedTagsBox">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                mb: 1,
                '& p': { flexGrow: 1 },
                '& button': { flexGrow: 1 }
              }}
              spacing={1}
            >
              <Typography sx={{ fontWeight: 'bold' }}>{`${count || 'No'} ${count > 1 ? 'Tags' : 'Tag'}`}</Typography>
              <Button variant="text" onClick={clearAllLabels}>
                Clear all
              </Button>
            </Box>
            <Box sx={{ display: 'inline-flex', alignItems: 'center', flexFlow: 'wrap' }} spacing={1}>
              {appliedLabels.map(({ tag_id: tagId }) => (
                <DeletableDocTag
                  tagId={tagId}
                  key={tagId}
                  onClick={() => {
                    const tagBtns = document.getElementsByClassName(`DocTaggingButton-${tagId}`);
                    if (tagBtns.length > 0) tagBtns[0].scrollIntoView();
                  }}
                  action={() => {
                    deleteTag(tagId);
                  }}
                />
              ))}
            </Box>
            <Divider sx={{ my: 2 }} />
          </Box>
          <DocTaggingButtonGroups
            tagGroups={tagGroups}
            previewingGroupId={previewingGroupId}
            previewingTagId={previewingTagId}
            setPreviewingGroupAndTag={setPreviewingGroupAndTag}
            changeTagAnnotation={changeTagAnnotation}
            annotation={{ labels }}
          />
        </PerfectScrollbar>
        <Stack direction="row" spacing={2} sx={{ justifyContent: 'end', mt: 2 }}>
          <Button variant="contained" onClick={handleApply}>
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
