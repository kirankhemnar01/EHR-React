import { useState } from 'react';
import { IconButton, Badge } from '@mui/material';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useTheme } from '@mui/material/styles';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useFilterContext } from 'contexts/filter';
import { FiltersEdit } from './filters-edit';

export const Filter = ({ onFilter }) => {
  const theme = useTheme();
  const { filters } = useFilterContext();

  const [anchorFilter, setAnchorFilter] = useState(null);

  const toggleFilter = (e) => {
    setAnchorFilter(e.currentTarget);
  };

  const handleCloseFilter = (e) => {
    if (anchorFilter && anchorFilter.contains(e.target)) return;
    setAnchorFilter(null);
  };

  const filtersCount = (filters ?? []).filter((item) => item.checked).length;

  return (
    <>
      <Badge
        badgeContent={filtersCount > 0 ? filtersCount : ''}
        color="secondary"
        sx={{
          '& .MuiBadge-badge': {
            top: '8px',
            right: '8px',
            bgcolor: filtersCount > 0 ? 'default' : 'transparent'
          }
        }}
      >
        <IconButton
          size="small"
          className={filtersCount > 0 ? 'filter-button active' : 'filter-button'}
          sx={{
            transition: 'all .2s ease-in-out',
            borderRadius: 2,
            background: filtersCount > 0 ? '#DBEDDB' : theme.palette.grey['50'],
            color: theme.palette.grey['700'],
            border: '1px solid',
            p: '6px',
            m: '2px',
            borderColor: filtersCount > 0 ? '#DBEDDB' : theme.palette.grey['200'],
            '&:hover': {
              background: theme.palette.secondary.light
            }
          }}
          onClick={toggleFilter}
        >
          <FilterAltIcon stroke={1} />
        </IconButton>
      </Badge>

      <Popper keepMounted open={!!anchorFilter} anchorEl={anchorFilter} sx={{ zIndex: 1000 }}>
        <ClickAwayListener onClickAway={handleCloseFilter}>
          <FiltersEdit onChange={onFilter} />
        </ClickAwayListener>
      </Popper>
    </>
  );
};
