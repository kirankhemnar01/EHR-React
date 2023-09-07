import { Link } from '@mui/material';
import { TypographyWithPopover } from './base';

export const DocId = ({ onPreview, doc, sx = {} }) => (
  <Link
    href=""
    onClick={(e) => onPreview(e, doc)}
    sx={{ textDecoration: 'none', color: '#888', '&:hover': { textDecoration: 'underline' }, ...sx }}
  >
    <TypographyWithPopover
      copy
      noWrap
      popWidth={400}
      wrapperSx={{ width: '100%' }}
      sx={{ width: '100%', fontSize: 12, fontWeight: 500 }}
    >
      {doc.doc_id}
    </TypographyWithPopover>
  </Link>
);
