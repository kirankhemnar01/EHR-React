import { useMemo, useState } from 'react';
import { Checkbox, Button } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

import { GroupedOptionAutocomplete } from '../base';
import { NewTagDialog } from './new-tag-dialog';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const CREATE_OPTION = { name: 'Create new tag', value: '__CREATE_TAG__', group: '' };
export const TagAutoComplete = ({
  options,
  onChange,
  multiple,
  onNew = null,
  ...others
}) => {
  const [showDialog, setShowDialog] = useState(false);

  const realOptions = useMemo(() => {
    return [...options, CREATE_OPTION];
  }, [options]);

  const handleNew = () => {
    if (onNew) {
      onNew();
    } else {
      setShowDialog(true);
    }
  }

  const handleChange = (newValue) => {
    if (Array.isArray(newValue)) {
      const values = [];
      for (const item of newValue) {
        if (item.value === '__CREATE_TAG__') {
          handleNew();
          return;
        }
  
        values.push(item);
      }
      
      onChange(values);
    } else {
      if (newValue?.value === '__CREATE_TAG__') {
        handleNew();
        return;
      }

      onChange(newValue);
    }
  };

  return (
    <>
      <GroupedOptionAutocomplete
        options={realOptions}
        onChange={handleChange}
        multiple={multiple}
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option.value}>
            {option.value === '__CREATE_TAG__' ? (
              <Button variant='text'>
                {option.name}
              </Button>
            ) : (
              <>
                {multiple && (
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                )}
                {option.name}
              </>
            )}
          </li>
        )}
        {...others}
      />

      <NewTagDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
      />
    </>
  )
}
