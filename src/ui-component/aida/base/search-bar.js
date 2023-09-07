import { useState, useEffect } from 'react';
import { OutlinedInput, InputAdornment, IconButton, Box } from '@mui/material';
import { IconSearch, IconX } from '@tabler/icons';
import { Sorter } from '../sorter/sorter';
import { Filter } from '../filter';

export const SearchBar = ({
  onSearch,
  onFilter,
  onSort,
  onClear,
  initValue = '',
  keyInputTriggerSearch = false,
  delayInput = true,
  sx = {},
  placeholder = 'Search',
  ...extra
}) => {
  const [value, setValue] = useState(initValue);

  const handleSearch = () => {
    onSearch?.(value);
  };

  const handleKeyInput = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      onSearch?.(value);
    }
  };

  const clearSearch = () => {
    setValue('');
    if (onClear) onClear();
    else onSearch?.('');
  };

  useEffect(() => {
    let delayDebounceFn = null;
    if (keyInputTriggerSearch) {

      delayDebounceFn = setTimeout(() => {
        handleSearch(value);
      }, delayInput ? 500 : 0);
    }
    return () => (delayDebounceFn ? clearTimeout(delayDebounceFn) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <Box sx={{ display: 'inline-flex', gap: 4, alignItems: 'center', ...sx }} {...extra}>
      <OutlinedInput
        id="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
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
        sx={{
          flexGrow: 1
        }}
      />

      {!!onFilter && <Filter onFilter={onFilter} />}
      {!!onSort && <Sorter onSort={onSort} />}
    </Box>
  );
};
