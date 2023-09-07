import { useMemo } from 'react';
import {
  FormHelperText,
  FormControl,
  MenuItem,
  Checkbox,
  Select,
  InputLabel,
  Typography,
  Autocomplete,
  TextField,
  ListItemText,
  Box,
  useTheme
} from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { CustomPopper } from '../custom';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export const Option = ({
  options,
  value,
  label,
  render,
  onChange,
  empty = false,
  disabled = false,
  helperText,
  sx,
  ...others
}) => {
  const handleChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <FormControl sx={sx} {...others}>
      {label && <InputLabel>{label}</InputLabel>}
      <Select
        {...{ disabled, value, label }}
        onChange={handleChange}
        sx={{
          borderBottom: 'none',
          '&::before': { borderBottom: 'none' },
          '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
          '&::after': { borderBottom: 'none' },
          '& .MuiInput-input': { paddingRight: '32px !important', minHeight: '1rem !important' }
        }}
        renderValue={render}
        onClick={e => e.stopPropagation()}
      >
        {empty && (
          <MenuItem key='none' value=''>
            None
          </MenuItem>
        )}
        {options.map((opt) => (
          <MenuItem key={opt.name} value={opt.value}>
            {opt.name}
          </MenuItem>
        ))}
      </Select>
      {helperText && <FormHelperText size='small' sx={{ mx: 0 }}>{helperText}</FormHelperText>}
    </FormControl>
  )
}

export const MultiOption = ({ options, value, label, onChange, sx = {}, fontSize = 12, width = 160, ...others }) => {
  const handleChange = (e) => {
    const value = e.target.value;
    onChange(typeof value === 'string' ? value.split(',') : value);
  }

  return (
    <FormControl variant='standard' sx={{ ...sx, width }} {...others}>
      {/* {label && <InputLabel>{label}</InputLabel>} */}
      <Select
        value={value}
        onChange={handleChange}
        multiple
        displayEmpty
        sx={{
          borderBottom: 'none',
          '&::before': { borderBottom: 'none' },
          '&:hover:not(.Mui-disabled):before': { borderBottom: 'none' },
          '&::after': { borderBottom: 'none' },
          '& .MuiInput-input': { paddingRight: '32px !important', minHeight: '1rem !important' }
        }}
        renderValue={(values) => (
          <Typography
            noWrap
            sx={{ maxWidth: width - 20, fontSize, fontWeight: 400, whiteSpace: 'wrap', color: values.length ? '#333' : '#888' }}
          >
            {values.length ? values.map(
              value => options.find(opt => opt.value === value)?.name
            ).join(', ') : label}
          </Typography>
        )}
      >
        {(options ?? []).map((opt) => (
          <MenuItem key={opt.name} value={opt.value}>
            <Checkbox checked={value.indexOf(opt.value) > -1} />
            <ListItemText primary={opt.name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export const MultiOptionAutocomplete = ({
  options,
  value,
  label,
  onChange,
  sx = {},
  width = 160,
  creatable = false,
  loading = false,
  ...others
}) => {
  const handleChange = (e, newValue) => onChange(newValue);

  const realOptions = useMemo(() => {
    return options?.reduce((acc, cur) => ({ ...acc, [cur.value]: cur.name }), {}) ?? [];
  }, [options]);

  const realValues = useMemo(() => options?.map(item => item.value) ?? [], [options]);

  let extraProps = { value, multiple: true };
  if (creatable) {
    extraProps = {
      ...extraProps,
      freeSolo: true,
      clearOnBlur: true,
      selectOnFocus: true,
      handleHomeEndKeys: true
    }
  }

  return (
    <FormControl variant='standard' sx={{ ...sx, width }}>
      <Autocomplete
        loading={loading}
        onChange={handleChange}
        PopperComponent={CustomPopper}
        getOptionLabel={option => realOptions[option] ?? option}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {realOptions[option]}
          </li>
        )}
        renderInput={(params) => <TextField label={label} {...params} />}
        options={realValues}
        {...extraProps}
        {...others}
      />
    </FormControl>
  )
};

export const SingleOptionAutocomplete = ({
  options,
  value,
  label,
  onChange,
  error = false,
  helperText,
  custom = true,
  componentsProps = {},
  sx = {},
  width = 160,
  ...others
}) => {
  const handleChange = (_, newValue) => {
    if (newValue?.inputValue) {
      onChange(newValue.inputValue);
    } else {
      onChange(newValue);
    }
  }

  return (
    <FormControl variant='standard' sx={{ ...sx, width }}>
      <Autocomplete
        componentsProps={componentsProps}
        value={value}
        onChange={handleChange}
        PopperComponent={custom ? CustomPopper : undefined}
        isOptionEqualToValue={(a, b) => a.value === b.value}
        getOptionLabel={option => typeof option === 'string' ? option : option.name}
        renderOption={(props, option) => (
          <li {...props}>
            {option.name}
          </li>
        )}
        renderInput={(params) => <TextField label={label} {...params} />}
        options={options}
        {...others}
      />
      {helperText && (
        <FormHelperText size='small' sx={{ mx: 0 }} error={error}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
};

export const GroupedOptionAutocomplete = ({
  multiple = true,
  helperText,
  options,
  value,
  label,
  onChange,
  disabled,
  error = false,
  renderOption = null,
  getOptionLabel = null,
  sx = {},
  width = 160,
  loading = false,
  ...others
}) => {
  const theme = useTheme();
  const handleChange = (e, newValue) => onChange(newValue);

  return (
    <FormControl variant='standard' sx={{ ...sx, width }}>
      <Autocomplete
        disabled={disabled}
        loading={loading}
        value={value}
        onChange={handleChange}
        PopperComponent={CustomPopper}
        multiple={multiple}
        options={options}
        getOptionLabel={getOptionLabel ?? (option => option.name)}
        isOptionEqualToValue={(a, b) => a.value === b.value}
        groupBy={option => option.group}
        renderOption={renderOption ?? ((props, option, { selected }) => (
          <li {...props} key={option.value}>
            {multiple && (
              <Checkbox
                icon={icon}
                checkedIcon={checkedIcon}
                style={{ marginRight: 8 }}
                checked={selected}
              />
            )}
            {option.name}
          </li>
        ))}
        renderInput={(params) => <TextField label={label} {...params} />}
        renderGroup={({ group, children }) => (
          <Box sx={{ pt: 2 }} key={group}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ height: 1, borderBottom: `1px solid ${theme.palette.grey['500']}`, flexGrow: 1 }} />
              {!!group && (
                <>
                  <Typography sx={{ color: theme.palette.grey['700'] }}>{group}</Typography>
                  <Box sx={{ height: 1, borderBottom: `1px solid ${theme.palette.grey['500']}`, flexGrow: 1 }} />
                </>
              )}
            </Box>
            {children}
          </Box>
        )}
        {...others}
      />
      {helperText && (
        <FormHelperText size='small' error={error} sx={{ mx: 0 }}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  )
}
