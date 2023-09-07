import { useMemo } from 'react';

// material-ui
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { IconX } from '@tabler/icons';

import useAida from 'hooks/useAida';

export const ActionableDocTag = ({
  tagId,
  onClick = (f) => f,
  action = null,
  ActionIcon = IconX,
  withCrossLine = false
}) => {
  const { getTagDefinitionById, tagGroups: tagGroupsData } = useAida();
  const { data: tagGroups } = tagGroupsData;

  const tag = useMemo(() => getTagDefinitionById(tagId, tagGroups), [getTagDefinitionById, tagId, tagGroups]);

  if (!tag) return null;

  const tagBox = (
    <Box
      component="span"
      className="ActionableDocTag"
      sx={{
        display: 'inline-flex',
        borderRadius: '4px',
        padding: '0 8px',
        m: 0.5,
        cursor: 'pointer',
        fontSize: '12px',
        height: '22px',
        lineHeight: '22px',
        alignItems: 'center',
        color: '#333333',
        bgcolor: `${tag.color}80`,
        '& .btn': {
          ml: 0.5
        }
      }}
      onClick={onClick}
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
          textDecoration: withCrossLine ? 'line-through' : 'inherit'
        }}
      >
        {tag.name}
      </Typography>
      {action && (
        <ActionIcon
          className="btn"
          stroke={1.5}
          size="1rem"
          onClick={(event) => {
            event.stopPropagation();
            action(tagId);
          }}
        />
      )}
    </Box>
  );

  return tag.name.length <= 24 ? tagBox : <Tooltip title={tag.name}>{tagBox}</Tooltip>;
};
