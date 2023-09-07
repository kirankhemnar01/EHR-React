import { Card } from '@mui/material';
import Transitions from 'ui-component/extended/Transitions';

export const FlatCard = ({ sx = {}, ...others }) => {
  return (
    <Transitions type='fade' in>
      <Card
        sx={{
          boxShadow: 'none',
          border: '1px solid #eee',
          transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
          ...sx,
          '&:hover': {
            boxShadow: 'rgba(32, 40, 45, 0.08) 0px 2px 14px',
            ...(sx['&:hover'] ?? {})
          },
        }}
        {...others}
      />
    </Transitions>
  )
}