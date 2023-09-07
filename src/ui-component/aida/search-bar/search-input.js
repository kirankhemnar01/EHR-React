import { useState, useEffect } from 'react';
import { OutlinedInput, InputAdornment, IconButton } from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons';

export const SearchInput = ({
  onSearch,
  onClear,
  initialValue = '',
  keyInputTriggerSearch = false,
  placeholder = 'Search',
  sx = {}
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue])

  const handleSearch = () => {
    onSearch(value);
  };

  const handleKeyInput = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setValue('');
    if (onClear) onClear();
    else onSearch('');
  };

  const handleChange = e => {
    setValue(e.target.value);
    if (keyInputTriggerSearch) {
      onSearch(e.target.value);
    }
  }

  return (
    <OutlinedInput
      id="search-input"
      placeholder={placeholder}
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyInput}
      startAdornment={
        <InputAdornment position="start" onClick={handleSearch}>
          <IconButton variant="text" aria-label="search-icon">
            <IconSearch stroke={2} size="1rem" />
          </IconButton>
        </InputAdornment>
      }
      endAdornment={
        <InputAdornment position="end" onClick={clearSearch} sx={{ visibility: value ? 'visible' : 'hidden' }}>
          <IconButton variant="text">
            <IconX stroke={2} size="1rem" />
          </IconButton>
        </InputAdornment>
      }
      size="small"
      sx={{ flexGrow: 1, ...sx }}
    />
  );
};
