import React from 'react';
import { Box, Typography, Button, CircularProgress, LinearProgress } from '@mui/material';
import Loader from 'ui-component/Loader';
import { useFilterContext } from 'contexts/filter';
import { FilterGroup } from './filter-group';
import { Divider } from '../base/divider';


export const FilterForm = ({ groups, onChange, onAddGroup, onAddFilter, onDeleteFilter, onDeleteGroup }) => {
  const { filterTypes, error, loading } = useFilterContext();

  if (error) {
    return <Typography variant='body1' color='error'>{error}</Typography>;
  }

  if (!filterTypes && loading) {
    return <Loader />;
  }

  if (!filterTypes.length) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <CircularProgress size={24} />
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%', maxWidth: 640, margin: 'auto', pt: 1, position: 'relative' }}>
      {loading && <LinearProgress sx={{ position: 'absolute', top: 2, width: '100%' }} />}
      {groups.map((group, idx) => (
        <React.Fragment key={idx}>
          <FilterGroup
            name={`Group ${idx + 1}`}
            group={group}
            onChange={(filterIdx, filter) => onChange(idx, filterIdx, filter)}
            onAddNew={(filter) => onAddFilter(idx, filter)}
            onDelete={filterIdx => onDeleteFilter(idx, filterIdx)}
            onDeleteGroup={() => onDeleteGroup(idx)}
          />
          {(idx !== groups.length - 1) && <Divider />}
        </React.Fragment>
      ))}

      {filterTypes.length > 0 && (
        <Box>
          <Divider />
          <Button
            size="small"
            variant='contained'
            onClick={onAddGroup}
            sx={{
              display: 'block',
              margin: 'auto',
              color: (theme) => theme.palette.primary.main,
              bgcolor: (theme) => theme.palette.primary.light,
              '&:hover': { bgcolor: (theme) => theme.palette.primary['200'] }
            }}
          >
            + Add filter group
          </Button>
        </Box>
      )}

    </Box>
  )
}
