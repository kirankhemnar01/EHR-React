import { useMemo, useState } from 'react';
import { Button, Checkbox, Drawer, Box, Autocomplete, TextField } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { CustomPopper } from '../custom';
import { CustodianCreateForm } from './create-form';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const CREATE_OPTION = { name: 'Create new custodian', value: '__CREATE_CUSTODIAN__' };

export const CustodianSelect = ({
  custodians,
  onCreate,
  value,
  onChange,
  multiple = true,
  label = 'Select custodians',
  sx = {},
  ...others
}) => {
  const [showDrawer, setShowDrawer] = useState(false);

  const options = useMemo(() => [
    ...custodians.map(item => ({ name: item.name, value: item.custodian_id })),
    CREATE_OPTION
  ], [custodians]);

  const handleNew = () => {
    setShowDrawer(true);
  }

  const handleChange = (_, newValue) => {
    const values = [];
    for (const item of newValue) {
      if (item.value === '__CREATE_CUSTODIAN__') {
        handleNew();
        return;
      }

      values.push(item);
    }

    onChange(values);
  };

  const closeDrawer = () => setShowDrawer(false);

  return (
    <>
      <Autocomplete
        onChange={handleChange}
        PopperComponent={CustomPopper}
        getOptionLabel={option => option.name}
        renderOption={(props, option, { selected }) => (
          <li {...props} key={option.value}>
            {option.value === '__CREATE_CUSTODIAN__' ? (
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
        renderInput={(params) => <TextField label={label} {...params} />}
        filterOptions={(options, state) => {
          if (state.inputValue) {
            const v = state.inputValue.toLowerCase();
            return options.filter(
              (opt) => opt.name.toLowerCase().includes(v) || opt.value === CREATE_OPTION.value
            );
          }
          return options;
        }}
        sx={{ my: 1, ...sx }}
        {...{ value, options, multiple }}
        {...others}
      />

      <Drawer anchor='right' open={showDrawer} onClose={closeDrawer}>
        <Box sx={{ maxWidth: '100%', height: '100vh', display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
          <CustodianCreateForm onClose={closeDrawer} onCreate={onCreate} />
        </Box>
      </Drawer>
    </>
  )
}