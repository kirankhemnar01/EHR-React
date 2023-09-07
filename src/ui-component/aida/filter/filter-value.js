import { useEffect, useState } from 'react';
import { Autocomplete, TextField, Box } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { makeLocalAppearUTC } from 'helpers/utils';
import { useFilterContext } from 'contexts/filter';
import { CustomPopper } from '../custom';

export const FilterValue = ({
  type,
  value,
  onChange
}) => {
  const { values, getFieldValues } = useFilterContext();
  const [text, setText] = useState('');

  useEffect(() => {
    let timer = null;
    if (type?.op_type === 'term_filter_op') {
      timer = setTimeout(() => {
        getFieldValues(type.field, text);
      }, 300);
    }

    return () => timer && clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  if (!type) return null;

  let valueElement = null;
  switch (type.op_type) {
    case 'date_filter_op':
      valueElement = (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            inputFormat='yyyy-MM-dd'
            toolbarFormat='yyyy-MM-dd'
            mask='____-__-__'
            renderInput={(params) => <TextField fullWidth {...params} helperText='' />}
            label='Date'
            onChange={onChange}
            value={makeLocalAppearUTC(value)}
            PopperProps={{
              disablePortal: true,
            }}
          />
        </LocalizationProvider>
      );
      break;
    case 'number_filter_op':
      valueElement = (
        <TextField
          fullWidth
          type='number'
          label='Value'
          onChange={(e) => onChange(e.target.value)}
          value={value}
        />
      );
      break;
    case 'text_filter_op':
      valueElement = (
        <TextField
          fullWidth
          label='Value'
          onChange={(e) => onChange(e.target.value)}
          value={value} />
      );
      break;
    case 'term_filter_op':
      valueElement = (
        <Autocomplete
          disablePortal
          disableClearable
          // disabled={loading}
          multiple={Array.isArray(value)}
          options={values[type.field] ?? []}
          getOptionLabel={(option) => option.caption ?? ''}
          isOptionEqualToValue={(option, value) => option?.name === value?.name}
          onChange={(_, value) => onChange(value)}
          value={value}
          renderOption={(props, option) => (
            <Box component='li' sx={{ minWidth: '100%', width: 'fit-content', whiteSpace: 'nowrap' }} {...props}>
              {option.count > 0 ? `${option.caption}(${option.count})` : option.caption}
            </Box>
          )}
          renderInput={(params) => <TextField {...params} />}
          PopperComponent={CustomPopper}
          onInputChange={(_, newValue, reason) => {
            if (reason === 'input') setText(newValue);
          }}
        />
      );
      break;
    default:
      break;
  }

  return valueElement;
}