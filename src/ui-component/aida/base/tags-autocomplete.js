import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// material-ui
import { Autocomplete, TextField } from '@mui/material';

// project imports
import { CustomPopper } from 'ui-component/aida/custom';
import { useTagGroups } from 'service/tags';

const TagsAutocomplete = ({ name, value, onChange, onOpen, sx = {}, label = 'Label', multiple = true }) => {
  const { projectId } = useParams();
  const tagGroupsData = useTagGroups(projectId);
  const { data: tagGroups } = tagGroupsData;
  const [tagOptions, setTagOptions] = useState([]);
  useEffect(() => {
    const options = [];
    if (tagGroups && tagGroups.length)
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
    setTagOptions(options);
  }, [tagGroups]);

  let tagValue = null;
  if (multiple) tagValue = value ? tagOptions.filter((o) => value.includes(o.id)) : [];
  else tagValue = value ? tagOptions.find((o) => value === o.id) ?? null : null;

  return (
    <Autocomplete
      fullWidth
      multiple={multiple}
      name={name}
      selectOnFocus
      clearOnBlur
      handleHomeEndKeys
      options={tagOptions}
      groupBy={(option) => option.group}
      onChange={(e, value) => {
        let val;
        if (multiple) val = value.map((v) => v.id);
        else val = value?.id;
        onChange(e, val);
      }}
      onOpen={onOpen}
      value={tagValue}
      renderInput={(params) => <TextField {...params} label={label} />}
      PopperComponent={CustomPopper}
      sx={{ ...sx }}
    />
  );
};

export const MultipleTagsAutocomplete = (props) => <TagsAutocomplete {...props} multiple />;

export const SingleChoiceTagsAutocomplete = (props) => <TagsAutocomplete {...props} multiple={false} />;
