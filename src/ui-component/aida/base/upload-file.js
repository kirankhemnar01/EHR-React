import { forwardRef, useEffect } from 'react';
import { Box, Chip } from '@mui/material';

export const UploadFileControl = forwardRef(({
  files,
  accept,
  onAddFiles,
  children,
  onDeleteFile,
  showFiles = true,
  multiple = false,
  sx = {},
  ...others
}, ref) => {
  useEffect(() => {
    if (ref.current) {
      ref.current.files = files;
    }
  }, [files, ref]);

  const fileList = [...files];

  return (
    <Box sx={sx} {...others}>
      <input
        ref={ref}
        accept={accept}
        id="upload-file"
        multiple={multiple}
        type="file"
        style={{ display: 'none' }}
        onChange={e => onAddFiles(e.target.files)}
      />
      <label htmlFor="upload-file" style={{ display: 'inline', cursor: 'pointer' }}>
        {children}
      </label>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        {showFiles && fileList.map((file, idx) => (
          <Chip
            key={`${file.name}-${idx}`}
            label={file.name}
            onDelete={() => onDeleteFile(idx)}
          />
        ))}
      </Box>
    </Box>
  );
});
