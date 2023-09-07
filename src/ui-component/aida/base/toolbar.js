import {
  Box,
  Button,
  IconButton,
} from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { IconPlus } from '@tabler/icons';

export const EditToolbar = ({ onAdd, onEdit, onDelete, onApply }) => (
  <Box className='toolbar'>
    {onApply && (
      <Button onClick={onApply}>Apply</Button>
    )}
    {onAdd && (
      <IconButton variant='text' onClick={onAdd}>
        <IconPlus />
      </IconButton>
    )}
    {onEdit && (
      <IconButton variant='text' onClick={onEdit}>
        <EditIcon />
      </IconButton>
    )}
    {onDelete && (
      <IconButton variant='text' onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    )}
  </Box>
)
