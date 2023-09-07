import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Card,
  Box,
  IconButton,
  SvgIcon,
  Button,
  Checkbox,
  CircularProgress
} from '@mui/material';
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { TypographyWithPopover } from 'ui-component/aida/base';
import { SearchTermEdit } from './search-term-edit';
import { FilterItem } from 'ui-component/aida/filter/filter-item';

export const SearchTermTable = ({ terms, selected, onSelect, editable, onSave, onDelete, onNew, loading, onSelectAll }) => {
  const [editings, setEditings] = useState([]);

  const startEdit = (e, idx) => {
    e.stopPropagation();
    if (!editings.includes(idx)) {
      setEditings([...editings, idx]);
    }
  }

  const cancelEdit = (e, idx) => {
    e.stopPropagation();
    const index = editings.indexOf(idx);
    if (index >= 0) {
      editings.splice(index, 1);
      setEditings([...editings]);
    }
  }

  const finishEdit = (e, idx, data) => {
    e.stopPropagation();
    const index = editings.indexOf(idx);
    if (index >= 0) {
      editings.splice(index, 1);
      setEditings([...editings]);
      onSave(idx, data);
    }
  }

  const deleteTerm = (e, idx) => {
    e.stopPropagation();
    onDelete(idx);

    for (let i = 0; i < editings.length; i++) {
      if (editings[i] > idx) {
        editings[i]--;
      }
    }
    setEditings([...editings]);
  }

  const newTerm = () => {
    const idx = onNew();
    setEditings([...editings, idx]);
  }

  const count = terms.length;
  return (
    <TableContainer component={Card} sx={{ border: `1px solid #eeeeee`, position: 'relative' }}>
      {loading && (
        <>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              backgroundColor: '#0001',
              zIndex: 1001,
              pointerEvents: 'none',
              position: 'absolute'
            }}
          />
          <CircularProgress
            size={24}
            sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
          />
        </>
      )}
      <Table>
        <TableHead>
          <TableRow>
            {!!selected && (
              <TableCell padding='checkbox' sx={{ pl: 1 }}>
                <Checkbox
                  color='primary'
                  checked={count > 0 && selected.length === count}
                  indeterminate={selected.length > 0 && selected.length < count}
                  onChange={(_, checked) => onSelectAll(checked)}
                />
              </TableCell>
            )}
            <TableCell sx={{ width: 180 }}>Search term</TableCell>
            <TableCell sx={{ width: editable ? 240 : 320 }}>Filters</TableCell>
            {editable && <TableCell> </TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {terms.map((item, idx) => (
            <TableRow
              hover
              role='checkbox'
              tabIndex={-1}
              key={`${item.term}-${idx}`}
              onClick={() => onSelect(idx)}
            >
              {editings.includes(idx) ? (
                <TableCell colSpan={4}>
                  <SearchTermEdit
                    data={item}
                    onCancel={(e) => cancelEdit(e, idx)}
                    onSave={(e, data) => finishEdit(e, idx, data)}
                  />
                </TableCell>
              ) : (
                <>
                  {!!selected && (
                    <TableCell sx={{ pl: 1 }} padding='checkbox'>
                      <Checkbox color='primary' checked={selected.includes(idx)} />
                    </TableCell>
                  )}
                  <TableCell>
                    <TypographyWithPopover
                      noWrap
                      popWidth={400}
                      wrapperSx={{ py: 0 }}
                      sx={{
                        color: theme => theme.palette.grey['800'],
                        textTransform: 'capitalize',
                        maxWidth: 148
                      }}
                    >
                      {item.term}
                    </TypographyWithPopover>
                  </TableCell>
                  <TableCell>
                    {item.filter_clauses.map((filter, idx) => (
                      <FilterItem key={idx} value={filter} wrapperSx={{ maxWidth: 256 }} />
                    ))}
                  </TableCell>
                  {editable && (
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={(e) => startEdit(e, idx)}>
                          <SvgIcon><ModeEditOutlineOutlinedIcon /></SvgIcon>
                        </IconButton>
                        <IconButton onClick={(e) => deleteTerm(e, idx)}>
                          <SvgIcon color='error'><RemoveCircleOutlineOutlinedIcon /></SvgIcon>
                        </IconButton>
                      </Box>
                    </TableCell>
                  )}
                </>
              )}
            </TableRow>
          ))}
          {editable && (
            <TableRow>
              <TableCell colSpan={4}>
                <Button variant='text' onClick={newTerm}>Create a new term</Button>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
