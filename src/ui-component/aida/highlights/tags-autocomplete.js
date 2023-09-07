import { useState, useEffect } from 'react';

import { Link, Typography, Autocomplete, TextField } from '@mui/material';
import useAida from 'hooks/useAida';
import { NewTagDialog } from 'ui-component/aida/tag-select/new-tag-dialog';

const CREATE_NEW_TAG_ID = '__CREATE_NEW_TAG__';
const createNewTagOption = { label: 'Create New Tag', id: CREATE_NEW_TAG_ID, group: '' };

export const TagsAutocomplete = ({ tags, setTags, refresh, sx = {} }) => {
  const { tagGroups: tagGroupsData } = useAida();
  const { data: tagGroups } = tagGroupsData;

  const onTagsChanged = (event, value) => {
    setTags(value.filter((t) => t.id !== CREATE_NEW_TAG_ID));
    if (refresh) refresh();
  };

  const [tagOptions, setTagOptions] = useState([createNewTagOption]);
  useEffect(() => {
    const options = [];
    if (tagGroups && tagGroups.length)
      tagGroups.forEach((tagGroup) => {
        tagGroup.tags.forEach((tag) => {
          options.push({ label: tag.name, group: tagGroup.name, id: tag.tag_id });
        });
      });
    options.push(createNewTagOption);
    setTagOptions(options);
  }, [tagGroups]);

  const filterTagOptions = (options, state) => {
    if (state.inputValue) {
      const v = state.inputValue.toLowerCase();
      return options.filter((o) => o.label.toLowerCase().includes(v) || o.id === CREATE_NEW_TAG_ID);
    }
    return options;
  };

  const [newTagDialogOpen, setNewTagDialogOpen] = useState(false);
  const onCloseNewTagDialog = () => setNewTagDialogOpen(false);

  return (
    <>
      <Autocomplete
        sx={{ ...sx }}
        multiple
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={tagOptions}
        filterOptions={filterTagOptions}
        groupBy={(option) => option.group}
        renderOption={(props, option) => {
          if (option.id === CREATE_NEW_TAG_ID)
            return (
              <li {...props} style={{ borderTop: '1px solid #d9d9d9' }}>
                <Link
                  onClick={() => {
                    setNewTagDialogOpen(true);
                  }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    textDecoration: 'none'
                  }}
                >
                  <Typography>{option.label}</Typography>
                </Link>
              </li>
            );
          return (
            <li {...props} key={option.id}>
              {option.label}
            </li>
          );
        }}
        onChange={onTagsChanged}
        value={tags || []}
        renderInput={(params) => <TextField {...params} label="Add tags" />}
      />

      {newTagDialogOpen && <NewTagDialog open={newTagDialogOpen} onClose={onCloseNewTagDialog} />}
    </>
  );
};
