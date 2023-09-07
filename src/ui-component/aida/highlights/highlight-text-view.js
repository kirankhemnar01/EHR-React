import { useState, useEffect } from 'react';

// material-ui
import { Typography, Button } from '@mui/material';

const TEXT_TRIM_LEN = 50;

export const HighlightTextView = ({ text, highlightColor, onClick, onSizeChanged }) => {
  const [expanded, setExpanded] = useState(null);
  useEffect(() => {
    if (text && text.length > TEXT_TRIM_LEN) setExpanded(false);
  }, [text]);

  let content;
  if (expanded === null)
    content = (
      <Typography
        sx={{ borderLeft: `5px solid ${highlightColor}`, pl: 1, fontStyle: 'italic', cursor: 'pointer' }}
        variant="body2"
        onClick={onClick}
      >
        {text}
      </Typography>
    );
  else if (expanded === false)
    content = (
      <Typography
        sx={{ borderLeft: `5px solid ${highlightColor}`, pl: 1, fontStyle: 'italic', cursor: 'pointer' }}
        variant="body2"
        onClick={onClick}
      >
        {text.substr(0, TEXT_TRIM_LEN)}
        <Button
          variant="text"
          size="small"
          sx={{ fontSize: '0.7rem', alignSelf: 'flex-start' }}
          onClick={(event) => {
            event.stopPropagation();
            setExpanded(true);
            if (onSizeChanged) onSizeChanged();
          }}
        >
          More
        </Button>
      </Typography>
    );
  else if (expanded === true)
    content = (
      <Typography
        sx={{ borderLeft: `5px solid ${highlightColor}`, pl: 1, fontStyle: 'italic', cursor: 'pointer' }}
        variant="body2"
        onClick={onClick}
      >
        {text}
        <Button
          variant="text"
          size="small"
          sx={{ fontSize: '0.7rem', alignSelf: 'flex-start' }}
          onClick={(event) => {
            event.stopPropagation();
            setExpanded(false);
            if (onSizeChanged) onSizeChanged();
          }}
        >
          Less
        </Button>
      </Typography>
    );

  return content;
};
