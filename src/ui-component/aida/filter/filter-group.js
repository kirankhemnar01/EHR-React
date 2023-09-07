import { useState } from 'react';
import { Card, CardActions, Button, CardHeader, Typography, CardContent, Box } from '@mui/material';
import { connectorOptions } from 'contexts/filter';
import { FilterItem } from './filter-item';
import { FilterItemEdit } from './filter-item-edit';

export const FilterGroup = ({ name, group, onChange, onAddNew, onDelete, onDeleteGroup }) => {
  const [editings, setEditings] = useState([]);

  const addNewFilter = () => {
    onAddNew({
      type: null,
      operator: '',
      value: '',
      connector: connectorOptions[0]
    });
  };

  const onCancelEdit = idx => {
    setEditings(editings.filter(id => id !== idx));
  };

  const onEditFilter = (idx) => {
    if (!editings.includes(idx)) {
      setEditings([...editings, idx]);
    }
  };

  const onDeleteFilter = (idx) => {
    onDelete(idx);
    setEditings(editings.map(i => i > idx ? i - 1 : i));
  };

  const onConfirmChange = (idx, data, complete) => {
    onChange(idx, data);
    if (complete) onCancelEdit(idx);
  }

  return (
    <Card sx={{
      width: '100%',
      maxWidth: 576,
      margin: 'auto',
      bgcolor: '#FCFCFC',
      border: '1px solid #F0F0F0'
    }}>
      <CardHeader
        sx={{ pb: 1 }}
        title={<Typography variant='h5' sx={{ color: theme => theme.palette.grey['700'] }}>{name}</Typography>}
      />
      <CardContent sx={{ p: 1 }}>
        {group.filters?.map((item, idx) => editings.includes(idx) ? (
          <FilterItemEdit
            key={idx}
            value={item}
            connector={idx > 0}
            onChange={(data, complete) => onConfirmChange(idx, data, complete)}
            onCancel={() => onCancelEdit(idx)}
          />
        ) : (
          <FilterItem
            key={idx}
            value={item}
            onEdit={() => onEditFilter(idx)}
            onDelete={() => onDeleteFilter(idx)}
            isFirst={!idx}
          />
        ))}
      </CardContent>
      <CardActions sx={{ p: 1, justifyContent: 'space-between', px: 2 }}>
        <Box sx={{
          display: 'inline-flex', gap: 2, alignItems: 'center', px: 2, py: 1, bgcolor: 'white', borderRadius: 1, border: '1px solid #F0F0F0'
        }}>
          <Button
            size="small"
            variant='contained'
            onClick={addNewFilter}
            sx={{
              lineHeight: 1.4,
              color: (theme) => theme.palette.primary.main,
              bgcolor: (theme) => theme.palette.primary.light,
              '&:hover': { bgcolor: (theme) => theme.palette.primary['200'] }
            }}
          >
            + Add filter
          </Button>
        </Box>
        <Button
          size="small"
          variant='contained'
          onClick={onDeleteGroup}
          sx={{
            lineHeight: 1.4,
            color: (theme) => theme.palette.error.main,
            bgcolor: 'white',
            '&:hover': { bgcolor: (theme) => theme.palette.error.light }
          }}
        >
          - Remove group
        </Button>
      </CardActions>
    </Card>
  )
}
