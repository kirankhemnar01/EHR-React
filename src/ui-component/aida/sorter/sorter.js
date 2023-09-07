import { useState } from 'react';
import { IconButton, Badge } from '@mui/material';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useTheme } from '@mui/material/styles';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { useSorterContext } from 'contexts/sorter';
import { SortersEdit } from './sorters-edit';

export const Sorter = ({ onSort }) => {
  const theme = useTheme();

  const [anchorSort, setAnchorSort] = useState(null);

  const { sorters } = useSorterContext();

  const toggleSort = (e) => {
    setAnchorSort(e.currentTarget);
  };

  const handleCloseSort = (e) => {
    if (anchorSort && anchorSort.contains(e.target)) return;
    setAnchorSort(null);
  };

  const sortersCount = (sorters ?? []).filter((item) => item.checked).length;

  return (
    <>
      <Badge
        badgeContent={sortersCount > 0 ? sortersCount : ''}
        color="secondary"
        sx={{
          '& .MuiBadge-badge': {
            top: '8px',
            right: '8px',
            bgcolor: sortersCount > 0 ? 'default' : 'transparent'
          }
        }}
      >
        <IconButton
          size="small"
          className={sortersCount > 0 ? 'sorter-button active' : 'sorter-button'}
          sx={{
            transition: 'all .2s ease-in-out',
            borderRadius: 2,
            background: sortersCount > 0 ? '#FADEC9' : theme.palette.grey['50'],
            color: theme.palette.grey['700'],
            border: '1px solid',
            p: '6px',
            m: '2px',
            borderColor: sortersCount > 0 ? '#FADEC9' : theme.palette.grey['200'],
            '&:hover': {
              background: theme.palette.secondary.light
            }
          }}
          onClick={toggleSort}
        >
          <SwapVertIcon stroke={1} />
        </IconButton>
      </Badge>

      <Popper keepMounted open={!!anchorSort} anchorEl={anchorSort} sx={{ zIndex: 1000 }}>
        <ClickAwayListener onClickAway={handleCloseSort}>
          <SortersEdit onChange={onSort} />
        </ClickAwayListener>
      </Popper>
    </>
  );
};
