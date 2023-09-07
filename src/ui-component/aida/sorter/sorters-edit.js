import { forwardRef } from 'react';
import { Button, Box, Paper, LinearProgress, Divider } from '@mui/material';
import { useSorterContext } from 'contexts/sorter';
import { SorterItemEdit } from './sorter-item-edit';

export const SortersEdit = forwardRef(({ onChange }, ref) => {
  const { loading, sorters, setSorters, sorterTypes } = useSorterContext();

  const handleAddNew = () => {
    setSorters(sorters => [
      ...sorters,
      { id: new Date().getTime(), key: sorterTypes[0] ?? null, value: 'asc', checked: false }
    ]);
  };

  const handleReset = () => {
    const key = sorterTypes[0] ?? null;
    if (key) {
      const sorter = {
        id: new Date().getTime(), key, value: 'asc', checked: true
      };
      setSorters([sorter]);
      onChange([sorter]);
    }
  }

  const handleChangeSorter = (idx, data) => {
    const origin = sorters[idx];
    sorters[idx] = data;
    setSorters([...sorters]);

    if (origin.checked || data.checked) {
      onChange(sorters.filter(item => item.checked && !!item.value));
    }
  }

  const handleDeleteFilter = (idx) => {
    const removed = sorters.splice(idx, 1);
    setSorters([...sorters]);
    if (removed[0].checked) {
      onChange(sorters.filter(item => item.checked && !!item.value));
    }
  };

  return (
    <Paper
      ref={ref}
      sx={{ width: 304, maxWidth: '100vw', position: 'relative' }}
      elevation={8}
      role='presentation'
      className='TaskSorterContent'
    >
      {loading && <LinearProgress sx={{ position: 'absolute', width: '100%', top: 4 }} />}
      {sorters.length > 0 && (
        <Box sx={{ p: 1 }}>
          {sorters?.map((item, idx) => (
            <SorterItemEdit
              key={item.id}
              value={item}
              onChange={data => handleChangeSorter(idx, data)}
              onCancel={() => handleDeleteFilter(idx)}
            />
          ))}
        </Box>
      )}

      <Divider />
      <Box sx={{ p: 2 }}>
        <Button
          variant='text'
          sx={{ display: 'block' }}
          onClick={handleAddNew}
        >
          Add another field
        </Button>
        <Button
          variant='text'
          sx={{ display: 'block' }}
          onClick={handleReset}
          disabled={sorterTypes.length === 0}
        >
          Reset to default
        </Button>
      </Box>
    </Paper>
  )
})