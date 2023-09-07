import { Box, SvgIcon } from '@mui/material';
import { fileTypeIcons } from 'aida-constants';
import { TypographyWithPopover } from './base';

export const DocName = ({ doc, width = 200 }) => (
  <Box sx={{ display: 'flex', alignItems: 'center', width }}>
    <SvgIcon
      component={fileTypeIcons[`${doc.file_type || 'file'}FileTypeIcon`]}
      inheritViewBox
      sx={{ width: '16px', height: '16px', mr: '8px' }}
    />
    <TypographyWithPopover
      copy
      noWrap
      popWidth={400}
      wrapperSx={{ width: 'calc(100% - 24px)' }}
      sx={{ width: '100%', fontSize: 12, fontWeight: 500 }}
    >
      {doc.doc_name}
    </TypographyWithPopover>
  </Box>
)