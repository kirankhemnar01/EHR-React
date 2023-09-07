import { Box, Typography, Button } from '@mui/material';

export const SelectionBar = ({
  selectedCount,
  allSelected,
  totalCount,
  pageSize,
  onSelectAll,
  onClear
}) => {
  let description = ''
  if (selectedCount === 1) description = '1 document is selected.';
  else if (allSelected) description = `All ${totalCount} documents are selected.`;
  else if (selectedCount === pageSize) description = `All ${pageSize} documents on this page are selected.`;
  else description = `${selectedCount} documents selected.`;

  return (
    <Box
      className='selection-bar'
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        bgcolor: 'rgba(0,0,0,0.04)',
        gap: 2,
        borderRadius: 2,
        mb: 2, px: 2, py: 1
      }}
    >
      <Typography variant='subtitle1' component='span'>
        {description}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      {!allSelected && (
        <Button variant='text' onClick={onSelectAll}>
          Select all documents
        </Button>
      )}

      {selectedCount > 0 && (
        <Button variant='text' sx={{ ml: 1 }} onClick={onClear}>
          Clear selection
        </Button>
      )}
    </Box>
  )
}
