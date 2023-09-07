import { useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DateRangePicker } from '@mui/x-date-pickers-pro';
import { Option } from '../base';
import { subtractDate, toSimpleDateString } from 'helpers/datetime';
import { makeLocalAppearUTC } from 'helpers';

const PERIOD_OPTIONS = [
  { name: 'Last 7 days', value: 0 },
  { name: 'Last 15 days', value: 1 },
  { name: 'Last month', value: 2 },
  { name: 'Last 3 months', value: 3 },
  { name: 'Custom', value: 4 }
];

export const DateRange = ({ onChange, sx = {}, ...others }) => {
  const [option, setOption] = useState(0);
  const [value, setValue] = useState(null);

  const today = new Date();
  useEffect(() => {
    const date = new Date();
    let start = null
    if (option < 4) {
      switch (option) {
        case 0:
          start = subtractDate(date, 0, 0, 7);
          break;
        case 1:
          start = subtractDate(date, 0, 0, 15);
          break;
        case 2:
          start = subtractDate(date, 0, 1, 0);
          break;
        case 3:
          start = subtractDate(date, 0, 3, 0);
          break;
        default:
          break;
      }

      onChange(start, date);
    } else if (value?.length === 2) {
      onChange(value[0], value[1]);
    }
  }, [option, value, onChange]);

  const getOptionText = (idx) => {
    const date = new Date();
    switch (idx) {
      case 0:
        return `${PERIOD_OPTIONS[idx].name} ${toSimpleDateString(subtractDate(date, 0, 0, 7))} - ${toSimpleDateString(date)}`;
      case 1:
        return `${PERIOD_OPTIONS[idx].name} ${toSimpleDateString(subtractDate(date, 0, 0, 15))} - ${toSimpleDateString(date)}`;
      case 2:
        return `${PERIOD_OPTIONS[idx].name} ${toSimpleDateString(subtractDate(date, 0, 1, 0))} - ${toSimpleDateString(date)}`;
      case 3:
        return `${PERIOD_OPTIONS[idx].name} ${toSimpleDateString(subtractDate(date, 0, 3, 0))} - ${toSimpleDateString(date)}`;
      default:
        return value === null ? 'Custom range' : `Custom range ${toSimpleDateString(value[0])} ${toSimpleDateString(value[1])}`;
    }
  };

  const startDate = value?.[0] ?? new Date();
	const endDate = value?.[1] ?? new Date();
  return (
    <Box component='section' sx={sx}>
      {option === 4 && (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DateRangePicker
            maxDate={today}
            onChange={setValue}
            value={[makeLocalAppearUTC(startDate), makeLocalAppearUTC(endDate)]}
            inputFormat="yyyy-MM-dd"
            renderInput={(startProps, endProps) => (
              <Box
                id={others.id ? `${others.id}-picker` : 'date-range-picker'}
                sx={{ display: 'flex', alignItems: 'center' }}
              >
                <TextField {...startProps} sx={{ '& .MuiOutlinedInput-input': { padding: '8px 12px' } }} />
                <Box sx={{ mx: 2 }}> to </Box>
                <TextField {...endProps} sx={{ '& .MuiOutlinedInput-input': { padding: '8px 12px' } }} />
              </Box>
            )}
          />
        </LocalizationProvider>
      )}
      <Option
        options={PERIOD_OPTIONS}
        onChange={setOption}
        value={option}
        variant='standard'
        render={(value) => `${getOptionText(value)}`}
        {...others}
      />
    </Box>
  )
}
