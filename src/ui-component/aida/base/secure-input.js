import { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export const SecureInput = ({ label, ...others }) => {
  const [show, setShow] = useState(false);
  return (
    <FormControl sx={{ m: 1, width: '25ch' }} variant='outlined'>
      <InputLabel htmlFor='secure-text-input'>{label}</InputLabel>
      <OutlinedInput
        id='secure-text-input'
        type={show ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              aria-label='toggle password visibility'
              onClick={show => setShow(!show)}
              edge='end'
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label='Password'
        {...others}
      />
    </FormControl>
  )
}
