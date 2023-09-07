// material-ui
import { Typography, Box, Tooltip } from '@mui/material';
import { IconX } from '@tabler/icons';
import { genericGray } from 'aida-constants';

export const FacetGenericBucket = ({
  bucket,
  groupHasSelectedBuckets = false,
  selected = false,
  onClick = (f) => f
}) => {
  let extraClassName = '';
  if (selected) extraClassName += ' active';
  else if (groupHasSelectedBuckets) extraClassName += ' inactive';
  if (bucket.count <= 0) extraClassName += ' disabled';

  const bucketBox = (
    <Box
      component="span"
      className={`FacetGenericBucket ${extraClassName}`}
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
        genericGray: '#333333',
        borderWidth: '1px',
        borderColor: 'transparent',
        bgcolor: `${genericGray}40`,
        '&:hover': {
          bgcolor: `${genericGray}d0 !important`,
          borderColor: `${genericGray}`,
          boxShadow: 'none'
        },
        '&.active': {
          bgcolor: `${genericGray}80`,
          borderColor: `${genericGray}`,
          boxShadow: 'none',
          backgroundImage: `linear-gradient(to bottom, rgb(236,253, 245, 0), ${genericGray}, ${genericGray}, rgb(236,253, 245, 0))`
        },
        '&.inactive, &.disabled': {
          bgcolor: `${genericGray}80`,
          borderColor: `${genericGray}`,
          boxShadow: 'none',
          backgroundImage: `linear-gradient(to bottom, rgb(236,253, 245, 0), ${genericGray}, ${genericGray}, rgb(236,253, 245, 0))`,
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
        {bucket.caption}
      </Typography>
      {selected && <IconX className="btn" stroke={1.5} size="0.7rem" />}
    </Box>
  );

  return bucket.caption.length <= 24 ? bucketBox : <Tooltip title={bucket.caption}>{bucketBox}</Tooltip>;
};
