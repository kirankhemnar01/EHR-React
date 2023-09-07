import { forwardRef } from 'react';
import { Paper, LinearProgress } from '@mui/material';
import { useGrouperContext } from 'contexts/grouper';
import { SingleOptionAutocomplete } from '../base';

export const GrouperEdit = forwardRef(({ onChange }, ref) => {
  const { loading, groupingOptions, grouper, setGrouper } = useGrouperContext();

  const handleChange = (value) => {
    setGrouper(value);
    onChange?.(value);
  }

  return (
    <Paper
      ref={ref}
      sx={{ width: 240, maxWidth: '100vw', position: 'relative', p: 2 }}
      elevation={8}
      role='presentation'
      className='TaskSorterContent'
    >
      {loading && <LinearProgress sx={{ position: 'absolute', width: '100%', top: 4 }} />}
      <SingleOptionAutocomplete
        options={groupingOptions}
        width='100%'
        value={grouper}
        onChange={handleChange}
        disablePortal
        disableClearable
      />
    </Paper>
  )
});
