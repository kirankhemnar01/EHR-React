import { useState } from 'react';
import { Select, FormControl, MenuItem, ListSubheader, Box, Typography } from '@mui/material';
import { SYS_COLORS, INDICES, getMuiColorFromString } from 'helpers/mui-colors';

const DAFAULT_ID = 'color-picker';

export const ColorPicker = ({ color, index, onColor, ...others }) => {

  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false)

  const handleChange = (value) => {
    const pos = value.lastIndexOf('-');
    onColor(value.substring(0, pos), value.substring(pos + 1));
    handleClose();
  };

  const renderColor = (color) => {
    const result = [];
    result.push(
      <ListSubheader sx={{ textTransform: 'capitalize', color: theme => theme.palette.grey['700'], fontSize: '1.125rem' }}>
        {color.split('-').join(' ')}
      </ListSubheader>
    );

    for (const idx of INDICES) {
      result.push(
        <MenuItem value={`${color}-${idx}`} key={`${color}-${idx}`} onClick={() => handleChange(`${color}-${idx}`)}>
          <ColorRender value={`${color}-${idx}`} />
        </MenuItem>
      );
    }

    return result;
  }

  return (
    <FormControl {...others}>
      <Select
        id={DAFAULT_ID}
        value={`${color}-${index}`}
        renderValue={value => <ColorRender value={value} showIndex={false} />}
        variant='outlined'
        onOpen={handleOpen}
        onClose={handleClose}
        open={open}
        MenuProps={{
          sx: { maxHeight: 320 }
        }}
      >
        {SYS_COLORS.map(color => renderColor(color))}
      </Select>
    </FormControl>
  )
}

function ColorRender({ value, showIndex = true, size = 20 }) {
  const { name, value: color, index } = getMuiColorFromString(value);

  return (
    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', height: size }}>
      <Box sx={{ width: size, height: size, bgcolor: color }} />
      <Typography sx={{ fontSize: size * 0.8, lineHeight: 1.25 }}>
        {showIndex ? index : name}
      </Typography>
      <Typography sx={{ fontSize: size * 0.8, lineHeight: 1.25, textTransform: 'uppercase' }}>
        {color}
      </Typography>
    </Box>
  )
}
