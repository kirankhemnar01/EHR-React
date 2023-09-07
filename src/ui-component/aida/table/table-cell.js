import { useState, useRef, useCallback } from 'react';
import { Box, TableCell } from '@mui/material';
import throttle from 'lodash.throttle';

export const ResizableTableCell = ({
  defaultWidth = 160, minWidth = 80, children, ...others
}) => {
  const [width, setWidth] = useState(defaultWidth);
  const positionRef = useRef(null);
  const elementRef = useRef(null);

  // eslint-disable-next-line
  const setDelayedWidth = useCallback(throttle(setWidth, 50), []);
  const handleMouseMove = useCallback((event) => {
    event.preventDefault();

    const dx = event.clientX - positionRef.current;
    setDelayedWidth(width => {
      const newWidth = width + dx;
      if (newWidth >= minWidth) {
        positionRef.current = event.clientX;
        return newWidth;
      }

      return minWidth;
    });
    // eslint-disable-next-line
  }, [minWidth]);

  const handleMouseUp = useCallback((event) => {
    event.preventDefault();
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    positionRef.current = null;
  }, [handleMouseMove]);

  const handleMouseDown = (event) => {
    event.preventDefault();
    positionRef.current = event.clientX;
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <TableCell
      sx={{
        border: 'none',
        borderLeft: '1px solid',
        borderColor: theme => theme.palette.grey['300'],
        position: 'relative',
        '& > div:last-child': { visibility: 'hidden' },
        '&:hover > div:last-child': { visibility: 'visible' },
        width,
      }}
      ref={elementRef}
      {...others}
    >
      {children}

      <Box
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        sx={{
          width: 4,
          bgcolor: theme => positionRef.current ? theme.palette.primary.main : theme.palette.grey['300'],
          '&:hover': { bgcolor: theme => theme.palette.primary.main },
          position: 'absolute',
          right: 0,
          top: 0,
          height: '100%',
          cursor: 'w-resize',
        }}
      />
    </TableCell>
  )
}
