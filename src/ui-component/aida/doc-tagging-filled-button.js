import { useMemo } from 'react';
import { Box, Tooltip, Typography } from '@mui/material';

import useAida from 'hooks/useAida';

export const DocTaggingFilledButton = ({ tagId, onClick }) => {
  const { getTagDefinitionById, tagGroups: tagGroupsData } = useAida();
  const { data: tagGroups } = tagGroupsData;

  const tag = useMemo(() => getTagDefinitionById(tagId, tagGroups), [getTagDefinitionById, tagId, tagGroups]);
  if (!tag) return null;

  const bgcolor = tag?.color ?? '#008800';
  const color = '#333333';
  const caption = tag.name;

  const handleClick = () => {
    if (onClick) onClick();
  };

  const taggingButton = (
    <Box
      className={`DocTaggingFilledButton DocTaggingFilledButton-${tagId}`}
      sx={{
        alignItems: 'center',
        borderLeft: `4px solid ${bgcolor}`,
        borderBottomRightRadius: '3px',
        borderTopRightRadius: '3px',
        color: `${color}`,
        display: 'flex',
        fontSize: '14px',
        fontWeight: 400,
        height: '26px',
        lineHeight: '26px',
        padding: '0 8px',
        position: 'relative',
        cursor: 'pointer',
        bgcolor: `${bgcolor}80`
      }}
    >
      <Typography
        component="span"
        onClick={handleClick}
        sx={{
          position: 'absolute',
          left: 0,
          padding: '0 3px',
          width: 'calc(100% - 4px)',
          textAlign: 'center',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}
      >
        {caption}
      </Typography>
    </Box>
  );

  return (
    <Box
      className="DocTaggingFilledButtonContainer"
      sx={{
        maxWidth: '24em',
        userSelect: 'none',
        position: 'relative'
      }}
    >
      <Box sx={{ visibility: 'hidden', height: 0, borderLeft: '4px', paddingLeft: '8px', paddingRight: '8px' }}>
        {`${caption.substr(0, 24)}___`}
      </Box>
      {caption.length <= 24 ? taggingButton : <Tooltip title={caption}>{taggingButton}</Tooltip>}
    </Box>
  );
};
