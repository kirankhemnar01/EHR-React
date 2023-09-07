import { forwardRef } from 'react';
import { Button, Box, Paper, LinearProgress, Divider } from '@mui/material';
import { useFilterContext, connectorOptions, operatorsWithoutValue } from 'contexts/filter';
import { FilterItemEdit } from './filter-item-edit';

export const FiltersEdit = forwardRef(({ onChange }, ref) => {
  const { loading, filters, setFilters } = useFilterContext();

  const addNewFilter = () => {
    setFilters(filters => [
      ...filters,
      {
        id: new Date().getTime(),
        type: null,
        operator: '',
        value: '',
        checked: false,
        connector: filters.length > 0 ? connectorOptions[0] : undefined
      }
    ]);
  };

  const handleDeleteFilter = (idx) => {
    const removed = filters.splice(idx, 1);
    if (idx === 0 && filters.length > 0) {
      filters[0].connector = undefined;
    }

    setFilters([...filters]);
    if (removed[0].checked) {
      onChange(filters.filter(item => item.checked && (!!item.value || operatorsWithoutValue.includes(item.operator))));
    }
  };

  const handleChangeFilter = (idx, data) => {
    const origin = filters[idx];
    filters[idx] = data;
    setFilters([...filters]);

    if (origin.checked || data.checked) {
      onChange(filters.filter(item => item.checked && (!!item.value || operatorsWithoutValue.includes(item.operator))));
    }
  }

  return (
    <Paper
      ref={ref}
      sx={{ width: 720, maxWidth: '100vw', position: 'relative' }}
      elevation={8}
      role="presentation"
      className='SearchFiltersContent'
    >
      {loading && <LinearProgress sx={{ position: 'absolute', width: '100%', top: 4 }} />}
      {filters?.length > 0 && (
        <Box sx={{ p: 1 }}>
          {filters?.map((item, idx) => (
            <FilterItemEdit
              key={item.id}
              checkbox
              connector={idx > 0}
              value={item}
              onChange={data => handleChangeFilter(idx, data)}
              onCancel={() => handleDeleteFilter(idx)}
            />
          ))}
        </Box>
      )}

      <Divider />
      <Box sx={{ py: 2, display: 'flex', justifyContent: 'space-between', px: 2 }}>
        <Button
          size="small"
          variant='contained'
          onClick={addNewFilter}
          sx={{
            lineHeight: 1.4,
            margin: 'auto',
            color: (theme) => theme.palette.primary.main,
            bgcolor: (theme) => theme.palette.primary.light,
            '&:hover': { bgcolor: (theme) => theme.palette.primary['200'] }
          }}
        >
          + Add filter
        </Button>
      </Box>
    </Paper>
  )
});
