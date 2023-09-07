import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const ExpandMore = styled((props) => {
  // eslint-disable-next-line no-unused-vars
  const { expand, ...other } = props;
  return (
    <IconButton aria-expanded={expand} aria-label="show more" {...other}>
      <ExpandMoreIcon />
    </IconButton>
  );
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest
  })
}));
