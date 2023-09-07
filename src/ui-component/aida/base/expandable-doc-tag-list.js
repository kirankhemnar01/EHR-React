import { useState } from 'react';

// material-ui
import { Chip } from '@mui/material';

// project imports
import { DocTag } from './doc-tag';

export const ExpandableDocTagList = ({ tags, defaultShowLen = 2 }) => {
  const [expanded, setExpanded] = useState(false);
  const tagCount = (tags || []).length;

  return expanded ? (
    tags.map((tagId) => <DocTag tagId={tagId} key={tagId} />)
  ) : (
    <>
      {tags.slice(0, defaultShowLen).map((tagId) => (
        <DocTag tagId={tagId} key={tagId} />
      ))}
      {tagCount > defaultShowLen && (
        <Chip
          size="small"
          sx={{ fontSize: '12px' }}
          label={`+${tagCount - defaultShowLen}`}
          onClick={(event) => {
            setExpanded(true);
            event.stopPropagation();
          }}
        />
      )}
    </>
  );
};
