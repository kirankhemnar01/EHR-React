import { useRef, useState, useEffect } from 'react';
import { Typography, Box, Popper } from '@mui/material';
import { CopyClipboard } from 'ui-component/aida/base/copy-clipboard';
import { useWindowSize } from 'hooks/useWindowSize';

export const TypographyWithPopover = ({ children, popWidth, copy, placement, wrapperSx = {}, ...others }) => {
  const [ellipsis, setEllipsis] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const elemRef = useRef(null);
  const parentRef = useRef(null);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { width } = useWindowSize();
  useEffect(() => {
    setEllipsis(
      elemRef.current?.offsetWidth < elemRef.current?.scrollWidth ||
        elemRef.current?.offsetHeight < elemRef.current?.scrollHeight
    );
  }, [width]);

  return (
    <Box ref={parentRef} sx={{ py: 1, ...wrapperSx }} onMouseEnter={handleOpen} onMouseLeave={handleClose}>
      <Typography ref={elemRef} {...others} aria-haspopup="true">
        {children}
      </Typography>
      {(copy || ellipsis) && (
        <Popper
          placement={placement ?? 'bottom-start'}
          open={!!anchorEl}
          style={{ zIndex: 1301 }}
          anchorEl={parentRef.current}
          modifiers={[
            {
              name: 'flip',
              enabled: true,
              options: {
                altBoundary: false,
                rootBoundary: 'viewport',
                padding: 8
              }
            },
            {
              name: 'preventOverflow',
              enabled: true,
              options: {
                altAxis: true,
                altBoundary: false,
                tether: true,
                rootBoundary: 'viewport',
                padding: 8
              }
            },
            {
              name: 'arrow',
              enabled: false,
              options: {
                element: elemRef
              }
            }
          ]}
        >
          <Box
            className="popover"
            sx={{
              width: popWidth,
              bgcolor: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              boxShadow: '4px 4px 12px 4px rgb(32 40 45 / 30%)'
            }}
          >
            {copy && <CopyClipboard text={children} sx={{ float: 'right', mt: 0.5 }} />}
            <Typography sx={{ maxWidth: popWidth, p: 1, wordBreak: 'break-word' }}>{children}</Typography>
          </Box>
        </Popper>
      )}
    </Box>
  );
};
