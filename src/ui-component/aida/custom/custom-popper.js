import { Popper } from '@mui/material';

export const CustomPopper = (props) => (
  <Popper
    {...props}
    placement="bottom"
    popperOptions={{
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 4]
          }
        },
        {
          name: 'flip',
          enabled: false
        },
        {
          name: 'preventOverflow',
          enabled: false
        }
      ]
    }}
  />
);
