import { Box } from '@mui/material';
import { Sorter } from '../sorter/sorter';
import { Filter } from '../filter';
import { Grouper } from '../grouper';

export const SearchBar = ({ onFilter, onSort, onGroup, children, sx = {} }) => {
  return (
    <Box sx={{ display: 'inline-flex', gap: 4, alignItems: 'flex-start', ...sx }}>
      {children}

      {!!onFilter && <Filter onFilter={onFilter} />}
      {!!onSort && <Sorter onSort={onSort} />}
      {!!onGroup && <Grouper onGroup={onGroup} />}
    </Box>
  )
}
