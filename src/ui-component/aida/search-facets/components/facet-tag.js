import { Typography, Box, Tooltip } from '@mui/material';
import { IconX } from '@tabler/icons';
import { useSearchFacetsContext } from '../context';
import { genericGray } from 'aida-constants';

export const FacetTag = ({
  bucket,
  tagId,
  tagName = '',
  groupHasSelectedBuckets = false,
  selected = false,
  onClick = (f) => f
}) => {
  const { getTagFn } = useSearchFacetsContext();
  const tag = getTagFn(tagId);
  if (!tag) return null;

  const color = tag.color ?? genericGray;
  let extraClassName = '';
  if (selected) extraClassName += ' active';
  else if (groupHasSelectedBuckets) extraClassName += ' inactive';
  if (bucket.count <= 0) extraClassName += ' disabled';

  const tagBox = (
    <Box
      component="span"
      className={`FacetTag ${extraClassName}`}
      sx={{
        display: 'inline-flex',
        borderRadius: '4px',
        padding: '0 8px',
        m: 0.5,
        cursor: bucket.count > 0 ? 'pointer' : 'not-allowed',
        fontSize: '14px',
        height: '28px',
        lineHeight: '28px',
        alignItems: 'center',
        color: '#333333',
        borderWidth: '1px',
        borderColor: 'transparent',
        bgcolor: `${color}40`,
        '&:hover': {
          bgcolor: `${color}d0 !important`,
          borderColor: `${color}`,
          boxShadow: 'none'
        },
        '&.active': {
          bgcolor: `${color}80`,
          borderColor: `${color}`,
          boxShadow: 'none',
          backgroundImage: `linear-gradient(to bottom, rgb(236,253, 245, 0), ${color}, ${color}, rgb(236,253, 245, 0))`
        },
        '&.inactive, &.disabled': {
          bgcolor: `${color}80`,
          borderColor: `${color}`,
          boxShadow: 'none',
          backgroundImage: `linear-gradient(to bottom, rgb(236,253, 245, 0), ${color}, ${color}, rgb(236,253, 245, 0))`,
          filter: 'grayscale(100%)',
          opacity: 0.5
        },
        '&:focus': {
          boxShadow: '0 0 0 0.2rem rgba(0,123,255,.5)'
        }
      }}
      onClick={bucket.count > 0 ? onClick : null}
    >
      <Typography
        component="span"
        className="name"
        sx={{
          maxWidth: '11em',
          fontSize: 'inherit',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textAlign: 'center',
          padding: '0px',
          mr: selected ? 1 : 0
        }}
      >
        {tagName || tag.name}
      </Typography>
      {selected && <IconX className="btn" stroke={1.5} size="0.7rem" />}
    </Box>
  );

  return tag.name.length <= 24 ? tagBox : <Tooltip title={tag.name}>{tagBox}</Tooltip>;
};
