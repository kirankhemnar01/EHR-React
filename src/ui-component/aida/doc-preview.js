import { Link } from 'react-router-dom';

import { Box, Typography, SvgIcon, IconButton, CircularProgress, Link as MuiLink } from '@mui/material';
import LaunchIcon from '@mui/icons-material/Launch';
import CloseIcon from '@mui/icons-material/Close';

import { useSelector } from 'store';
import { useDocument } from 'service/documents';
import { useNativeView } from 'service/docview';
import { NativeView } from 'ui-component/aida/native-view';
import { TypographyWithPopover } from './base';
import { fileTypeIcons } from 'aida-constants';
import { buildRouteForSiteDocument } from 'helpers';

export const useDocPreview = (projectId, documentId, onClose) => {
  const currentSiteId = useSelector((state) => state.menu.currentSiteId);
  const { data, loading, error } = useDocument(projectId, documentId);
  const {
    data: nativeViewData,
    error: nativeViewError,
    loading: nativeViewLoading
  } = useNativeView(projectId, documentId);

  if (error) {
    return [
      <Box sx={{ p: 2 }}>
        <Typography sx={{ color: (theme) => theme.palette.error.main }}>{error}</Typography>
      </Box>
    ];
  }

  if (!data && loading) {
    return [
      <CircularProgress sx={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
    ];
  }

  if (!data && !loading) {
    return [<Typography sx={{ p: 1 }}>No Data</Typography>];
  }

  const header = (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <SvgIcon
          component={fileTypeIcons[`${data.file_type || 'file'}FileTypeIcon`]}
          size={16}
          inheritViewBox
          sx={{ width: '16px', height: '16px', mr: '4px' }}
        />
        <TypographyWithPopover copy noWrap popWidth={320} sx={{ maxWidth: 240, fontSize: 16, fontWeight: 500 }}>
          {data.filename || data.doc_name}
        </TypographyWithPopover>
        <MuiLink
          component={Link}
          to={buildRouteForSiteDocument(currentSiteId, projectId, data.doc_id)}
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <SvgIcon sx={{ color: '#0BA5EC', fontSize: 20 }}>
            <LaunchIcon />
          </SvgIcon>
        </MuiLink>
      </Box>
      <IconButton aria-label="close" onClick={onClose} sx={{ color: (theme) => theme.palette.grey[800] }}>
        <CloseIcon />
      </IconButton>
    </>
  );
  const body = (
    <NativeView
      projectId={projectId}
      doc={data}
      nativeViewPathData={{
        data: nativeViewData,
        error: nativeViewError,
        loading: nativeViewLoading
      }}
      sx={{ flex: 1 }}
    />
  );

  return [header, body];
};
