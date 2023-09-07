import { useState } from 'react';
import { Box, TextField, IconButton, SvgIcon, Card, CardContent, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { connectorOptions, useFilterContext } from 'contexts/filter';
import { FilterItem, FilterItemEdit } from 'ui-component/aida/filter';

export const SearchTermEdit = ({ data, onCancel, onSave }) => {
  const { term, filter_clauses: filters } = data;
  const [body, setBody] = useState({ term, filters });
  const [editings, setEditings] = useState([]);
  const { filterTypes } = useFilterContext();

  const startEdit = (idx) => {
    if (!editings.includes(idx)) {
      setEditings([...editings, idx]);
    }
  }

  const deleteFilter = (idx) => {
    const pos = editings.indexOf(idx);
    if (pos >= 0) {
      editings.splice(pos, 1);
      for (let i=0;i<editings.length;i++) {
        if (editings[i] > idx) {
          editings[i] --;
        }
      }

      setEditings([...editings]);
    }

    body.filters.splice(idx, 1);
    if (idx === 0 && body.filters.length) {
      body.filters[0].connector = undefined;
    }
    setBody({ ...body });
  }

  const cancelEdit = (idx) => {
    setEditings(editings.filter(id => id !== idx));
  }

  const finishEdit = (idx, data, complete) => {
    body.filters[idx] = data;
    setBody({ ...body });
    if (complete) cancelEdit(idx);
  }

  const onNew = () => {
    body.filters.push({
      type: null,
      operator: '',
      value: '',
      connector: body.filters.length > 0 ? connectorOptions[0] : undefined
    });
    setBody({ ...body });
  }

  const handleTermChange = (e) => {
    setBody({ ...body, term: e.target.value });
  }

  return (
    <Box onClick={(e) => e.stopPropagation()}>
      <TextField
        value={body.term}
        onChange={handleTermChange}
        label='Term'
        size='small'
        fullWidth
        sx={{ my: 1 }}
      />
      <Card sx={{ bgcolor: theme => theme.palette.grey['50'] }}>
        <CardContent sx={{ p: 2, pb: '16px !important' }}>
          {body.filters?.map((item, idx) => editings.includes(idx) ? (
            <FilterItemEdit
              key={idx}
              value={item}
              connector={idx > 0}
              onChange={(data, complete) => finishEdit(idx, data, complete)}
              onCancel={() => cancelEdit(idx)}
            />
          ) : (
            <FilterItem
              key={idx}
              value={item}
              onEdit={() => startEdit(idx)}
              onDelete={() => deleteFilter(idx)}
              isFirst={!idx}
            />
          ))}
          <Button variant='text' onClick={onNew} sx={{ m: 1 }} disabled={!filterTypes?.[0]?.op_options?.[0]}>
            Add filter
            <SvgIcon fontSize='small' sx={{ ml: 1 }}><AddIcon /></SvgIcon>
          </Button>
        </CardContent>
      </Card>
      <Box sx={{ my: 1 }}>
        <IconButton onClick={(e) => onSave(e, body)}>
          <SvgIcon color='success'><CheckOutlinedIcon /></SvgIcon>
        </IconButton>
        <IconButton onClick={onCancel}>
          <SvgIcon><CloseOutlinedIcon /></SvgIcon>
        </IconButton>
      </Box>
    </Box>
  )
}