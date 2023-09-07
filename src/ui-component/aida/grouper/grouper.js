import { useState } from 'react';
import { IconButton } from '@mui/material';
import Popper from '@mui/material/Popper';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { useTheme } from '@mui/material/styles';
import SubjectIcon from '@mui/icons-material/Subject';
import { useGrouperContext } from 'contexts/grouper';
import { GrouperEdit } from './grouper-edit';

export const Grouper = ({ onGroup }) => {
  const theme = useTheme();

  const [anchorGroup, setAnchorGroup] = useState(null);
  const { grouper } = useGrouperContext();

  const toggleGroup = (e) => {
    setAnchorGroup(e.currentTarget);
  };

  const handleCloseGroup = (e) => {
    if (anchorGroup && anchorGroup.contains(e.target)) return;
    setAnchorGroup(null);
  };

  return (
    <>
      <IconButton
        size="small"
        className={grouper?.value ? 'sorter-button active' : 'sorter-button'}
        sx={{
          transition: 'all .2s ease-in-out',
          borderRadius: 2,
          background: grouper?.value ? '#FADEC9' : theme.palette.grey['50'],
          color: theme.palette.grey['700'],
          border: '1px solid',
          p: '6px',
          m: '2px',
          borderColor: grouper?.value ? '#FADEC9' : theme.palette.grey['200'],
          '&:hover': {
            background: theme.palette.secondary.light
          }
        }}
        onClick={toggleGroup}
      >
        <SubjectIcon stroke={1} />
      </IconButton>

      <Popper keepMounted open={!!anchorGroup} anchorEl={anchorGroup} sx={{ zIndex: 1000 }}>
        <ClickAwayListener onClickAway={handleCloseGroup}>
          <GrouperEdit onChange={onGroup} />
        </ClickAwayListener>
      </Popper>
    </>
  );
};
