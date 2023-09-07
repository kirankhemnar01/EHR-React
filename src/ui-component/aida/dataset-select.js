import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
  Typography,
  FormControl,
  Box,
  TextField,
  Autocomplete,
  FormHelperText,
  MenuItem,
  Select,
  InputLabel,
  useTheme,
  Button
} from '@mui/material';

import { buildRouteForDataset } from 'helpers';
import { CustomPopper } from './custom';

const CREATE_OPTION = { name: 'Create new dataset', value: '__CREATE_DATASET__' };
export const NONE_OPTION = { name: 'None', value: null };
export const DatasetSelectAutoComplete = ({
  options,
  error = false,
  helperText,
  value,
  label,
  onChange,
  grouped = false,
  sx = {},
  width = 160,
  onNew,
  ...others
}) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { projectId } = useParams();

  const realOptions = useMemo(() => {
    return [NONE_OPTION, ...options, CREATE_OPTION];
  }, [options]);

  const handleNew = () => {
    if (onNew) {
      onNew();
    } else {
      navigate(buildRouteForDataset(projectId, 'create'));
    }
  };

  const handleChange = (_, newValue) => {
    if (newValue.value === '__CREATE_DATASET__') {
      handleNew();
      return;
    }

    onChange(newValue);
  };

  const groupOptions = grouped
    ? {
        getOptionLabel: (option) => option.name,
        renderGroup: ({ key, group, children }) => (
          <Box key={key}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
              <Box sx={{ height: 1, borderBottom: `1px solid ${theme.palette.grey['500']}`, flexGrow: 1 }} />
              <Typography sx={{ color: theme.palette.grey['700'] }}>{group}</Typography>
              <Box sx={{ height: 1, borderBottom: `1px solid ${theme.palette.grey['500']}`, flexGrow: 1 }} />
            </Box>
            {children}
          </Box>
        )
      }
    : {};

  const helperSx = error ? { color: (theme) => theme.palette.error.main } : {};
  return (
    <FormControl variant="standard" sx={{ width, ...sx }}>
      <Autocomplete
        value={value}
        onChange={handleChange}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        renderInput={(params) => <TextField label={label} {...params} />}
        options={realOptions}
        renderOption={(props, option) => (
          <li {...props} key={option.value}>
            {option.value === '__CREATE_DATASET__' ? (
              <Button onClick={handleNew} variant="text">
                {option.name}
              </Button>
            ) : (
              <Typography sx={{ color: theme.palette.grey['900'] }}>{option.name}</Typography>
            )}
          </li>
        )}
        filterOptions={(options, state) => {
          if (state.inputValue) {
            const v = state.inputValue.toLowerCase();
            return options.filter((opt) => opt.name.toLowerCase().includes(v) || opt.value === CREATE_OPTION.value);
          }
          return options;
        }}
        PopperComponent={CustomPopper}
        {...groupOptions}
        {...others}
      />
      {helperText && (
        <FormHelperText size="small" sx={{ mx: '14px', ...helperSx }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export const DatasetSelect = ({ options, value, label, helperText, render, onChange, onNew, sx, ...others }) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  const handleChange = (e) => {
    onChange(e.target.value);
  };

  const handleNew = () => {
    if (onNew) {
      onNew();
    } else {
      navigate(buildRouteForDataset(projectId, 'create'));
    }
  };

  return (
    <FormControl sx={sx} {...others}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        value={value}
        onChange={handleChange}
        label={label}
        sx={{
          borderBottom: 'none',
          '&::before': { borderBottom: 'none' },
          '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
          '&::after': { borderBottom: 'none' },
          '& .MuiInput-input': { paddingRight: '32px !important', minHeight: '1rem !important' }
        }}
        renderValue={render}
      >
        {options.map((opt) => (
          <MenuItem key={opt.value} value={opt.value}>
            {opt.name}
          </MenuItem>
        ))}
        <MenuItem value="none">
          <Button onClick={handleNew} variant="text">
            Create new dataset
          </Button>
        </MenuItem>
      </Select>
      {helperText && (
        <FormHelperText size="small" sx={{ mx: '14px' }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
};
