import { Grid, Autocomplete, TextField, IconButton, Checkbox } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import CloseIcon from '@mui/icons-material/Close';
import { useSorterContext } from 'contexts/sorter';
import { CustomPopper } from '../custom';

export const SorterItemEdit = ({ value, onChange, onCancel }) => {
  const { sorterTypes } = useSorterContext();

  const handleKeyChange = async (_, key) => {
    onChange({ ...value, key });
  };

  const handleValueChange = () => {
    const oldValue = value.value;
    onChange({ ...value, value: oldValue === 'asc' ? 'desc' : 'asc' });
  };

  const handleCheckChange = (_, checked) => {
    onChange({ ...value, checked });
  };

  const iconProps = { stroke: 1.5, size: '1rem' };

  return (
    <Grid
      container
      spacing={0.5}
      rowSpacing={2}
      alignItems='center'
      className='sorter-row'
      sx={{
        my: 0.5,
        '& .MuiIconButton-root.close-btn': {
          visibility: 'hidden'
        },
        '&:hover .MuiIconButton-root.close-btn': {
          visibility: 'visible'
        }
      }}
    >
      <Grid item xs={2}>
        <Checkbox checked={value.checked} onChange={handleCheckChange} disabled={!value.key} />
      </Grid>
      <Grid item xs={7}>
        <Autocomplete
          size='small'
          disableClearable
          disablePortal
          options={sorterTypes}
          getOptionLabel={(option) => option.caption || ''}
          onChange={handleKeyChange}
          value={value.key}
          renderInput={(params) => <TextField {...params} label='Type' />}
          PopperComponent={CustomPopper}
        />
      </Grid>
      <Grid item xs={1.5}>
        <IconButton
          size='small'
          sx={{
            borderRadius: '4px',
            border: '1px solid',
            borderColor: '#ccc'
          }}
          onClick={handleValueChange}
        >
          {value.value === 'asc' && <ArrowUpwardIcon {...iconProps} />}
          {value.value === 'desc' && <ArrowDownwardIcon {...iconProps} />}
        </IconButton>
      </Grid>
      <Grid item xs={1.5}>
        <IconButton onClick={onCancel} className='close-btn' size='small'>
          <CloseIcon {...iconProps} />
        </IconButton>
      </Grid>
    </Grid >
  )
}